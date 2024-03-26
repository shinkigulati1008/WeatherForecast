import  { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './SunnyBackground.css';
import moonTextureImage from '../../assets/moonbg.png';
import SunTextureImage from '../../assets/rays2.png';
import PropTypes from 'prop-types';

const SunnyBackground = ({ day }) => {
    const overlayRef = useRef(null);
    const realImg = day ? SunTextureImage : moonTextureImage
    useEffect(() => {
        if (!overlayRef.current) return;

        // Create a new Three.js scene
        const scene = new THREE.Scene();
        //scene.background = new THREE.Color(0xedf2f0); // Light sky blue background

        // Create a camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 1.5) // Adjusted camera position to be closer
        camera.lookAt(scene.position); // Ensure the camera is looking at the center of the scene

        // Create a renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        overlayRef.current.appendChild(renderer.domElement);
        renderer.domElement.style.zIndex = -99999;

        //sky
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 32;

        const context = canvas.getContext('2d');
        const gradient = context.createLinearGradient( 0, 0, 0, 32 );
    
        if(day === true){
            gradient.addColorStop( 0.0, '#014a84' );
            gradient.addColorStop( 0.5, '#0561a0' );
            gradient.addColorStop( 1.0, '#437ab6' );
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
        context.fillRect( 0, 0, 1, 32 );
    
        const skyMap = new THREE.CanvasTexture( canvas );
        skyMap.colorSpace = THREE.SRGBColorSpace;
    
        const sky = new THREE.Mesh(
            new THREE.SphereGeometry( 10 ),
            new THREE.MeshBasicMaterial( { map: skyMap, side: THREE.BackSide } )
        );
        scene.add( sky );
        
        // Load textures
        const textureLoader = new THREE.TextureLoader();
        const rayTexture2 = textureLoader.load(realImg);

        // Add some rays with texture
        const rayGeometry = new THREE.PlaneGeometry(2,2);
        const rayMaterial2 = new THREE.MeshBasicMaterial({ map: rayTexture2, transparent: true });
        const ray2 = new THREE.Mesh(rayGeometry, rayMaterial2);
        ray2.position.set(2, 0, 0);
        scene.add(ray2);
        
        let opacityDirection = -1; // Start with decreasing opacity
        const blinkSpeed = 0.005; // Adjust t
        const minOpacity = 0.5; 

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            rayMaterial2.opacity += blinkSpeed * opacityDirection;
            rayMaterial2.opacity = Math.max(minOpacity, rayMaterial2.opacity);
            // Reverse opacity direction when reaching limits
            if (rayMaterial2.opacity <= minOpacity  || rayMaterial2.opacity >= 1) {
                opacityDirection *= -1;
            }
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

    return <div className="sunny-background-overlay" ref={overlayRef} />;
};

SunnyBackground.propTypes = {
    day: PropTypes.bool.isRequired
}

export default SunnyBackground;
