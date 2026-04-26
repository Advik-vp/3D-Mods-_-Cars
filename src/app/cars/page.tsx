'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const CATEGORY_FILTERS = ['all', 'suv', 'sedan', 'hatchback', 'supercar', 'sports', 'truck'];
const CATEGORY_EMOJI: Record<string, string> = { suv: '🚙', sedan: '🚗', hatchback: '🚗', supercar: '🏎️', sports: '🏎️', truck: '🛻' };

type CarLibraryItem = {
  _id: string;
  brand: string;
  name: string;
  year: number;
  category: string;
  previewImage?: string;
  sketchfabUrl?: string;
};

export default function CarLibrary() {
  const [cars, setCars] = useState<CarLibraryItem[]>([]);
  const [filtered, setFiltered] = useState<CarLibraryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/cars')
      .then(r => r.json())
      .then(data => {
        setCars(data.cars || []);
        setFiltered(data.cars || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const applyFilter = (cat: string) => {
    setActiveFilter(cat);
    setFiltered(cat === 'all' ? cars : cars.filter(c => c.category === cat));
  };

  if (loading) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}>Loading Car Library...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Car Library</h1>
          <p className={styles.subtitle}>High-fidelity 3D models available for full customization.</p>
        </div>
        <span className={styles.count}>{filtered.length} model{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      <div className={styles.filters}>
        {CATEGORY_FILTERS.map(cat => (
          <button
            key={cat}
            onClick={() => applyFilter(cat)}
            className={`${styles.filterBtn} ${activeFilter === cat ? styles.filterBtnActive : ''}`}
          >
            {cat === 'all' ? 'All Models' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <h2>No models imported yet</h2>
          <p>Admins can import new Sketchfab models from the admin panel.</p>
          <Link href="/admin/import-car" className="btn-primary" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
            Import a Car Model
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((car) => (
            <div key={car._id} className={styles.card}>
              {car.previewImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.previewImage} alt={car.name} className={styles.thumbImg} />
                </>
              ) : (
                <div className={styles.thumb}>{CATEGORY_EMOJI[car.category] || '🚗'}</div>
              )}
              <div className={styles.body}>
                <div className={styles.brand}>{car.brand}</div>
                <div className={styles.name}>{car.name}</div>
                <div className={styles.meta}>
                  <span>{car.year}</span>
                  <span className={styles.badge}>{car.category}</span>
                </div>
                <div className={styles.actions}>
                  <Link
                    href={`/configurator?car=${car._id}&base=${car.category}`}
                    className="btn-primary"
                    style={{ flex: 1, textAlign: 'center', fontSize: '0.875rem', padding: '0.6rem' }}
                  >
                    🎨 Customize
                  </Link>
                  <a
                    href={car.sketchfabUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center' }}
                  >
                    🔗
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
