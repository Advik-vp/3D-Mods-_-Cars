'use client';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { determineBaseGeometry } from '@/lib/constants';

type CarConfig = {
  targetCar?: string;
  color?: string;
  wheels?: string;
  spoiler?: string;
  headlights?: string;
  windowTint?: string;
  interiorColor?: string;
};

export default function CarModel({ config }: { config: CarConfig }) {
  const carRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (carRef.current) {
      carRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const bodyColor = config.color || '#ffffff';
  const wheelsColor = config.wheels === 'sport' ? '#111111' : '#555555';
  const hasSpoiler = config.spoiler === 'carbon' || config.spoiler === 'sport';
  const interiorColor = config.interiorColor || '#000000';
  
  // Calculate window tint opacity
  let windowOpacity = 0.8;
  if (config.windowTint === 'medium') windowOpacity = 0.5;
  else if (config.windowTint === 'dark') windowOpacity = 0.15;

  const baseModel = determineBaseGeometry(config.targetCar || 'Maruti Suzuki Dzire');

  // Geometry parameters dynamically adjusting to chosen base model
  let bodyArgs: [number, number, number] = [1.8, 0.6, 4];
  let roofArgs: [number, number, number] = [1.4, 0.5, 2];
  let roofPos: [number, number, number] = [0, 1.1, -0.2];
  let wheelHeight = 0.3;
  let headlightZ = 2.01;

  if (baseModel === 'suv') {
    bodyArgs = [2.0, 0.8, 4.2];
    roofArgs = [1.6, 0.6, 2.5];
    roofPos = [0, 1.4, 0];
    wheelHeight = 0.4;
    headlightZ = 2.11;
  } else if (baseModel === 'hatchback') {
    bodyArgs = [1.7, 0.6, 3.2];
    roofArgs = [1.3, 0.6, 1.8];
    roofPos = [0, 1.15, -0.5];
    headlightZ = 1.61;
  }

  // Calculate inner geometry bounds to represent "interior color" visible through glasses
  const interiorArgs: [number, number, number] = [roofArgs[0] - 0.1, roofArgs[1] - 0.1, roofArgs[2] - 0.1];

  return (
    <group ref={carRef}>
      {/* Main Body */}
      <mesh position={[0, baseModel === 'suv' ? 0.7 : 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={bodyArgs} />
        <meshStandardMaterial color={bodyColor} roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* Cabin / Windows (Tinted) */}
      <mesh position={roofPos} castShadow receiveShadow>
        <boxGeometry args={roofArgs} />
        <meshStandardMaterial color="#111122" roughness={0.0} metalness={1.0} transparent opacity={windowOpacity} />
      </mesh>

      {/* Interior Color (visible through windows) */}
      <mesh position={roofPos}>
        <boxGeometry args={interiorArgs} />
        <meshStandardMaterial color={interiorColor} />
      </mesh>

      {/* Wheels */}
      {[-0.9, 0.9].map((x, i) => 
        [-1.2, 1.2].map((z, j) => (
          <mesh 
            key={`wheel-${i}-${j}`} 
            position={[x, wheelHeight, baseModel === 'hatchback' && z < 0 ? -1.0 : z]} 
            rotation={[0, 0, Math.PI / 2]} 
            castShadow
          >
            <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} />
            <meshStandardMaterial color={wheelsColor} roughness={0.8} metalness={0.2} />
          </mesh>
        ))
      )}

      {/* Spoiler */}
      {hasSpoiler && (
        <group position={[0, roofPos[1], baseModel === 'hatchback' ? -1.3 : -1.8]}>
          <mesh position={[0, 0, 0]} castShadow>
             <boxGeometry args={[1.6, 0.05, 0.3]} />
             <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[-0.6, -0.15, 0]}>
             <boxGeometry args={[0.05, 0.3, 0.2]} />
             <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.6, -0.15, 0]}>
             <boxGeometry args={[0.05, 0.3, 0.2]} />
             <meshStandardMaterial color="#222" />
          </mesh>
        </group>
      )}

      {/* Headlights */}
      <mesh position={[-0.6, baseModel === 'suv' ? 0.8 : 0.6, headlightZ]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={config.headlights === 'led' ? 2 : 0.5} />
      </mesh>
      <mesh position={[0.6, baseModel === 'suv' ? 0.8 : 0.6, headlightZ]}>
        <boxGeometry args={[0.3, 0.15, 0.05]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={config.headlights === 'led' ? 2 : 0.5} />
      </mesh>
    </group>
  );
}
