'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { modelLoader } from '@/services/ModelLoaderService';

interface OBJModelViewerProps {
  modelUrl: string;
  mtlUrl?: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

function OBJModel({ modelUrl, mtlUrl, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], color }: OBJModelViewerProps) {
  const groupRef = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await modelLoader.loadOBJModel(modelUrl, mtlUrl);
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load OBJ model:', err);
        setError('Failed to load model');
      }
    };

    loadModel();
  }, [modelUrl, mtlUrl]);

  useEffect(() => {
    if (model && color) {
      import('three').then((THREE) => {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            // Apply high quality physical material for car paint
            if (!child.userData.originalMaterial) {
              child.userData.originalMaterial = child.material;
            }
            child.material = new THREE.MeshPhysicalMaterial({
              color: color,
              metalness: 0.7,
              roughness: 0.1,
              clearcoat: 1.0,
              clearcoatRoughness: 0.05,
              envMapIntensity: 2.0,
            });
          }
        });
      });
    }
  }, [model, color]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  if (error) {
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
      </group>
    );
  }

  if (!model) {
    return (
      <group position={position}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

export default function OBJModelViewer(props: OBJModelViewerProps) {
  return (
    <Suspense fallback={
      <group position={props.position}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      </group>
    }>
      <OBJModel {...props} />
    </Suspense>
  );
}