'use client';
import { useRef, useState } from 'react';
import styles from './SketchfabViewer.module.css';

interface SketchfabViewerProps {
  modelId: string;
  carName: string;
  primaryColor?: string;
}

export default function SketchfabViewer({ modelId, carName, primaryColor }: SketchfabViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  const embedUrl = `https://sketchfab.com/models/${modelId}/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_vr=0&ui_fullscreen=1&camera=0&preload=1&transparent=0&dnt=1`;

  return (
    <div className={styles.wrapper} style={primaryColor ? { borderColor: primaryColor, borderStyle: 'solid' } : undefined}>
      {!loaded && (
        <div className={styles.loader}>
          <div className={styles.spinner} />
          <p>Loading {carName} 3D Model...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={embedUrl}
        title={`${carName} 3D Model`}
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        className={`${styles.frame} ${loaded ? styles.visible : ''}`}
        onLoad={() => setLoaded(true)}
      />
      <div className={styles.badge}>
        <span>🔗 Powered by Sketchfab</span>
        <a
          href={`https://sketchfab.com/3d-models/${modelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          View Original
        </a>
      </div>
    </div>
  );
}
