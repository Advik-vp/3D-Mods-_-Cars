'use client';
import { useEffect, useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { FLATTENED_CARS } from '@/lib/constants';
import { ShoppingCart, Compass } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

type MarketplaceProduct = {
  _id: string;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  image: string;
  compatibleCars: string[];
};

export default function Marketplace() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [filterCar, setFilterCar] = useState('');
  const { addToCart, cart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      let url = '/api/marketplace/products';
      // Pass the short name of the car (e.g. "Swift" instead of "Maruti Suzuki Swift")
      if (filterCar) url += `?car=${encodeURIComponent(filterCar.split(' ').pop() || '')}`;
      try {
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
         console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [filterCar]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Modification Marketplace</h1>
        <p>Purchase real-world performance parts and aesthetic upgrades perfectly mapped to your customized 3D profiles.</p>
      </header>

      <div className={styles.filterBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <Compass size={24} color="var(--primary)" />
          <label style={{ fontWeight: 600 }}>Filter by Compatibility:</label>
          <select 
            className="input-field" 
            style={{ maxWidth: '300px', margin: 0 }}
            value={filterCar} 
            onChange={e => setFilterCar(e.target.value)}
          >
            <option value="">All Supported Vehicles</option>
            {FLATTENED_CARS.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <Link href="/checkout" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--success)' }}>
          <ShoppingCart size={20} /> Checkout ({cart.length})
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Loading marketplace catalog...</div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>No compatible performance parts currently listed for this vehicle. Try another!</div>
      ) : (
        <div className={styles.grid}>
          {products.map(p => (
            <div key={p._id} className={styles.card}>
              <Image src={p.image} alt={p.name} width={400} height={250} className={styles.img} unoptimized />
              <div className={styles.content}>
                <div className={styles.brand}>{p.brand} | {p.category}</div>
                <h3 className={styles.name}>{p.name}</h3>
                <p className={styles.desc}>{p.description}</p>
                <div className={styles.compat}>Compatible with: {p.compatibleCars.length > 10 ? 'Universal Fitment' : p.compatibleCars.join(', ')}</div>
                
                <div className={styles.priceRow}>
                  <span>₹{p.price.toLocaleString('en-IN')}</span>
                  <button 
                    className="btn-primary" 
                    style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                    onClick={() => { addToCart(p); alert('Added to cart!'); }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
