'use client';

import React from 'react';
import styles from './studio.module.css';
import { Car, Download } from 'lucide-react';
import { StudioProvider } from '@/context/StudioContext';
import { StudioSidebar } from '@/components/studio/StudioSidebar';
import { ControlPanel } from '@/components/studio/ControlPanel';
import { Scene3D } from '@/components/studio/Scene3D';

function StudioContent() {
  return (
    <div className={styles.studioContainer}>
      <div className={styles.particles} />
      <div className={`${styles.glowOrb} ${styles.orb1}`} />
      <div className={`${styles.glowOrb} ${styles.orb2}`} />

      <header className={`${styles.glassPanel} ${styles.topNav}`}>
        <div className={styles.logo}>
          <Car className={styles.logoIcon} size={28} />
          <h1 className={styles.logoText}>NEXUS<span>STUDIO</span></h1>
        </div>
        
        <nav className={styles.navLinks}>
          <a href="#" style={{ color: '#fff', borderBottom: '2px solid #00f3ff' }}>Workspace</a>
          <a href="/showroom">Showroom</a>
          <a href="/dashboard">Dashboard</a>
        </nav>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className={styles.navExportBtn}>
            <Download size={18} /> Export
          </button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        <StudioSidebar />
        
        <main className={`${styles.canvasArea} ${styles.glassPanel}`}>
          <Scene3D />
        </main>

        <ControlPanel />
      </div>
    </div>
  );
}

export default function AIStudioPage() {
  return (
    <StudioProvider>
      <StudioContent />
    </StudioProvider>
  );
}
