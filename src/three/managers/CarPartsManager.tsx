'use client';

import React, { useMemo } from 'react';
import { ThreeEvent, useGLTF, TransformControls } from '@react-three/drei';
import { useStudioContext } from '@/context/StudioContext';
import * as THREE from 'three';

export function CarPartsManager({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { setActiveTool, carConfig, transformMode, selectedPart, setSelectedPart } = useStudioContext();

  // Clone scene so we don't mutate the cached global useGLTF scene
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: carConfig.paintColor,
        metalness: carConfig.metallic / 100,
        roughness: 1 - carConfig.glossiness / 100,
        clearcoat: 1.0,
      }),
    [carConfig.paintColor, carConfig.metallic, carConfig.glossiness]
  );

  const bodyHighlight = useMemo(() => {
    const highlight = bodyMaterial.clone();
    highlight.emissive = new THREE.Color('#00f3ff');
    highlight.emissiveIntensity = 0.5;
    return highlight;
  }, [bodyMaterial]);

  const rimMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: carConfig.rimColor,
        metalness: 0.8,
        roughness: 0.3,
      }),
    [carConfig.rimColor]
  );

  const rimHighlight = useMemo(() => {
    const highlight = rimMaterial.clone();
    highlight.emissive = new THREE.Color('#9d00ff');
    highlight.emissiveIntensity = 0.8;
    return highlight;
  }, [rimMaterial]);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const object = e.object as THREE.Mesh;
    const name = object.name.toLowerCase();
    
    // Heuristic detection based on mesh names standard in automative GLTFs
    if (name.includes('wheel') || name.includes('tire') || name.includes('rim')) {
      object.material = rimHighlight;
      document.body.style.cursor = 'pointer';
    } else if (name.includes('body') || name.includes('door') || name.includes('hood') || name.includes('spoiler')) {
      object.material = bodyHighlight;
      document.body.style.cursor = 'pointer';
    }
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const object = e.object as THREE.Mesh;
    const name = object.name.toLowerCase();

    if (name.includes('wheel') || name.includes('tire') || name.includes('rim')) {
      object.material = rimMaterial;
      document.body.style.cursor = 'auto';
    } else if (name.includes('body') || name.includes('door') || name.includes('hood') || name.includes('spoiler')) {
      object.material = bodyMaterial;
      document.body.style.cursor = 'auto';
    }
  };

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const object = e.object as THREE.Mesh;
    const name = object.name;
    
    setSelectedPart(name);
    setActiveTool('parts');
  };

  const activeMesh = useMemo(() => {
    if (!selectedPart) return null;
    let found = null;
    clonedScene.traverse((child) => {
      if (child.name === selectedPart) found = child;
    });
    return found;
  }, [selectedPart, clonedScene]);

  // Pre-apply base materials to the cloned scene on load
  useMemo(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const name = mesh.name.toLowerCase();
        
        // Setup shadows and default mapping
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        if (name.includes('body') || name.includes('chassis')) {
          mesh.material = bodyMaterial;
        } else if (name.includes('wheel') || name.includes('rim')) {
          mesh.material = rimMaterial;
        }
      }
    });
  }, [clonedScene, bodyMaterial, rimMaterial]);

  return (
    <>
      <primitive 
        object={clonedScene} 
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        position={[0, 0, 0]}
      />
      {activeMesh && transformMode && (
        <TransformControls object={activeMesh as THREE.Object3D} mode={transformMode} />
      )}
    </>
  );
}
