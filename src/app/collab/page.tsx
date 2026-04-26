'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users } from 'lucide-react';

export default function CollabLobby() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const createRoom = () => {
    const newRoom = Math.random().toString(36).substring(2, 9).toUpperCase();
    router.push(`/collab/${newRoom}`);
  };

  const joinRoom = () => {
    if (roomId.trim()) {
      router.push(`/collab/${roomId.toUpperCase()}`);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 80px)' }}>
      <div className="glass-panel" style={{ textAlign: 'center', maxWidth: '500px', width: '100%', padding: '3rem' }}>
        <Users size={64} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Multiplayer Studio</h1>
        <p style={{ marginBottom: '2.5rem', opacity: 0.8, lineHeight: 1.6 }}>Collaborate visually in real-time with friends to design custom vehicles, communicate via live chat, and synchronize edits simultaneously.</p>
        
        <button className="btn-primary" onClick={createRoom} style={{ width: '100%', marginBottom: '2rem', padding: '1rem', fontSize: '1.1rem' }}>
          Create New Collab Room
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          <span style={{ opacity: 0.5, fontWeight: 700, fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        </div>

        <input 
          className="input-field" 
          placeholder="Enter Room Code (e.g. A9B2C)..." 
          style={{ textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px', textTransform: 'uppercase' }}
          value={roomId} 
          onChange={e => setRoomId(e.target.value)} 
        />
        <button className="btn-primary" onClick={joinRoom} style={{ width: '100%', marginTop: '1rem', background: 'transparent', color: 'var(--primary)', border: '1px solid var(--primary)' }}>
          Join Existing Room
        </button>
      </div>
    </div>
  );
}
