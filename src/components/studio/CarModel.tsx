'use client';

import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { CarConfig, useStudioContext } from '@/context/StudioContext';
import * as THREE from 'three';
import { CarPartsManager } from '@/three/managers/CarPartsManager';

interface CarModelProps {
  config: CarConfig;
}

export function CarModel({ config }: CarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const underglowRef = useRef<THREE.Mesh>(null);
  const { setActiveTool } = useStudioContext();

  // Part detection highlight state
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  // Animate the underglow pulse
  useFrame(({ clock }) => {
    if (underglowRef.current && config.neonEnabled) {
      const material = underglowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = (config.neonIntensity / 100) * (0.6 + Math.sin(clock.getElapsedTime() * 2) * 0.2);
    }
  });

  // Dynamic Materials based on Context
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: config.paintColor,
    metalness: config.metallic / 100,
    roughness: 1 - (config.glossiness / 100),
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  });

  const bodyHighlightMaterial = bodyMaterial.clone();
  bodyHighlightMaterial.emissive = new THREE.Color('#00f3ff');
  bodyHighlightMaterial.emissiveIntensity = 0.5;

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: '#000000',
    metalness: 0.9,
    roughness: 0.1,
    transmission: 0.8,
    transparent: true,
  });

  const rimMaterial = new THREE.MeshStandardMaterial({
    color: config.rimColor,
    metalness: 0.8,
    roughness: 0.3,
  });

  const rimHighlightMaterial = rimMaterial.clone();
  rimHighlightMaterial.emissive = new THREE.Color('#9d00ff');
  rimHighlightMaterial.emissiveIntensity = 0.8;

  // Interaction handlers for "Part Detection" simulation
  const handlePointerOver = (e: ThreeEvent<PointerEvent>, partName: string) => {
    e.stopPropagation();
    setHoveredPart(partName);
    document.body.style.cursor = 'pointer';
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHoveredPart(null);
    document.body.style.cursor = 'auto';
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    // When a part is clicked, open the parts editor
    setActiveTool('parts');
  };

  const wheelRadius = 0.35;
  const wheelPositions = [
    [1.0, wheelRadius, 1.3],
    [-1.0, wheelRadius, 1.3],
    [1.0, wheelRadius, -1.2],
    [-1.0, wheelRadius, -1.2],
  ];

  if (config.importedModelUrl) {
    return (
      <group>
        <React.Suspense fallback={null}>
          <CarPartsManager url={config.importedModelUrl} />
        </React.Suspense>
        
        {/* Neon Underglow for imported models */}
        {config.neonEnabled && (
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
            <planeGeometry args={[2.5, 5]} />
            <meshBasicMaterial 
              color={config.neonColor} 
              transparent 
              opacity={config.neonIntensity / 100 * 0.8} 
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        )}
      </group>
    );
  }

  return (
    <group ref={groupRef}>
      {/* HUD Overlay for hovered part */}
      {/* We normally render HTML overlays via Html from drei, but updating state is enough here */}

      {/* Main Body */}
      <mesh 
        position={[0, 0.45, 0]} 
        material={hoveredPart === 'body' ? bodyHighlightMaterial : bodyMaterial} 
        castShadow 
        receiveShadow
        onPointerOver={(e) => handlePointerOver(e, 'body')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        name="body"
      >
        {config.widebody ? (
          <boxGeometry args={[1.9, 0.5, 4.3]} />
        ) : (
          <boxGeometry args={[1.8, 0.5, 4.2]} />
        )}
      </mesh>

      {/* Cabin/Glass (Roof area) */}
      <mesh 
        position={[0, 0.9, -0.2]} 
        material={glassMaterial}
        onPointerOver={(e) => handlePointerOver(e, 'roof')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        name="roof"
      >
        <boxGeometry args={[1.4, 0.4, 1.8]} />
      </mesh>

      {/* Nose (Hood) */}
      <mesh 
        position={[0, 0.45, 2.1]} 
        material={hoveredPart === 'hood' ? bodyHighlightMaterial : bodyMaterial} 
        rotation={[Math.PI/2, 0, 0]}
        onPointerOver={(e) => handlePointerOver(e, 'hood')}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        name="hood"
      >
        <cylinderGeometry args={[0, 0.9, 1, 3, 1]} />
      </mesh>

      {/* Headlights (Mock components on nose) */}
      <mesh position={[-0.6, 0.6, 2.3]} rotation={[0, -0.2, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0.6, 0.6, 2.3]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* Front Splitter Toggle Component */}
      {config.frontSplitter && (
        <mesh position={[0, 0.2, 2.6]} material={bodyMaterial}>
          <boxGeometry args={[1.9, 0.05, 0.3]} />
        </mesh>
      )}

      {/* Rear Spoiler Toggle Component */}
      {config.rearSpoiler && (
        <group 
          position={[0, 0.75, -2.0]}
          onPointerOver={(e) => handlePointerOver(e, 'spoiler')}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <mesh position={[-0.5, 0.1, 0]} material={hoveredPart === 'spoiler' ? bodyHighlightMaterial : bodyMaterial}>
            <boxGeometry args={[0.05, 0.2, 0.1]} />
          </mesh>
          <mesh position={[0.5, 0.1, 0]} material={hoveredPart === 'spoiler' ? bodyHighlightMaterial : bodyMaterial}>
            <boxGeometry args={[0.05, 0.2, 0.1]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} material={hoveredPart === 'spoiler' ? bodyHighlightMaterial : bodyMaterial}>
            <boxGeometry args={[1.8, 0.05, 0.4]} />
          </mesh>
        </group>
      )}

      {/* Wheels */}
      {wheelPositions.map((pos, i) => (
        <group 
          key={i} 
          position={pos as [number, number, number]}
          onPointerOver={(e) => handlePointerOver(e, 'wheel')}
          onPointerOut={handlePointerOut}
          onClick={handleClick}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]} material={new THREE.MeshStandardMaterial({ color: '#111' })}>
            <torusGeometry args={[wheelRadius, 0.15, 16, 32]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={hoveredPart === 'wheel' ? rimHighlightMaterial : rimMaterial}>
            <cylinderGeometry args={[wheelRadius, wheelRadius, 0.25, 32]} />
          </mesh>
        </group>
      ))}

      {/* Neon Underglow */}
      {config.neonEnabled && (
        <mesh ref={underglowRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
          <planeGeometry args={[1.8, 4.2]} />
          <meshBasicMaterial 
            color={config.neonColor} 
            transparent 
            opacity={0.8} 
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
