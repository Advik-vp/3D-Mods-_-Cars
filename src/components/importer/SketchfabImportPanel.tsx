'use client';

import React, { useState } from 'react';
import styles from '@/app/studio/studio.module.css';
import { useStudioContext } from '@/context/StudioContext';
import { modelLoader } from '@/services/ModelLoaderService';
import { Loader2 } from 'lucide-react';

export function SketchfabImportPanel() {
  const { updateCarConfig } = useStudioContext();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    if (!url) return;
    setLoading(true);
    setError('');
    
    try {
      // If it's a sketchfab URL, parse it
      if (url.includes('sketchfab.com')) {
        const uid = modelLoader.extractSketchfabUID(url);
        if (!uid) throw new Error("Invalid Sketchfab URL format. Ensure it contains the 32 character UID.");
        
        // Mock sketchfab download integration warning due to private API constraints
        setError(`Sketchfab Model [${uid}] mapped. Production Sketchfab downloads require OAuth2 token headers via their Data API. For this Studio build, please supply a direct *.glb URL.`);
      } else if (url.endsWith('.glb') || url.endsWith('.gltf')) {
        // Direct inject of gltf URL into global context to trigger <CarModel /> to load it
        updateCarConfig({ importedModelUrl: url });
      } else {
        throw new Error('Please enter a valid Sketchfab link or a direct .glb / .gltf URL');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.toolContent}>
      <h3>Sketchfab Importer</h3>
      <p style={{ color: '#8b9bb4', fontSize: '0.9rem', marginBottom: '10px' }}>
        Paste a Sketchfab model URL or direct GLTF link to dynamically load it into the studio workspace parsing its sub-meshes.
      </p>
      <input 
        type="text" 
        placeholder="https://sketchfab.com/3d-models/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', borderRadius: '8px', marginBottom: '1rem'
        }}
      />
      
      {error && <p style={{ color: '#ff4444', fontSize: '0.85rem', marginBottom: '1rem', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
      
      <button 
        className={styles.cyberBtn} 
        onClick={handleImport}
        disabled={loading}
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid #fff', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px' }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : null}
        Import GLTF Model
      </button>
    </div>
  );
}
