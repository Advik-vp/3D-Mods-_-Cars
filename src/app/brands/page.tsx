'use client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

const BRANDS = [
  { name: 'Momo Italy', category: 'Alloy Wheels & Steering', desc: 'Premium forged wheels and racing interior accessories engineered in Italy.' },
  { name: 'Sparco', category: 'Racing Dynamics', desc: 'World-class motorsport safety equipment, carbon fiber body kits, and racing seats.' },
  { name: 'Bosch', category: 'Performance & Electrical', desc: 'High-performance exhaustive systems, advanced LED matrix lighting, and pure components.' },
  { name: 'Hella', category: 'Illumination', desc: 'Industry-leading auxiliary lamps, LED arrays, and adaptive nighttime driving systems.' },
  { name: '3M Car Care', category: 'Aesthetics & Protection', desc: 'State-of-the-art ceramic window tints, PPF (Paint Protection Films), and vehicle wraps.' },
  { name: 'Brembo', category: 'Performance Braking', desc: 'High-performance carbon-ceramic braking systems and ultra-durable brake pads.' }
];

export default function BrandsDirectory() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Official Brand Partners</h1>
        <p>Explore high-performance automotive parts sourced directly from globally recognized manufacturers.</p>
      </header>

      <div className={styles.grid}>
        {BRANDS.map(brand => (
          <div 
            key={brand.name} 
            className={styles.brandCard}
            onClick={() => router.push('/marketplace')}
          >
            <div className={styles.brandLogo}>{brand.name}</div>
            <div className={styles.brandCategory}>{brand.category}</div>
            <p className={styles.brandDesc}>{brand.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
