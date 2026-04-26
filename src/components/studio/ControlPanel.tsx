'use client';

import React from 'react';
import styles from '@/app/studio/studio.module.css';
import { useStudioContext } from '@/context/StudioContext';
import { DownloadCloud, Image as ImageIcon, CodeSquare } from 'lucide-react';
import { SketchfabImportPanel } from '@/components/importer/SketchfabImportPanel';
import { PhotoUploadPanel } from '@/components/importer/PhotoUploadPanel';
import { AIPromptPanel } from '@/components/editor/AIPromptPanel';
import { PartsInspectorPanel } from '@/components/editor/PartsInspectorPanel';

export function ControlPanel() {
  const { activeTool, carConfig } = useStudioContext();

  // Export handlers
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(carConfig, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "car_preset.json");
    dlAnchorElem.click();
  };

  const handleExportImage = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const dataURL = canvas.toDataURL('image/png');
      const dlAnchorElem = document.createElement('a');
      dlAnchorElem.setAttribute("href", dataURL);
      dlAnchorElem.setAttribute("download", "car_render.png");
      dlAnchorElem.click();
    }
  };

  const renderToolContent = () => {
    switch (activeTool) {
      case 'parts':
        return <PartsInspectorPanel />;
      case 'ai-generator':
        return <AIPromptPanel />;
      case 'import':
        return <SketchfabImportPanel />;
      case 'photo':
        return <PhotoUploadPanel />;
      case 'export':
        return (
          <div className={styles.toolContent}>
            <h3><span style={{color: '#ff0055'}}>✦</span> Export Hub</h3>
            <p style={{ color: '#8b9bb4', fontSize: '0.9rem', marginBottom: '10px' }}>
              Finalize your design and prepare it for production, gaming, or sharing.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '1rem' }}>
              <button className={styles.cyberBtn} onClick={handleExportImage} style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <ImageIcon size={18} /> Render PNG Image
              </button>
              <button 
                className={styles.cyberBtn} 
                onClick={() => window.dispatchEvent(new CustomEvent('export-gltf'))}
                style={{ display: 'flex', justifyContent: 'center', gap: '10px', background: 'rgba(255,0,85,0.1)', border: '1px solid #ff0055' }}
              >
                <DownloadCloud size={18} /> Export GLTF Model
              </button>
              <button className={styles.cyberBtn} onClick={handleExportJSON} style={{ display: 'flex', justifyContent: 'center', gap: '10px', background: 'rgba(0,243,255,0.1)', border: '1px solid #00f3ff' }}>
                <CodeSquare size={18} /> Save Preset JSON
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className={styles.toolContent}>
            <h3 style={{ color: '#8b9bb4' }}>Select a tool</h3>
          </div>
        );
    }
  };

  return (
    <aside className={`${styles.glassPanel} ${styles.sidebarRight}`}>
      <div className={styles.panelHeader}>
        <h2>Configuration</h2>
        <span style={{ fontSize: '0.8rem', color: '#00f3ff', textTransform: 'uppercase', fontWeight: 'bold' }}>
          ● Online
        </span>
      </div>
      {renderToolContent()}
    </aside>
  );
}
