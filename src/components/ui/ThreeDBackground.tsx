
"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const starsRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.FogExp2(0x020617, 0.0008);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ========================================
    // 1. MAIN PARTICLE SYSTEM
    // ========================================
    const particleCount = 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Positions in a sphere
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Colors - Emerald/Cyan gradient
      const color = new THREE.Color().setHSL(0.4 + Math.random() * 0.2, 1, 0.5);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // ========================================
    // 2. STARS PARTICLE SYSTEM (Background)
    // ========================================
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 200;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 50 - 30;
    }
    
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    
    const starSystem = new THREE.Points(starGeometry, starMaterial);
    scene.add(starSystem);
    starsRef.current = starSystem;

    // ========================================
    // 3. FLOATING ORBS
    // ========================================
    const orbGroup = new THREE.Group();
    const orbCount = 8;
    const orbs: THREE.Mesh[] = [];
    
    for (let i = 0; i < orbCount; i++) {
      const size = 0.2 + Math.random() * 0.3;
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.45 + Math.random() * 0.1, 1, 0.6),
        emissive: new THREE.Color().setHSL(0.45, 1, 0.2),
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      });
      
      const orb = new THREE.Mesh(geometry, material);
      orb.userData = {
        speedX: (Math.random() - 0.5) * 0.003,
        speedY: (Math.random() - 0.5) * 0.003,
        speedZ: (Math.random() - 0.5) * 0.002,
        rangeX: 5 + Math.random() * 3,
        rangeY: 3 + Math.random() * 2,
        rangeZ: 4 + Math.random() * 2,
        startX: (Math.random() - 0.5) * 10,
        startY: (Math.random() - 0.5) * 6,
        startZ: (Math.random() - 0.5) * 8 - 5,
      };
      
      orb.position.x = orb.userData.startX;
      orb.position.y = orb.userData.startY;
      orb.position.z = orb.userData.startZ;
      
      orbGroup.add(orb);
      orbs.push(orb);
    }
    
    scene.add(orbGroup);

    // ========================================
    // 4. RINGS
    // ========================================
    const ringGeometry = new THREE.TorusGeometry(3.5, 0.03, 64, 500);
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x10b981,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0.5,
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    
    const ring2Geometry = new THREE.TorusGeometry(5, 0.02, 64, 500);
    const ring2Material = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x06b6d4,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.4,
    });
    
    const ring2 = new THREE.Mesh(ring2Geometry, ring2Material);
    ring2.rotation.x = Math.PI / 2;
    ring2.rotation.z = 0.5;
    scene.add(ring2);

    // ========================================
    // 5. LIGHTS
    // ========================================
    const ambientLight = new THREE.AmbientLight(0x111122);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x10b981, 1, 30);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x06b6d4, 0.8, 30);
    pointLight2.position.set(-5, -3, 5);
    scene.add(pointLight2);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 2, 1);
    scene.add(directionalLight);
    
    const backLight = new THREE.PointLight(0x8b5cf6, 0.5);
    backLight.position.set(0, 0, -8);
    scene.add(backLight);

    // ========================================
    // 6. MOUSE INTERACTION
    // ========================================
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = (event.clientY / window.innerHeight) * 2 - 1;
      targetRotationY = mouseX * 0.5;
      targetRotationX = mouseY * 0.3;
    };
    
    window.addEventListener('mousemove', handleMouseMove);

    // ========================================
    // 7. ANIMATION LOOP
    // ========================================
    let time = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.005;
      
      // Rotate particle system
      if (particlesRef.current) {
        particlesRef.current.rotation.y = time * 0.1;
        particlesRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
      }
      
      // Animate stars
      if (starsRef.current) {
        starsRef.current.rotation.y = time * 0.02;
      }
      
      // Animate orbs
      orbs.forEach((orb, i) => {
        const data = orb.userData;
        orb.position.x = data.startX + Math.sin(time * data.speedX * 10) * data.rangeX;
        orb.position.y = data.startY + Math.cos(time * data.speedY * 10) * data.rangeY;
        orb.position.z = data.startZ + Math.sin(time * data.speedZ * 10) * data.rangeZ;
      });
      
      // Animate rings
      ring.rotation.z = time * 0.1;
      ring2.rotation.x = Math.PI / 2 + Math.sin(time * 0.2) * 0.1;
      ring2.rotation.y = time * 0.05;
      
      // Mouse follow camera
      camera.position.x += (targetRotationY * 1.5 - camera.position.x) * 0.05;
      camera.position.y += (-targetRotationX * 1.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
      
      // Pulse lights
      const pulse = Math.sin(time * 2) * 0.3 + 0.7;
      pointLight1.intensity = 0.8 + Math.sin(time * 1.5) * 0.3;
      pointLight2.intensity = 0.6 + Math.cos(time * 1.8) * 0.3;
      
      renderer.render(scene, camera);
    };
    
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: -10 }}
    />
  );
};

export default ThreeDBackground;
