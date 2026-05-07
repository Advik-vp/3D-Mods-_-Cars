'use client';
import { useState } from 'react';
import { Upload, AlertTriangle, PenTool } from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';

type DamageResult = {
  type: string;
  severity: string;
  location: string;
  repair: string;
  cost: string;
};

export default function DamageDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<DamageResult[] | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setResults(null);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    // Simulate AI damage detection model processing
    setTimeout(() => {
      setAnalyzing(false);
      setResults([
        { type: 'Scratch', severity: 'Minor', location: 'Front Left Bumper', repair: 'Polishing Compound', cost: '₹1,500' },
        { type: 'Dent', severity: 'Moderate', location: 'Driver Side Door', repair: 'Paintless Dent Removal', cost: '₹4,000' },
        { type: 'Paint Damage', severity: 'Major', location: 'Hood', repair: 'Panel Repaint & Clear Coat', cost: '₹8,500' }
      ]);
    }, 2500);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Real-Time Damage Detection</h1>
        <p>Upload a photo of your vehicle to instantly identify scratches, dents, and paint damage using computer vision.</p>
      </header>

      <div className={styles.mainContent}>
        <div className={styles.uploadCard}>
          {!image ? (
            <label className={styles.uploadArea}>
              <Upload size={48} className={styles.uploadIcon} />
              <h3>Upload Car Image</h3>
              <p>Supports JPG, PNG (Max 5MB)</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
          ) : (
            <div className={styles.previewWrapper}>
              <Image src={image} alt="Uploaded Vehicle" width={500} height={300} unoptimized className={styles.previewImage} />
              
              {/* Simulated Bounding Boxes appearing after analysis */}
              {results && (
                <>
                  <div className={styles.boundingBox} style={{ top: '30%', left: '40%', width: '15%', height: '10%' }} />
                  <div className={styles.boundingBox} style={{ top: '60%', left: '20%', width: '10%', height: '15%', borderColor: 'var(--warning)' }} />
                </>
              )}

              {analyzing && (
                <div className={styles.scanningOverlay}>
                  <div className={styles.scanLine} />
                  <p>Analyzing Surface Topography...</p>
                </div>
              )}
            </div>
          )}
          
          {image && !results && !analyzing && (
            <button onClick={analyzeImage} className="btn-primary" style={{ marginTop: '1.5rem', width: '100%' }}>
              Run AI Diagnostics
            </button>
          )}

          {image && (
            <button onClick={() => { setImage(null); setResults(null); }} style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', background: 'transparent', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              Upload Different Image
            </button>
          )}
        </div>

        {results && (
          <div className={`glass-panel ${styles.resultsPanel}`}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <AlertTriangle color="var(--error)" /> 
              Damage Report
            </h2>
            
            <div className={styles.damageList}>
              {results.map((r, i) => (
                <div key={i} className={styles.damageItem}>
                  <div className={styles.damageHeader}>
                    <span className={styles.damageType}>{r.type}</span>
                    <span className={styles.damageSeverity} data-severity={r.severity}>{r.severity}</span>
                  </div>
                  <div className={styles.damageDetails}>
                    <div className={styles.detailRow}><span>Location:</span> <strong>{r.location}</strong></div>
                    <div className={styles.detailRow}><span>Suggested Fix:</span> <strong>{r.repair}</strong></div>
                    <div className={styles.detailRow}><span>Est. Repair Cost:</span> <strong style={{ color: 'var(--error)' }}>{r.cost}</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.recommendationBox}>
              <PenTool size={20} />
              <p>Consider applying an aggressive <strong>Body Kit</strong> in the Configurator to easily map over significant damages while upgrading styling.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
