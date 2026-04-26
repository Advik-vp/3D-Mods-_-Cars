'use client';

import React from 'react';
import styles from '@/app/studio/studio.module.css';
import { useStudioContext, ActiveTool } from '@/context/StudioContext';
import { Import, Sparkles, PenTool, Download, Camera } from 'lucide-react';

export function StudioSidebar() {
  const { activeTool, setActiveTool } = useStudioContext();

  const navItems: { id: ActiveTool; label: string; icon: React.ReactNode; isAI?: boolean }[] = [
    { id: 'parts', label: 'Parts Editor', icon: <PenTool size={20} /> },
    { id: 'import', label: 'Sketchfab Import', icon: <Import size={20} /> },
    { id: 'photo', label: 'Photo to 3D', icon: <Camera size={20} />, isAI: true },
    { id: 'ai-generator', label: 'AI Designer', icon: <Sparkles size={20} />, isAI: true },
    { id: 'export', label: 'Export Design', icon: <Download size={20} /> },
  ];

  return (
    <aside className={`${styles.glassPanel} ${styles.sidebarLeft}`}>
      <ul className={styles.sideNavList}>
        {navItems.map((item) => (
          <li
            key={item.id}
            className={`${styles.navItem} ${activeTool === item.id ? styles.navItemActive : ''} ${item.isAI ? styles.aiFeature : ''}`}
            onClick={() => setActiveTool(item.id)}
          >
            <div className={styles.navIcon}>{item.icon}</div>
            <span className={styles.navItemText}>{item.label}</span>
          </li>
        ))}
      </ul>
      
      <div style={{ padding: '0 1rem' }}>
         {/* Footer area inside sidebar if needed */}
      </div>
    </aside>
  );
}
