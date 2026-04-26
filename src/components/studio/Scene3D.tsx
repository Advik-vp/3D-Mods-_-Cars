'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { CarModel } from './CarModel';
import { useStudioContext } from '@/context/StudioContext';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { useThree } from '@react-three/fiber';

// Inside Canvas context listener for exports
function ExporterPlugin() {
  const { scene } = useThree();
  
  React.useEffect(() => {
    const handleExport = () => {
      const exporter = new GLTFExporter();
      exporter.parse(
        scene,
        (gltf) => {
          const blob = new Blob([JSON.stringify(gltf)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'modified-studio-car.gltf';
          link.click();
        },
        (error) => console.error('Export Error', error),
        { binary: false }
      );
    };
    
    window.addEventListener('export-gltf', handleExport);
    return () => window.removeEventListener('export-gltf', handleExport);
  }, [scene]);

  return null;
}

export function Scene3D() {
  const { carConfig } = useStudioContext();

  return (
    <Canvas 
      camera={{ position: [4, 2, 6], fov: 45 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={['#050508']} />
      <fog attach="fog" args={['#050508', 10, 30]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={2} color="#00f3ff" castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={2.5} color="#9d00ff" />
      <spotLight position={[0, 8, 0]} intensity={1.5} angle={Math.PI / 4} penumbra={0.5} castShadow />

      {/* Cyberpunk Environment Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <ringGeometry args={[2.5, 2.7, 64]} />
        <meshBasicMaterial color="#00f3ff" transparent opacity={0.6} side={2} />
      </mesh>
      
      <gridHelper args={[20, 40, '#00f3ff', '#111111']} position={[0, -0.02, 0]} />

      <Suspense fallback={null}>
        {/* Customizable Car Component */}
        <CarModel config={carConfig} />
        <ExporterPlugin />

        {/* R3F Environment & Lighting */}
        <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={3} color="#000000" />
      </Suspense>

      <OrbitControls 
        makeDefault 
        minPolarAngle={0} 
        maxPolarAngle={Math.PI / 2 - 0.05} 
        enablePan={false}
        minDistance={3}
        maxDistance={15}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </Canvas>
  );
}
