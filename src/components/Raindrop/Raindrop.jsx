import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import './Raindrop.css';
import RaindropImage from '../../assets/raindrop3.png';
import SnowFlakeImage from '../../assets/snowflake.png';

const Raindrop = ({ weather, day }) => {
    const overlayRef = useRef(null);
    const isRainyWeather = weather.includes('rain') || weather.includes('drizzle');
    const isHazyWeather = weather.includes('haze');
    let realImg = '';
    if (isRainyWeather) {
        realImg = RaindropImage;
      } else if (!isHazyWeather) {
        realImg = SnowFlakeImage;
      }

    useEffect(() => {
        if (!overlayRef.current) return;

        const scene = new THREE.Scene();  
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        overlayRef.current.appendChild(renderer.domElement);
        renderer.domElement.style.zIndex = -99999;

        // Sky
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient(0, 0, 0, 32);

        if (day) {
            gradient.addColorStop(0.0, '#d8dfed');
            gradient.addColorStop(0.3, '#d9e1e5');
            gradient.addColorStop(0.6, '#437ab6');
            gradient.addColorStop(0.8, '#d8dfed');
            gradient.addColorStop(1.0, '#b3cde0');
            gradient.addColorStop(1.0, '#d9e1e5');
        } else {
            gradient.addColorStop(0.0, '#000000');
            gradient.addColorStop(0.2, '#111111');
            gradient.addColorStop(0.4, '#222222');
            gradient.addColorStop(0.6, '#333333');
            gradient.addColorStop(0.8, '#444444');
            gradient.addColorStop(1.0, '#555555');
        }

        context.fillStyle = gradient;
        context.fillRect(0, 0, 1, 32);

        const skyMap = new THREE.CanvasTexture(canvas);
        skyMap.colorSpace = THREE.SRGBColorSpace;

        const sky = new THREE.Mesh(
            new THREE.SphereGeometry(10),
            new THREE.MeshBasicMaterial({ map: skyMap, side: THREE.BackSide })
        );
        scene.add(sky);

        // Haze
        if (isHazyWeather) {
            scene.fog = new THREE.Fog(0x000000, 0.1, 20);
        }

        // Particle logic
        const particleCount = 1000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = Math.random() * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            velocities[i] = isRainyWeather ? Math.random() * 0.005 + 0.002 : Math.random() * 0.01 + 0.005;
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('velocity', new THREE.BufferAttribute(velocities, 1));
        if(isHazyWeather){
            scene.fog = new THREE.Fog(0x000000, 0.1, 20);
        }
        
        const particleMaterial = new THREE.PointsMaterial({ 
            color: 0xd4f1f7,
            size: 0.1,
            map: new THREE.TextureLoader().load(realImg),
            transparent: true,
        });

        const particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);

        const animate = () => {
            requestAnimationFrame(animate);

            const positionsArray = particleSystem.geometry.attributes.position.array;
            const velocitiesArray = particleSystem.geometry.attributes.velocity.array;

            for (let i = 0; i < particleCount; i++) {
                positionsArray[i * 3 + 1] -= velocitiesArray[i];

                if (positionsArray[i * 3 + 1] < -5) {
                    positionsArray[i * 3 + 1] = 5;
                    positionsArray[i * 3] = (Math.random() - 0.5) * 10;
                    positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 10;
                    velocitiesArray[i] = isRainyWeather ? Math.random() * 0.005 + 0.002 : Math.random() * 0.01 + 0.005;
                }
            }

            particleSystem.geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        };

        animate();

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (overlayRef.current && overlayRef.current.contains(renderer.domElement)) {
                overlayRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [isRainyWeather, isHazyWeather]); // Re-render when weather changes

    return <div ref={overlayRef} className="rain-animation-overlay" />;
};

Raindrop.propTypes = {
    weather: PropTypes.string.isRequired,
    day: PropTypes.bool.isRequired,
};

export default Raindrop;