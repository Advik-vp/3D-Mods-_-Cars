'use client';
import { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import CarModel from '@/components/CarModel';
import SketchfabViewer from '@/components/SketchfabViewer';
import styles from './page.module.css';
import { FLATTENED_CARS, SKETCHFAB_MODELS, hasSketchfabModel } from '@/lib/constants';
import { ShoppingCart, X } from 'lucide-react';

const CAR_COLORS = ['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

type ExternalCar = {
  _id: string;
  brand: string;
  name: string;
  sketchfabModelId?: string;
};

type MarketplacePart = {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

export default function Configurator() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [config, setConfig] = useState({
    targetCar: FLATTENED_CARS[0],
    color: '#ffffff',
    wheels: 'standard',
    spoiler: 'none',
    headlights: 'halogen',
    windowTint: 'light',
    interiorColor: '#000000'
  });
  const [modName, setModName] = useState('My Dream Build');
  const [saving, setSaving] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // External DB-imported car (loaded via ?car=<id>)
  const [externalCar, setExternalCar] = useState<ExternalCar | null>(null);

  // Marketplace Matching
  const [marketParts, setMarketParts] = useState<MarketplacePart[]>([]);
  const [showMarket, setShowMarket] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Load external car from DB if ?car=id is present
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const carId = query.get('car');
      if (carId) {
        fetch(`/api/admin/cars/${carId}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => { if (data?.car) { setExternalCar(data.car); setModName(`${data.car.brand} ${data.car.name}`); } })
          .catch(() => {});
      }
    }
  }, []);

  useEffect(() => {
    async function fetchMatches() {
      const carShort = config.targetCar.split(' ').pop();
      try {
        const res = await fetch(`/api/marketplace/products?car=${carShort}`);
        if (res.ok) {
          const data = await res.json();
          setMarketParts(data.products || []);
        }
      } catch {
        // Ignore marketplace prefetch errors for the configurator
      }
    }
    fetchMatches();
  }, [config.targetCar]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/modifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: modName,
          carModel: config.targetCar,
          config,
          previewImage: ''
        })
      });
      if (res.ok) {
        alert('Saved successfully!');
        router.push('/dashboard');
      } else {
        const err = await res.json();
        alert('Failed: ' + err.error);
      }
    } catch {
      alert('Error saving project. Ensure you are logged in.');
    } finally {
      setSaving(false);
    }
  };

  const handleEnterAR = async () => {
    try {
      if (typeof navigator !== 'undefined' && 'xr' in navigator) {
        const xrNavigator = navigator as Navigator & { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } };
        const supported = await xrNavigator.xr?.isSessionSupported?.('immersive-ar');
        if (supported) {
          // WebXR is supported — user will get native AR via device browser
          alert('AR mode is supported! Please open this page on a compatible mobile browser (Chrome for Android / Safari iOS 16+) to experience full immersive AR.');
        } else {
          alert('Your browser or device does not support WebXR Augmented Reality. Please try on a Chrome Android device or iOS 16+ Safari browser.');
        }
      } else {
        alert('WebXR is not available in this browser. For AR preview, open this page on a compatible mobile browser.');
      }
    } catch {
      alert('Could not check AR support. Please try on a mobile device running Chrome or Safari.');
    }
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
        <button className="btn-primary" onClick={handleEnterAR} style={{ position: 'absolute', bottom: '2rem', left: '2rem', zIndex: 100, padding: '1rem 2rem', fontWeight: 'bold' }}>Enter Native AR</button>

      <div className={styles.canvasWrapper}>
        {externalCar?.sketchfabModelId ? (
          <SketchfabViewer
            modelId={externalCar.sketchfabModelId}
            carName={`${externalCar.brand} ${externalCar.name}`}
            primaryColor={config.color}
          />
        ) : hasSketchfabModel(config.targetCar) ? (
          <SketchfabViewer
            modelId={SKETCHFAB_MODELS[config.targetCar]}
            carName={config.targetCar}
            primaryColor={config.color}
          />
        ) : (
          <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }}>
            <color attach="background" args={['#1a1a1a']} />
            <hemisphereLight args={['#b3d4f0', '#0a0a0a', 0.6]} />
            <directionalLight position={[10, 12, 8]} intensity={1.2} castShadow shadow-mapSize={[1024, 1024]} />
            <directionalLight position={[-8, 6, -4]} intensity={0.4} color="#6699ff" />
            <pointLight position={[0, 6, 0]} intensity={0.5} color="#ffffff" />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            
            <Suspense fallback={null}>
              <CarModel config={config} />
              <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
            </Suspense>
            
            <OrbitControls 
              enablePan={false} 
              minPolarAngle={0} 
              maxPolarAngle={Math.PI / 2 - 0.05}
              minDistance={3}
              maxDistance={10}
            />
          </Canvas>
        )}
      </div>


      {showMarket && (
        <div className={styles.marketplaceSidebar}>
          <div className={styles.marketTitle}>
            <h3 style={{ fontSize: '1.1rem' }}>Matching Real Parts</h3>
            <button onClick={() => setShowMarket(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text)' }}><X size={20}/></button>
          </div>
          {marketParts.length === 0 ? (
            <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>No matching aftermarket parts found.</p>
          ) : marketParts.map(part => (
            <div key={part._id} className={styles.marketProduct}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={part.image} alt={part.name} />
              <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>{part.category}</div>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{part.name}</div>
              <div style={{ color: 'var(--success)', fontWeight: 800 }}>₹{part.price.toLocaleString('en-IN')}</div>
              <button 
                className="btn-primary" 
                style={{ fontSize: '0.8rem', padding: '0.4rem', marginTop: '0.5rem' }}
                onClick={() => { addToCart(part); alert(`${part.name} added to cart!`); }}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating UI */}
      <div className={`glass-panel ${styles.uiOverlay}`}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Configuration</h2>
        
        <div className={styles.controlGroup}>
          <label className="label">Project Name</label>
          <input 
            type="text" 
            className="input-field" 
            value={modName} 
            onChange={e => setModName(e.target.value)} 
          />
        </div>

        {hasSketchfabModel(config.targetCar) && (
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid var(--primary)', borderRadius: 'var(--radius-sm)', padding: '0.85rem', fontSize: '0.8rem', color: 'var(--primary)', lineHeight: 1.5 }}>
            🔗 <strong>High-Fidelity Model Active</strong><br />
            This is an interactive Sketchfab 3D model. Use orbit controls directly on the viewer. Colour &amp; mod selections will be saved with your configuration.
          </div>
        )}

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Target Vehicle</label>
          <select 
            className="input-field" 
            value={config.targetCar} 
            onChange={e => setConfig({...config, targetCar: e.target.value})}
          >
            {FLATTENED_CARS.map(car => (
              <option key={car} value={car}>{car}</option>
            ))}
          </select>
        </div>


        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Paint Color</label>
          <div className={styles.colorPicker}>
            {CAR_COLORS.map(c => (
              <button 
                key={c}
                className={`${styles.colorBtn} ${config.color === c ? styles.active : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setConfig({...config, color: c})}
                aria-label={`Select color ${c}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Aesthetics & Headlights</label>
          <select className="input-field" value={config.headlights} onChange={e => setConfig({...config, headlights: e.target.value})}>
            <option value="halogen">Standard Halogen</option>
            <option value="led">LED White / DRLs</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Aero Spoiler Options</label>
          <select className="input-field" value={config.spoiler} onChange={e => setConfig({...config, spoiler: e.target.value})}>
            <option value="none">Standard Kit (No Aero)</option>
            <option value="carbon">Carbon Fiber High-Profile Wing</option>
          </select>
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Alloy Wheels</label>
          <select className="input-field" value={config.wheels} onChange={e => setConfig({...config, wheels: e.target.value})}>
            <option value="standard">Standard Alloy Setup</option>
            <option value="sport">Dark Sport Forged Rim</option>
          </select>
        </div>

        {marketParts.length > 0 && (
          <button 
            className="btn-primary" 
            onClick={() => setShowMarket(!showMarket)}
            style={{ width: '100%', marginBottom: '1rem', background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
          >
            <ShoppingCart size={18} /> View Matching Parts ({marketParts.length})
          </button>
        )}

        <button 
          className={`btn-primary ${styles.saveBtn}`} 
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%' }}
        >
          {saving ? 'Saving Profile...' : 'Save Configuration Profile'}
        </button>
      </div>
    </div>
  );
}
