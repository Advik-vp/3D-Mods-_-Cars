'use client';
import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, Environment } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import CarModel from '@/components/CarModel';
import styles from './page.module.css';
import { Download, Share2, ArrowLeft } from 'lucide-react';

type GarageModification = {
  _id: string;
  name: string;
  carModel: string;
  previewImage?: string;
  config?: {
    spoiler?: string;
    [key: string]: unknown;
  };
};

export default function VirtualGarage() {
  const [mods, setMods] = useState<GarageModification[]>([]);
  const [activeMod, setActiveMod] = useState<GarageModification | null>(null);
  const [theme, setTheme] = useState('studio'); 
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/user/modifications');
        if (res.ok) {
          const data = await res.json();
          setMods(data.modifications);
          if (data.modifications.length > 0) setActiveMod(data.modifications[0]);
        }
      } catch {
      }
    }
    loadData();
  }, []);

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Garage-${activeMod?.name || 'Car'}.png`;
      a.click();
    }
  };

  const shareToCommunity = async () => {
    if (!activeMod) return;
    try {
      const res = await fetch(`/api/community/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activeMod._id })
      });
      if (res.ok) {
        alert('Published to Community Gallery!');
        router.push('/community');
      }
    } catch {
      alert('Failed to publish');
    }
  };

  if (mods.length === 0) return <div style={{ padding: '4rem', textAlign: 'center', color: 'white', background: '#050505', height: '100vh' }}>No cars in garage. Go build one!</div>;

  return (
    <div className={styles.container}>
      <div className={styles.canvasWrapper}>
        <Canvas shadows camera={{ position: [6, 2, 6], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
          <color attach="background" args={['#050505']} />
          <Suspense fallback={null}>
            {/* Offline-friendly Environment Map */}
            <Environment resolution={256}>
              <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh position={[0, 10, -10]} scale={[20, 20, 1]}>
                  <planeGeometry />
                  <meshBasicMaterial color={theme === 'city' ? '#00f3ff' : theme === 'dawn' ? '#ffaa00' : 'white'} />
                </mesh>
                <mesh position={[-10, 5, 0]} scale={[20, 20, 1]} rotation={[0, Math.PI / 2, 0]}>
                  <planeGeometry />
                  <meshBasicMaterial color={theme === 'city' ? '#9d00ff' : theme === 'dawn' ? '#ff5500' : 'white'} />
                </mesh>
                <mesh position={[10, 5, 0]} scale={[20, 20, 1]} rotation={[0, -Math.PI / 2, 0]}>
                  <planeGeometry />
                  <meshBasicMaterial color="white" />
                </mesh>
              </group>
            </Environment>
            
            <Stage environment={null} intensity={0.6} contactShadow={{ resolution: 1024, scale: 10, blur: 2, opacity: 0.5 }}>
               {activeMod && <CarModel config={{ ...(activeMod.config || {}), targetCar: activeMod.carModel }} />}
            </Stage>
          </Suspense>
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      <div className={styles.uiOverlay}>
        <div className={styles.header}>
          <button className="btn-primary" onClick={() => router.push('/dashboard')} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}><ArrowLeft size={18}/> Exit</button>
          <div className={styles.controls}>
            <select className="input-field" style={{ margin: 0, width: 'auto', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }} value={theme} onChange={e => setTheme(e.target.value)}>
              <option value="studio">Modern Studio</option>
              <option value="city">Urban Night</option>
              <option value="dawn">Luxury Sunrise</option>
            </select>
            <button className="btn-primary" onClick={handleScreenshot} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.1)' }}><Download size={18}/> Capture</button>
            <button className="btn-primary" onClick={shareToCommunity} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--primary)' }}><Share2 size={18}/> Publish Custom Build</button>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.carSelector}>
            {mods.map(mod => (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  key={mod._id} 
                  src={mod.previewImage || 'https://via.placeholder.com/120x80?text=No+Preview'} 
                  className={styles.carThumb} 
                  alt={`${mod.name} thumbnail`} 
                  data-active={activeMod?._id === mod._id}
                  onClick={() => setActiveMod(mod)}
                />
              </>
            ))}
          </div>
          {activeMod && (
            <div style={{ textAlign: 'right', background: 'rgba(0,0,0,0.6)', padding: '1.5rem', borderRadius: 'var(--radius)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.25rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{activeMod.name}</h2>
              <p style={{ opacity: 0.8, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{activeMod.carModel} • {activeMod.config?.spoiler.toUpperCase()} Edition</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
