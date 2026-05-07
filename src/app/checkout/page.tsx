'use client';
import { useState } from 'react';
import { useCart } from '@/components/CartProvider';
import { useRouter } from 'next/navigation';
import { CreditCard, ShoppingBag, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import styles from './page.module.css';

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [form, setForm] = useState({ name: '', address: '', state: '', pin: '' });

  const handleCheckout = () => {
    if (!form.name || !form.address) return alert('Please fill shipping details safely to ensure delivery.');
    if (cart.length === 0) return alert('Your cart is fully empty');
    
    setLoading(true);
    // Simulate robust payment processing securely via hypothetical PG Stripe implementation
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setOrderId(`MOD-${Math.floor(Math.random() * 90000) + 10000}`);
      clearCart();
    }, 2000);
  };

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '10rem 2rem' }}>
        <CheckCircle size={64} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
        <h1>Payment Successful!</h1>
        <p style={{ opacity: 0.8, marginTop: '1rem', marginBottom: '2rem' }}>Your performance parts are actively being prepared. Order ID: {orderId}</p>
        <button className="btn-primary" onClick={() => router.push('/dashboard')}>Return to Garage</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h2 className={styles.title}><ShoppingBag /> Shipping Details</h2>
        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div className={styles.formGroup}>
          <label>Delivery Address</label>
          <input className="input-field" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label>State / Province</label>
            <input className="input-field" value={form.state} onChange={e => setForm({...form, state: e.target.value})} />
          </div>
          <div className={styles.formGroup} style={{ flex: 1 }}>
            <label>PIN Code</label>
            <input className="input-field" value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} />
          </div>
        </div>

        <h2 className={styles.title} style={{ marginTop: '3rem' }}><CreditCard /> Secure Encrypted Payment</h2>
        <div className={styles.stripeBox}>
          <p>This is a simulated Sandbox Checkout environment for Stripe / Razorpay.</p>
          <div className={styles.mockInput}>**** **** **** 4242</div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <div className={styles.mockInput}>MM/YY</div>
             <div className={styles.mockInput}>CVC</div>
          </div>
          <button 
            className="btn-primary" 
            onClick={handleCheckout} 
            disabled={loading || cart.length === 0}
            style={{ width: '100%', background: 'var(--success)', padding: '1rem', fontSize: '1.1rem' }}
          >
            {loading ? 'Processing Encrypted Payment...' : `Confirm Payment: ₹${cartTotal.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>

      <div className={styles.section} style={{ height: 'fit-content' }}>
        <h2 className={styles.title}>Order Summary</h2>
        <div style={{ marginBottom: '2rem' }}>
          {cart.length === 0 ? <p style={{ opacity: 0.6 }}>Your modular cart is entirely empty.</p> : cart.map(item => (
            <div key={item._id} className={styles.cartItem}>
              <Image src={item.image} alt={item.name} width={80} height={80} unoptimized className={styles.cartItemImg} />
              <div className={styles.cartItemDetails}>
                <div className={styles.cartItemName}>{item.name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Qty: {item.quantity}</div>
                <div className={styles.cartItemPrice}>₹{item.price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Taxes & Secure Shipping</span>
            <span style={{ color: 'var(--success)' }}>Free</span>
          </div>
          <div className={styles.totalRow}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary)' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
