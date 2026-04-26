'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../auth.module.css';
import { FLATTENED_CARS } from '@/lib/constants';

type SignUpChangeEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export default function SignUp() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '', carModel: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: SignUpChangeEvent) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <div className={`glass-panel ${styles.card}`}>
        <h1 className={styles.title}>Create Profile</h1>
        <p className={styles.subtitle}>Join the ultimate 3D car modification platform.</p>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div>
            <label className="label">Full Name</label>
            <input name="name" type="text" className="input-field" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Email Address</label>
            <input name="email" type="email" className="input-field" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input name="password" type="password" className="input-field" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input name="phoneNumber" type="tel" className="input-field" placeholder="+91 9999999999" value={form.phoneNumber} onChange={handleChange} required />
          </div>
          <div>
            <label className="label">Current/Dream Car Model</label>
            <select name="carModel" className="input-field" value={form.carModel} onChange={handleChange} required>
              <option value="" disabled>Select your car...</option>
              {FLATTENED_CARS.map(car => (
                <option key={car} value={car}>{car}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          Already have an account? <Link href="/login" className={styles.link}>Log in</Link>
        </p>
      </div>
    </div>
  );
}
