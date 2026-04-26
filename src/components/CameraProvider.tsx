'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { Camera, X, ShieldAlert } from 'lucide-react';
import styles from './CameraProvider.module.css';

type PermissionStatus = 'prompt' | 'granted' | 'denied' | 'unknown';

interface CameraContextType {
  status: PermissionStatus;
  requestAccess: (onSuccessAction?: () => void) => Promise<void>;
  checkPermission: () => Promise<PermissionStatus>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export function CameraProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PermissionStatus>('unknown');
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const checkPermission = async (): Promise<PermissionStatus> => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices) return 'unknown';
    try {
      if (navigator.permissions && navigator.permissions.query) {
         const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
         setStatus(result.state as PermissionStatus);
         result.onchange = () => setStatus(result.state as PermissionStatus);
         return result.state as PermissionStatus;
      }
      return 'unknown';
    } catch {
      return 'unknown';
    }
  };

  const requestAccess = async (onSuccessAction?: () => void) => {
    const currentStatus = await checkPermission();
    if (currentStatus === 'granted') {
      if (onSuccessAction) onSuccessAction();
      return;
    }

    if (currentStatus === 'denied') {
      setErrorMsg('Camera permission has been blocked. Please critically enable hardware flags securely via your browser URL bar privacy settings.');
      setShowModal(true);
      return;
    }

    if (onSuccessAction) setPendingAction(() => onSuccessAction);
    setShowModal(true);
  };

  const handleGrant = async () => {
    setErrorMsg('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Immediately shut off active stream since verification passed
      setStatus('granted');
      setShowModal(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (error) {
      const err = error instanceof Error ? error : null;
      if (err && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError')) {
        setStatus('denied');
        setErrorMsg('Hardware tracking strictly denied constraints. You must permit camera APIs natively via Safari/Chrome top-level settings.');
      } else if (err && (err.name === 'NotFoundError' || err.name === 'OverconstrainedError')) {
        setErrorMsg('Missing sensory inputs: No webcam hardware array found physically hooked to this device.');
      } else if (err && (err.name === 'NotReadableError' || err.name === 'TrackStartError')) {
        setErrorMsg('Hardware actively locked: Your camera is strictly in use by another concurrent protocol (e.g. Zoom/Discord). Please terminate it and retry.');
      } else {
        setErrorMsg('Unknown strict hardware verification error output: ' + (err?.message || 'Unknown error'));
      }
    }
  };

  return (
    <CameraContext.Provider value={{ status, requestAccess, checkPermission }}>
      {children}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <button className={styles.closeBtn} onClick={() => { setShowModal(false); setPendingAction(null); }}><X size={24} /></button>
            <div className={styles.iconRing}><Camera size={36} color="var(--primary)" /></div>
            <h2>Hardware Access Required</h2>
            <p className={styles.desc}>
              This platform securely queries native physical boundaries to process AI semantic car scans, perform structural damage detections, and accurately project 3D models into your physical space via AR mapping. <br/><br/>
              <strong>Privacy Protocol:</strong> We never capture arbitrary streams globally. Photographic vectors process securely within your local system boundaries.
            </p>

            {errorMsg && (
              <div className={styles.errorBox}>
                <ShieldAlert size={28} color="var(--error)" style={{ flexShrink: 0 }} /> 
                <span>{errorMsg}</span>
              </div>
            )}

            {status !== 'denied' && !errorMsg ? (
              <button className="btn-primary" onClick={handleGrant} style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', letterSpacing: '0.5px' }}>
                Securely Grant Hardware Stream Access
              </button>
            ) : (
              <p style={{ fontSize: '0.85rem', opacity: 0.7, marginTop: '1rem', color: 'var(--text)' }}>
                Please refresh the web session manually after securely modifying overarching Safari/Chrome physical permissions array.
              </p>
            )}
          </div>
        </div>
      )}
    </CameraContext.Provider>
  );
}

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) throw new Error('useCamera dependencies must run natively inside strict CameraProvider encapsulations.');
  return context;
};
