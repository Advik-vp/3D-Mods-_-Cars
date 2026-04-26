'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs-backend-webgl'; // Ensure webgl backend
import styles from './page.module.css';

export default function CarScanner() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorLine, setErrorLine] = useState<string | null>(null);
  const [detections, setDetections] = useState<cocoSsd.DetectedObject[]>([]);
  const [scanning, setScanning] = useState(false);
  const animationRef = useRef<number>(0);

  // 1. Initialize TensorFlow Model
  useEffect(() => {
    async function loadModel() {
      try {
        await tf.ready();
        await tf.setBackend('webgl'); // explicitly set backend
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        setLoading(false);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("TF Load Error:", message);
        setErrorLine(message || 'Failed to fetch AI model');
        setLoading(false);
      }
    }
    loadModel();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // 2. Setup Camera Feed
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setScanning(true);
            detectFrame();
          };
        }
      } catch {
        alert("Camera access denied or unavailable.");
      }
    }
  };

  // 3. AI Detection Loop
  const detectFrame = async () => {
    if (!videoRef.current || !canvasRef.current || !model) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (video.readyState === 4 && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const predictions = await model.detect(video);
      
      // Filter for vehicle-related objects exclusively
      const carRelated = predictions.filter(p => 
        ['car', 'truck', 'bus', 'motorcycle', 'wheel'].includes(p.class)
      );
      
      setDetections(carRelated);

      // Draw active bounding boxes mapping onto DOM canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      carRelated.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.strokeRect(x, y, width, height);

        ctx.fillStyle = '#10b981';
        ctx.font = '18px Inter';
        ctx.fillText(
          `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
          x, y > 20 ? y - 5 : 20
        );
      });
    }

    animationRef.current = requestAnimationFrame(detectFrame);
  };

  const handleImportToConfigurator = () => {
    const vehicles = detections.map(d => d.class);
    let target = 'sedan';
    if (vehicles.includes('truck') || vehicles.includes('bus')) target = 'suv';
    
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
    
    router.push(`/configurator?base=${target}`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Vehicle Scanner</h1>
        <p>Point your camera at a real car to automatically map it to our 3D Database via TensorFlow.js.</p>
      </header>

      <div className={styles.scannerWrapper}>
        <video 
          ref={videoRef} 
          className={styles.video} 
          playsInline 
          muted 
        />
        <canvas ref={canvasRef} className={styles.canvas} />
        
        <div className={styles.overlay}>
          {loading ? (
            <p>Loading AI Vision Model (TensorFlow.js)...</p>
          ) : errorLine ? (
            <div style={{ color: '#ff4444', background: 'rgba(0,0,0,0.8)', padding: '1rem', borderRadius: '8px' }}>
              <p><strong>Error loading AI model:</strong> {errorLine}</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>This often happens if ad-blockers block the TensorFlow model download, or due to network issues.</p>
            </div>
          ) : !scanning ? (
            <button onClick={startCamera} className="btn-primary">
              Start Camera Scan
            </button>
          ) : (
            <p>Scanning active. Detect a vehicle to continue.</p>
          )}
        </div>
      </div>

      {detections.length > 0 && (
        <div className={`glass-panel ${styles.resultsPanel}`}>
          <h3>Detected Vehicle Components</h3>
          <div className={styles.resultsGrid}>
            {detections.map((d, idx) => (
              <div key={idx} className={styles.detectedCard}>
                <div className={styles.detectedClass}>{d.class}</div>
                <div className={styles.detectedScore}>Confidence: {Math.round(d.score * 100)}%</div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={handleImportToConfigurator} 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '1.5rem', background: 'var(--success)' }}
          >
            Import to 3D Studio
          </button>
        </div>
      )}
    </div>
  );
}
