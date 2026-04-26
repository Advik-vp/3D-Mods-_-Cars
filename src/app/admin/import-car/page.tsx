'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const CATEGORIES = ['suv', 'sedan', 'hatchback', 'supercar', 'sports', 'truck'];

export default function ImportCarPage() {
  const router = useRouter();
  const [form, setForm] = useState({ brand: '', name: '', year: new Date().getFullYear(), category: 'sedan', sketchfabUrl: '', previewImage: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [checking, setChecking] = useState(true);

  // Verify admin access on mount
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/auth/me');
      if (!res.ok) { router.push('/login'); return; }
      const data = await res.json();
      if (!data.user?.isAdmin) { router.push('/dashboard'); return; }
      setChecking(false);
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Import failed');
      setSuccess(`✅ ${form.brand} ${form.name} imported successfully! It is now live in the Car Library.`);
      setForm({ brand: '', name: '', year: new Date().getFullYear(), category: 'sedan', sketchfabUrl: '', previewImage: '' });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>Verifying admin access...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.adminBadge}>🔐 Admin Access Required</div>
        <h1 className={styles.title}>Import 3D Car Model</h1>
        <p className={styles.subtitle}>Register an external Sketchfab model into the platform&apos;s car library.</p>
      </div>

      <div className={`glass-panel ${styles.card}`}>
        {success && <div className={styles.success}>{success}</div>}
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.group}>
              <label className="label">Car Brand</label>
              <input className="input-field" placeholder="e.g. Nissan" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} required />
            </div>
            <div className={styles.group}>
              <label className="label">Car Name / Model</label>
              <input className="input-field" placeholder="e.g. GT-R R35" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label className="label">Model Year</label>
              <input type="number" className="input-field" min={1980} max={2030} value={form.year} onChange={e => setForm({...form, year: Number(e.target.value)})} required />
            </div>
            <div className={styles.group}>
              <label className="label">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.group}>
            <label className="label">Sketchfab Model URL</label>
            <input className="input-field" type="url" placeholder="https://skfb.ly/xxxxx  or  https://sketchfab.com/3d-models/..." value={form.sketchfabUrl} onChange={e => setForm({...form, sketchfabUrl: e.target.value})} required />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Paste any Sketchfab link — the model ID is extracted automatically.</span>
          </div>

          <div className={styles.group}>
            <label className="label">Preview Image URL (optional)</label>
            <input className="input-field" type="url" placeholder="https://example.com/car-preview.jpg" value={form.previewImage} onChange={e => setForm({...form, previewImage: e.target.value})} />
            {form.previewImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.previewImage} alt="Preview" className={styles.preview} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '1rem', fontSize: '1rem', fontWeight: 700 }}>
            {loading ? 'Importing Model...' : '🚗 Import Car into Platform'}
          </button>
        </form>
      </div>
    </div>
  );
}
