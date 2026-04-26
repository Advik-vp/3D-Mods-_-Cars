import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.hero}>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>The Future of Car Customization</h1>
        <p className={styles.subtitle}>
          Visualize your dream build in stunning 3D. 
          Modify paint, add body kits, change alloys, and learn about strict Indian ISO Automotive Standards all in one platform.
        </p>
        <div className={styles.actions}>
          <Link href="/configurator" className="btn-primary">
            Enter 3D Studio
          </Link>
          <Link href="/signup" className={styles.btnSecondary}>
            Create Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
