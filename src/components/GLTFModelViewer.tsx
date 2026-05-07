'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { modelLoader } from '@/services/ModelLoaderService';

interface GLTFModelViewerProps {
  modelUrl: string;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

function GLTFModel({ modelUrl, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0], color }: GLTFModelViewerProps) {
  const groupRef = useRef<Group>(null);
  const [model, setModel] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await modelLoader.fetchModel(modelUrl);
        setModel(loadedModel);
      } catch (err) {
        console.error('Failed to load GLTF model:', err);
        setError('Failed to load model');
      }
    };
    loadModel();
  }, [modelUrl]);

  useEffect(() => {
    if (model && color) {
      import('three').then((THREE) => {
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const matName = child.material?.name?.toLowerCase() || '';
            const meshName = child.name.toLowerCase();
            
            // Heuristic to only paint the body, avoiding glass, tires, dark plastics, interior
            const isGlassOrTire = matName.includes('glass') || matName.includes('tire') || matName.includes('wheel') || matName.includes('black') || matName.includes('interior') || matName.includes('window') || meshName.includes('glass') || meshName.includes('tire');

            if (!isGlassOrTire && matName.includes('body')) {
              if (!child.userData.originalMaterial) {
                child.userData.originalMaterial = child.material;
              }
              const newMat = child.userData.originalMaterial.clone();
              if (newMat.color) {
                newMat.color.set(color);
              }
              child.material = newMat;
            }
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
        <mesh><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#ff0000" /></mesh>
      </group>
    );
  }

  if (!model) return null;

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={model} />
    </group>
  );
}

export default function GLTFModelViewer(props: GLTFModelViewerProps) {
  return (
    <Suspense fallback={null}>
      <GLTFModel {...props} />
    </Suspense>
  );
}
