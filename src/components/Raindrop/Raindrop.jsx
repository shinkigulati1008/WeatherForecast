import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import './Raindrop.css';
import RaindropImage from '../../assets/raindrop3.png';
import SnowFlakeImage from '../../assets/snowflake.png';

const Raindrop = ({ weather, day }) => {
    const overlayRef = useRef(null);
    const realImg = weather.includes('rain') ? RaindropImage : SnowFlakeImage;
    useEffect(() => {
        if (!overlayRef.current) return;
        // Create a new Three.js scene
        const scene = new THREE.Scene();  
        //scene.background = new THREE.Color(0xEDF2F0);
        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Create a renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true });
       /// const renderer = new THREE.Color(0x000000); 
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Append the renderer to the body
        overlayRef.current.appendChild(renderer.domElement);
        renderer.domElement.style.zIndex = -99999;
         
        // Sky
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient( 0, 0, 0, 32 );
        if(day === true){
            gradient.addColorStop(0.0, '#d8dfed'); // Dark blue at the top
            gradient.addColorStop(0.3, '#d9e1e5'); // Medium blue
            gradient.addColorStop(0.6, '#437ab6'); // Light blue
            gradient.addColorStop(0.8, '#d8dfed'); // Adding a touch of white/gray to represent rain
            gradient.addColorStop(1.0, '#b3cde0'); // Lighter blue at the bottom
            gradient.addColorStop(1.0, '#d9e1e5');
        }       
        else{
            gradient.addColorStop(0.0, '#000000'); // Black at the top
            gradient.addColorStop(0.2, '#111111'); // Dark gray
            gradient.addColorStop(0.4, '#222222'); // Darker gray
            gradient.addColorStop(0.6, '#333333'); // Even darker gray
            gradient.addColorStop(0.8, '#444444'); // Very dark gray
            gradient.addColorStop(1.0, '#555555'); // Almost black at the bottom
        }


        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 32);

        const skyMap = new THREE.CanvasTexture( canvas );
        skyMap.colorSpace = THREE.SRGBColorSpace;

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry( 10 ),
            new THREE.MeshBasicMaterial( { map: skyMap, side: THREE.BackSide } )
        );
        scene.add( sky );

        // Create raindrop particles using BufferGeometry
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3); // 3 values per particle
        const velocities = new Float32Array(particleCount); // 1 value per particle for velocity

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10; // x
            positions[i * 3 + 1] = Math.random() * 10; // y
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
            velocities[i] = Math.random() * 0.01 + 0.005; // Random speed between 0.005 and 0.015
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
        //0xffffff
        const particleMaterial = new THREE.PointsMaterial({ 
            color: 0xd4f1f7,
            size: 0.1,
            map : new THREE.TextureLoader().load(realImg),
            transparent: true,
        });
        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            const positionsArray = particleSystem.geometry.attributes.position.array;
            const velocitiesArray = particleSystem.geometry.attributes.velocity.array;

            for (let i = 0; i < particleCount; i++) {
                positionsArray[i * 3 + 1] -= velocitiesArray[i]; // Move y position down

                if (positionsArray[i * 3 + 1] < -5) {
                    positionsArray[i * 3 + 1] = 5; // Reset y position to the top
                    positionsArray[i * 3] = (Math.random() - 0.5) * 10; // Reset x position
                    positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 10; // Reset z position
                    velocitiesArray[i] = Math.random() * 0.01 + 0.005; // Reset velocity
                }
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup function
        return () => {
            window.removeEventListener('resize', handleResize);
            if (overlayRef.current && overlayRef.current.contains(renderer.domElement)) {
                overlayRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []); // Empty dependency array means this effect runs once on mount

    return <div ref={overlayRef} className="rain-animation-overlay" /> // Return null since we're not rendering anything in the component
};

Raindrop.propTypes = {
    weather: PropTypes.string.isRequired,
    day: PropTypes.bool.isRequired 
};

export default Raindrop;
