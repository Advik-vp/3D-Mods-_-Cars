'use client';

import React from 'react';
import styles from '@/app/studio/studio.module.css';
import { useStudioContext } from '@/context/StudioContext';
import { Move, RotateCw, Scaling, RefreshCcw } from 'lucide-react';

export function PartsInspectorPanel() {
  const { carConfig, updateCarConfig, resetConfig, transformMode, setTransformMode, selectedPart } = useStudioContext();

  return (
    <div className={styles.toolContent}>
      <div className={styles.controlGroup}>
        <h3><span style={{color: '#9d00ff'}}>●</span> Part Transform Controls</h3>
        <p style={{ color: '#8b9bb4', fontSize: '0.8rem', marginBottom: '10px' }}>
          Select a part on the 3D model to activate transform manipulators.
          <br/>
          <strong style={{color: '#fff'}}>Active Node:</strong> {selectedPart || 'None'}
        </p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button 
            className={styles.cyberBtn}
            onClick={() => setTransformMode(transformMode === 'translate' ? null : 'translate')}
            style={{ flex: 1, padding: '8px', opacity: transformMode === 'translate' ? 1 : 0.5, border: transformMode === 'translate' ? '1px solid #00f3ff' : '1px solid transparent' }}
            title="Move"
          >
            <Move size={18} />
          </button>
          <button 
            className={styles.cyberBtn}
            onClick={() => setTransformMode(transformMode === 'rotate' ? null : 'rotate')}
            style={{ flex: 1, padding: '8px', opacity: transformMode === 'rotate' ? 1 : 0.5, border: transformMode === 'rotate' ? '1px solid #9d00ff' : '1px solid transparent' }}
            title="Rotate"
          >
            <RotateCw size={18} />
          </button>
          <button 
            className={styles.cyberBtn}
            onClick={() => setTransformMode(transformMode === 'scale' ? null : 'scale')}
            style={{ flex: 1, padding: '8px', opacity: transformMode === 'scale' ? 1 : 0.5, border: transformMode === 'scale' ? '1px solid #ff0055' : '1px solid transparent' }}
            title="Scale"
          >
            <Scaling size={18} />
          </button>
        </div>
      </div>

      <div className={styles.controlGroup}>
        <h3><span style={{color: '#00f3ff'}}>●</span> Advanced Material Editor</h3>
        
        {/* Real-time Color Picker */}
        <div style={{ marginBottom: '15px' }}>
          <span style={{ fontSize: '0.85rem', color: '#8b9bb4' }}>Base Paint Color</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
            <input 
              type="color" 
              value={carConfig.paintColor} 
              onChange={(e) => updateCarConfig({ paintColor: e.target.value })}
              style={{ width: '40px', height: '40px', cursor: 'pointer', border: 'none', borderRadius: '8px', background: 'transparent' }}
            />
            <span style={{ color: carConfig.paintColor, fontFamily: 'monospace', textTransform: 'uppercase' }}>{carConfig.paintColor}</span>
          </div>
        </div>

        {/* Material Sliders */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#8b9bb4' }}>
            <span>Glossiness / Clearcoat</span>
            <span>{carConfig.glossiness}%</span>
          </div>
          <input 
            type="range" min="0" max="100" 
            value={carConfig.glossiness} 
            onChange={(e) => updateCarConfig({ glossiness: Number(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#00f3ff' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#8b9bb4' }}>
            <span>Metallic Paint</span>
            <span>{carConfig.metallic}%</span>
          </div>
          <input 
            type="range" min="0" max="100" 
            value={carConfig.metallic} 
            onChange={(e) => updateCarConfig({ metallic: Number(e.target.value) })}
            style={{ width: '100%', cursor: 'pointer', accentColor: '#9d00ff' }}
          />
        </div>
      </div>

      <div className={styles.controlGroup}>
        <h3><span style={{color: '#ff0055'}}>●</span> Configuration Toggles</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span>Front Aero Splitter</span>
            <input type="checkbox" checked={carConfig.frontSplitter} onChange={(e) => updateCarConfig({ frontSplitter: e.target.checked })} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span>Carbon Rear Spoiler</span>
            <input type="checkbox" checked={carConfig.rearSpoiler} onChange={(e) => updateCarConfig({ rearSpoiler: e.target.checked })} />
          </label>
          <label style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span>Neon Underglow</span>
            <input type="checkbox" checked={carConfig.neonEnabled} onChange={(e) => updateCarConfig({ neonEnabled: e.target.checked })} />
          </label>
        </div>
      </div>

      <button 
        onClick={resetConfig}
        className={styles.cyberBtn}
        style={{
          marginTop: 'auto', background: 'transparent',
          border: '1px solid #ff0055', color: '#ff0055',
          display: 'flex', justifyContent: 'center', gap: '8px'
        }}
      >
        <RefreshCcw size={18} />
        Reset Scene
      </button>
    </div>
  );
}
