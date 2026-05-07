'use client';
import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Float } from '@react-three/drei';
import { Group } from 'three';
import OBJModelViewer from '@/components/OBJModelViewer';

function RotatingCarGroup() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2} floatingRange={[-0.1, 0.1]}>
        <OBJModelViewer
          modelUrl="/models/uploads_files_2792345_Koenigsegg.obj"
          scale={0.01}
          position={[0, -1, 0]}
          rotation={[0, Math.PI, 0]}
        />
      </Float>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }}>
      <Canvas shadows camera={{ position: [6, 3, 6], fov: 45 }}>
        <color attach="background" args={['#0a0a0a']} />
        
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[0, 10, 0]} intensity={1.5} penumbra={1} castShadow angle={0.6} />
        <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#3b82f6" />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#f59e0b" />
        <pointLight position={[0, -2, 0]} intensity={0.5} color="#8b5cf6" />
        
        <Suspense fallback={null}>
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
              <mesh position={[0, 10, -10]} scale={[20, 20, 1]}>
                <planeGeometry />
                <meshBasicMaterial color="#3b82f6" />
              </mesh>
              <mesh position={[-10, 5, 0]} scale={[20, 20, 1]} rotation={[0, Math.PI / 2, 0]}>
                <planeGeometry />
                <meshBasicMaterial color="#f59e0b" />
              </mesh>
              <mesh position={[10, 5, 0]} scale={[20, 20, 1]} rotation={[0, -Math.PI / 2, 0]}>
                <planeGeometry />
                <meshBasicMaterial color="#8b5cf6" />
              </mesh>
            </group>
          </Environment>
          <RotatingCarGroup />
          <ContactShadows resolution={1024} scale={20} blur={2.5} opacity={0.8} far={10} color="#000000" position={[0, -0.1, 0]} />
        </Suspense>

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          autoRotate={false} 
          minPolarAngle={Math.PI / 3} 
          maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
      {/* Overlay gradient to make UI text pop */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
