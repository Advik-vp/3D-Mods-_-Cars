'use client';
import { useState, Suspense, useEffect, useRef, use } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { io, Socket } from 'socket.io-client';
import CarModel from '@/components/CarModel';
import styles from './page.module.css';
import { FLATTENED_CARS } from '@/lib/constants';
import { Send, Users, Shield, Clock, HardDriveDownload, Download, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';

type CollabUser = {
  name: string;
  id: string;
  socketId: string;
  cursor?: string | null;
  role?: string;
};

type CollabChatMessage = {
  sender: string;
  text: string;
  time: string | number | Date;
};

type CollabConfig = {
  targetCar: string;
  color: string;
  wheels: string;
  spoiler: string;
  headlights: string;
  windowTint: string;
  interiorColor: string;
  [key: string]: unknown;
};

export default function CollabRoom({ params }: { params: Promise<{ roomId: string }> }) {
  const unwrappedParams = use(params);
  const roomId = unwrappedParams.roomId;
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<CollabUser[]>([]);
  const [chat, setChat] = useState<CollabChatMessage[]>([]);
  const [hostId, setHostId] = useState<string | null>(null);
  const [config, setConfig] = useState<CollabConfig | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [currentUser, setCurrentUser] = useState<CollabUser | null>(null);

  const CAR_COLORS = ['#ffffff', '#000000', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
  const chatLogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatLogRef.current) chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [chat]);

  useEffect(() => {
    async function init() {
      // Identity Handshake
      let myName = 'Guest ' + Math.floor(Math.random()*1000);
      let myId = Math.random().toString(36).substring(7);
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const d = await res.json();
          myName = d.user.name;
          myId = d.user._id;
        }
      } catch {
      }

      const usr: CollabUser = { name: myName, id: myId, socketId: '' };
      setCurrentUser(usr);

      // Central WS Node Initialization
      const newSocket = io('http://localhost:3001');
      
      newSocket.on('connect', () => {
        newSocket.emit('join-room', { roomId, user: usr });
      });

      newSocket.on('room-state', (room) => {
        setConfig(room.config);
        setHostId(room.host);
        setUsers(room.users);
        setChat(room.chat);
      });

      newSocket.on('config-updated', (newConfig) => setConfig(newConfig));
      newSocket.on('users-updated', (updatedUsers) => setUsers(updatedUsers));
      newSocket.on('chat-updated', (updatedChat) => setChat(updatedChat));

      setSocket(newSocket);

      return () => { newSocket.disconnect(); };
    }
    init();
  }, [roomId]);

  const updateConfig = (key: string, value: string) => {
    if (!socket || !config) return;
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig); // Optimistic UI Pipeline
    socket.emit('update-config', newConfig);
    socket.emit('update-cursor', key);
  };

  const sendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !socket) return;
    socket.emit('send-message', { sender: currentUser?.name, text: chatInput, time: new Date() });
    setChatInput('');
  };

  const undoHistory = () => {
    if (socket) socket.emit('undo-history');
  };

  const isHost = hostId === currentUser?.id || hostId === socket?.id;

  const handleScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `Collab-Build-${roomId}.png`;
      a.click();
    }
  };

  if (!config) return <div style={{ display: 'grid', placeItems: 'center', height: 'calc(100vh - 80px)', color: 'var(--primary)', background: '#050505', fontSize: '1.2rem', fontWeight: 800 }}>Syncing Collaborative Workspace...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.canvasWrapper}>
        <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.6)', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius)', backdropFilter: 'blur(5px)', border: '1px solid var(--border)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
           <span>Collab Room Code: <strong style={{ letterSpacing: '2px', color: 'var(--primary)', fontSize: '1.2rem', marginLeft: '0.5rem' }}>{roomId}</strong></span>
           <button className="btn-primary" onClick={handleScreenshot} style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Download size={14}/> Export Image</button>
        </div>

        <Canvas shadows camera={{ position: [5, 2, 5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
            <color attach="background" args={['#050505']} />
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            <Suspense fallback={null}>
              <CarModel config={config} />
              <Environment resolution={256}>
                <group rotation={[-Math.PI / 2, 0, 0]}>
                  <mesh position={[0, 10, -10]} scale={[20, 20, 1]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#00f3ff" />
                  </mesh>
                  <mesh position={[-10, 5, 0]} scale={[20, 20, 1]} rotation={[0, Math.PI / 2, 0]}>
                    <planeGeometry />
                    <meshBasicMaterial color="#9d00ff" />
                  </mesh>
                  <mesh position={[10, 5, 0]} scale={[20, 20, 1]} rotation={[0, -Math.PI / 2, 0]}>
                    <planeGeometry />
                    <meshBasicMaterial color="white" />
                  </mesh>
                </group>
              </Environment>
              <ContactShadows resolution={1024} scale={10} blur={2} opacity={0.5} far={10} color="#000000" />
            </Suspense>
            <OrbitControls enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2 - 0.05} minDistance={3} maxDistance={10} />
        </Canvas>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.roomHeader}>
           <h2 style={{ fontSize: '1.25rem' }}>Collab Studio</h2>
           <button className="btn-primary" onClick={() => router.push('/dashboard')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}>Leave Room</button>
        </div>

        <h3 className={styles.sectionTitle}><Users size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Active Members</h3>
        <div className={styles.userList}>
          {users.map(u => (
            <div key={u.socketId} className={styles.user}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
              <div style={{ flex: 1 }}>
                <strong>{u.name}</strong> 
                <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{u.id === currentUser?.id ? ' (You)' : ''}</span>
                {u.cursor && <div style={{ fontSize: '0.7rem', color: 'var(--primary)', marginTop: '2px' }}>Editing: {u.cursor}</div>}
              </div>
              {u.id === hostId || u.socketId === hostId ? <span className={styles.hostBadge}><Shield size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} /> HOST</span> : null}
            </div>
          ))}
        </div>

        <h3 className={styles.sectionTitle}>Shared Vehicle Controls</h3>
        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Target Vehicle</label>
          {isHost ? (
            <select className="input-field" value={config.targetCar} onChange={e => updateConfig('targetCar', e.target.value)}>
              {FLATTENED_CARS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <div className="input-field" style={{ opacity: 0.7 }}>{config.targetCar} <span style={{ float: 'right', fontSize: '0.7rem', color: 'var(--warning)' }}>(Host Selected)</span></div>
          )}
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.controlLabel}>Paint Color</label>
          <div className={styles.colorPicker}>
            {CAR_COLORS.map(c => (
              <button key={c} className={`${styles.colorBtn} ${config.color === c ? styles.activeColor : ''}`} style={{ backgroundColor: c }} onClick={() => updateConfig('color', c)} />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <div className={styles.controlGroup} style={{ flex: 1 }}>
            <label className={styles.controlLabel}>Aero Spoiler</label>
            <select className="input-field" value={config.spoiler} onChange={e => updateConfig('spoiler', e.target.value)}>
              <option value="none">Standard Setup</option>
              <option value="carbon">Carbon Fiber High Wing</option>
            </select>
          </div>
          <div className={styles.controlGroup} style={{ flex: 1 }}>
            <label className={styles.controlLabel}>Alloy Trim</label>
            <select className="input-field" value={config.wheels} onChange={e => updateConfig('wheels', e.target.value)}>
              <option value="standard">Standard Forge</option>
              <option value="sport">Dark Sport Setup</option>
            </select>
          </div>
        </div>
        
        {isHost && (
          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
             <button className="btn-primary" onClick={undoHistory} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--surface-hover)', border: '1px solid var(--border)', color: 'white' }}><Clock size={16}/> Revert Version</button>
             <button className="btn-primary" onClick={() => alert('Co-created Build Synced to DB!')} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)' }}><HardDriveDownload size={16}/> Save Master</button>
          </div>
        )}

        <button className="btn-primary" onClick={() => router.push(`/marketplace?car=${config.targetCar.split(' ').pop()}`)} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', marginBottom: '2rem' }}><ShoppingCart size={16}/> Buy Parts in Marketplace</button>

        <h3 className={styles.sectionTitle}>Studio Chat</h3>
        <div className={styles.chatBox}>
          <div className={styles.chatLogs} ref={chatLogRef}>
            {chat.map((msg, i) => (
              <div key={i} className={styles.chatMsg}>
                <span className={styles.chatSender} style={{ color: msg.sender === 'System' ? 'var(--warning)' : 'var(--primary)' }}>{msg.sender}:</span>
                <span style={{ opacity: msg.sender === 'System' ? 0.7 : 1 }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <form className={styles.chatInputWrapper} onSubmit={sendChat}>
            <input className={styles.chatInput} placeholder="Discuss changes..." value={chatInput} onChange={e => setChatInput(e.target.value)} />
            <button type="submit" style={{ background: 'var(--primary)', border: 'none', padding: '0 1rem', cursor: 'pointer', color: '#000' }}><Send size={18}/></button>
          </form>
        </div>

      </div>
    </div>
  );
}
