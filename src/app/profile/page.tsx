'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../auth.module.css';
import { FLATTENED_CARS } from '@/lib/constants';

export default function ProfileEditor() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', carModel: '', profilePicture: '', twoFactorEnabled: { email: false, phone: false } });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) throw new Error();
        const { user } = await res.json();
        setForm({ 
          name: user.name || '', 
          carModel: user.carModel || '', 
          profilePicture: user.profilePicture || '',
          twoFactorEnabled: { 
            email: user.twoFactorEnabled?.email || false, 
            phone: user.twoFactorEnabled?.phone || false 
          }
        });
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast HTML5 base64 reader to support direct save into DB for prototyping
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, profilePicture: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to update');
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setMessage({ type: 'error', text: message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="auth-container">Loading profile...</div>;

  return (
    <div className="auth-container">
      <div className={`glass-panel ${styles.card}`} style={{ maxWidth: '500px' }}>
        <h1 className={styles.title}>Edit Profile</h1>
        <p className={styles.subtitle}>Update your personal details and avatar.</p>
        
        {message.text && (
          <div className={styles.error} style={{ backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : '', color: message.type === 'success' ? 'var(--success)' : '' }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {form.profilePicture ? (
              <>
                <Image src={form.profilePicture} alt="Profile" width={100} height={100} unoptimized style={{ borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
              </>
            ) : (
              <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border)' }}>
                No Image
              </div>
            )}
            <div>
              <label htmlFor="avatar-upload" className="btn-primary" style={{ cursor: 'pointer', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                Upload Avatar
              </label>
              <input id="avatar-upload" type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </div>
          </div>

          <div>
            <label className="label">Full Name</label>
            <input type="text" className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <label className="label">Primary Car Model</label>
            <select className="input-field" value={form.carModel} onChange={e => setForm({...form, carModel: e.target.value})}>
              <option value="" disabled>Select a car model</option>
              {FLATTENED_CARS.map(car => (
                <option key={car} value={car}>{car}</option>
              ))}
            </select>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem', border: '1px solid var(--primary)', borderRadius: 'var(--radius)' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Security Settings & 2FA
            </h2>
            <p style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Protect your garage configurations by enabling multi-factor authentication protocols over verified communication channels.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', background: 'var(--surface)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <div>
                <strong>Email Verification</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>Secure logins using temporal tokens sent directly to your registered email.</div>
              </div>
              <input 
                 type="checkbox" 
                 checked={form.twoFactorEnabled.email} 
                 onChange={e => setForm({...form, twoFactorEnabled: { ...form.twoFactorEnabled, email: e.target.checked }})}
                 style={{ transform: 'scale(1.5)', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', padding: '1rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
              <div>
                <strong>SMS Phone Verification</strong>
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '4px' }}>Automatically request authentication traces securely via physical SMS.</div>
              </div>
              <input 
                 type="checkbox" 
                 checked={form.twoFactorEnabled.phone} 
                 onChange={e => setForm({...form, twoFactorEnabled: { ...form.twoFactorEnabled, phone: e.target.checked }})}
                 style={{ transform: 'scale(1.5)', accentColor: 'var(--warning)', cursor: 'pointer' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => router.push('/dashboard')} className="btn-primary" style={{ flex: 1, background: 'transparent', color: 'var(--foreground)', border: '1px solid var(--border)' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
