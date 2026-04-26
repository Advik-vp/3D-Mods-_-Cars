'use client';

import React, { useState } from 'react';
import styles from '@/app/studio/studio.module.css';
import { useStudioContext } from '@/context/StudioContext';
import { Upload, Loader2 } from 'lucide-react';

export function PhotoUploadPanel() {
  const { updateCarConfig } = useStudioContext();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      // Convert file to Base64 to send to Vision API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const res = await fetch('/api/photo-car-detection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64data }),
        });

        const data = await res.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to analyze photo');
        }

        updateCarConfig(data.config);
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.toolContent}>
      <h3><span style={{color: '#9d00ff'}}>✦</span> Photo to 3D Pipeline</h3>
      <p style={{ color: '#8b9bb4', fontSize: '0.9rem', marginBottom: '10px' }}>
        Upload a 2D image of a vehicle. Our GPT-4 Vision integration will extract its core aesthetic elements and automatically recreate them on your 3D model.
      </p>
      
      <label 
        style={{
          border: '2px dashed #00f3ff', padding: '3rem 1rem', textAlign: 'center',
          borderRadius: '8px', cursor: 'pointer', background: 'rgba(0,243,255,0.05)',
          display: 'block', transition: 'all 0.3s'
        }}
      >
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleFileUpload}
          disabled={isUploading}
        />
        {isUploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#00f3ff' }}>
            <Loader2 className="animate-spin" size={32} />
            <span>Analyzing Image via Vision AI...</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', color: '#00f3ff' }}>
            <Upload size={32} />
            <span style={{ fontWeight: 600 }}>Click to Upload Image</span>
          </div>
        )}
      </label>
      
      {error && <p style={{ color: '#ff4444', fontSize: '0.85rem', marginTop: '1rem', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</p>}
    </div>
  );
}
