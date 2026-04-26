'use client';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import styles from './Navbar.module.css';
import { Sun, Moon, Car, Camera } from 'lucide-react';

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const mounted = true;

  return (
    <header className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <Car size={32} />
          ModStudio
        </Link>
        <nav className={styles.navLinks}>
          <Link href="/scan" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)' }}>
            <Camera size={18} /> AI Scan
          </Link>
          <Link href="/damage-detection" className={styles.link} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--warning)' }}>
            <Camera size={18} /> Damage Detect
          </Link>
          <Link href="/cars" className={styles.link} style={{ color: '#10b981', fontWeight: 700 }}>Car Library</Link>
          <Link href="/collab" className={styles.link} style={{ color: 'var(--primary)', fontWeight: 800 }}>Collab Studio</Link>
          <Link href="/garage" className={styles.link} style={{ color: '#8b5cf6', fontWeight: 700 }}>3D Garage</Link>
          <Link href="/community" className={styles.link}>Community</Link>
          <Link href="/marketplace" className={styles.link}>Marketplace</Link>
          <Link href="/configurator" className={styles.link}>Studio</Link>
          <Link href="/dashboard" className={styles.link}>Dashboard</Link>
        </nav>
        <div className={styles.actions}>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={styles.themeToggle}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}
          <Link href="/login" className="btn-primary" style={{ padding: '0.5rem 1rem' }}>
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
