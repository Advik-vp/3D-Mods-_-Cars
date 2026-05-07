'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { determineBaseGeometry } from '@/lib/constants';
import { Sparkles, Camera, TrendingUp, ShieldAlert, ShieldCheck, Video, VideoOff } from 'lucide-react';
import { useCamera } from '@/components/CameraProvider';
import Image from 'next/image';
import styles from './page.module.css';

type DashboardUser = {
  name: string;
  email: string;
  carModel?: string;
  twoFactorEnabled?: { email?: boolean; phone?: boolean };
};

type Modification = {
  _id: string;
  name: string;
  createdAt: string;
  config?: Record<string, unknown>;
  previewImage?: string;
  carModel?: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [mods, setMods] = useState<Modification[]>([]);
  const [loading, setLoading] = useState(true);
  const { status: cameraStatus, requestAccess } = useCamera();

  // Resale Predictor Logic
  const [resaleParams, setResaleParams] = useState({ age: 2, mileage: 15000, condition: 'good', modType: 'bodykit' });
  const [resaleValue, setResaleValue] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch('/api/auth/me');
        if (!userRes.ok) throw new Error('Not logged in');
        const userData = await userRes.json();
        setUser(userData.user);

        const modRes = await fetch('/api/user/modifications');
        if (modRes.ok) {
          const modData = await modRes.json();
          setMods(modData.modifications);
        }
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  if (loading) return <div className={styles.container}>Loading dashboard...</div>;
  if (!user) return null;

  // AI Recommendation Engine Logic
  const baseType = user.carModel ? determineBaseGeometry(user.carModel) : 'sedan';
  const aiRecommendation = baseType === 'supercar'
    ? { title: 'Apollo Track Weapon Kit', desc: 'For your high-performance Apollo, AI recommends Carbon Fibre Aero Splitter, Matte Black or Red livery, Slick Track Alloys, and Titanium Exhaust upgrades for maximum downforce.', style: 'Extreme Performance' }
    : baseType === 'suv'
    ? { title: 'Off-Road Explorer Kit', desc: 'Matching your SUV frame, AI suggests Matte Black Paint, Sport Wheels, Dark Tint, and Halogen lights for optimal outdoor visibility.', style: 'Rugged Aesthetics' }
    : baseType === 'hatchback'
    ? { title: 'Urban Sport Package', desc: 'For agile hatchbacks, AI recommends Vibrant Red Paint, Window Medium Tint, Carbon Fiber Spoiler, and LED arrays.', style: 'Dynamic Sporty' }
    : { title: 'Executive Luxury Line', desc: 'Complementing your Sedan, AI suggests Deep Blue Paint, Standard Alloys, Light Tint, and an elegant unmarked body.', style: 'Sleek Luxury' };

  const predictResale = () => {
    // Determine rough base price based on model for realistic simulation
    let basePrice = 1000000; // 10 Lakhs default
    const carLower = (user.carModel || '').toLowerCase();
    if (carLower.includes('fortuner')) basePrice = 4000000;
    else if (carLower.includes('thar') || carLower.includes('creta') || carLower.includes('harrier')) basePrice = 1800000;
    else if (carLower.includes('swift') || carLower.includes('baleno') || carLower.includes('tiago')) basePrice = 750000;

    let value = basePrice;
    
    // AI Factor: Age depreciation ~12% per year
    value *= Math.pow(0.88, resaleParams.age);
    
    // AI Factor: Mileage depreciation ~1% every 10,000 km
    value *= (1 - (resaleParams.mileage / 10000) * 0.01);
    
    // AI Factor: Condition multiplier
    const condFactors: Record<string, number> = { excellent: 1.1, good: 1.0, fair: 0.85, poor: 0.7 };
    value *= condFactors[resaleParams.condition] || 1.0;
    
    // AI Factor: Mod value retention
    if (resaleParams.modType === 'alloy') value *= 1.05;
    if (resaleParams.modType === 'paint') value *= 1.02;

    setResaleValue(Math.max(Math.round(value), 50000));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Garage</h1>
        <p className={styles.subtitle}>Welcome back, {user.name}</p>
      </div>

      <div className={styles.grid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Profile Card */}
          <div className={`glass-panel ${styles.card}`}>
            <h2 className={styles.cardTitle}>Profile Summary</h2>
            <div className={styles.profileInfo}>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Name</span>
                <span className={styles.profileValue}>{user.name}</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Email Address</span>
                <span className={styles.profileValue}>{user.email}</span>
              </div>
              <div className={styles.profileItem}>
                <span className={styles.profileLabel}>Default Car Model</span>
                <span className={styles.profileValue}>{user.carModel || 'Not Set'}</span>
              </div>

              <div style={{ marginTop: '1.5rem', padding: '1rem', background: cameraStatus === 'granted' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: cameraStatus === 'granted' ? '1px solid var(--success)' : '1px solid var(--error)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {cameraStatus === 'granted' ? <Video size={32} color="var(--success)" /> : <VideoOff size={32} color="var(--error)" />}
                <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 800, color: cameraStatus === 'granted' ? 'var(--success)' : 'var(--error)' }}>
                      Camera Access: {cameraStatus === 'granted' ? 'Enabled' : 'Disabled'}
                   </div>
                   <div style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.4, marginTop: '4px' }}>
                      {cameraStatus === 'granted' ? 'Hardware APIs actively bound securely for AI Scanning.' : 'Hardware permissions suspended. Core AI features restricted.'}
                   </div>
                </div>
                {cameraStatus !== 'granted' && (
                  <button onClick={() => requestAccess()} className="btn-primary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>Enable Camera</button>
                )}
              </div>
              
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: (user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: (user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) ? '1px solid var(--success)' : '1px solid var(--error)', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {(user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) ? <ShieldCheck size={32} color="var(--success)" /> : <ShieldAlert size={32} color="var(--error)" />}
                <div style={{ flex: 1 }}>
                   <div style={{ fontWeight: 800, color: (user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) ? 'var(--success)' : 'var(--error)' }}>
                      Security Level: {(user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) ? 'High' : 'Low'}
                   </div>
                   <div style={{ fontSize: '0.75rem', opacity: 0.8, lineHeight: 1.4, marginTop: '4px' }}>
                      {(user.twoFactorEnabled?.email || user.twoFactorEnabled?.phone) ? 'Two-Step Verification (2FA) is currently enabled securely locking down unauthorized access paths.' : 'Account is vulnerable. Please configure 2FA in Profile Settings.'}
                   </div>
                </div>
              </div>
              
              <Link href="/profile" className="btn-primary" style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                Edit Profile
              </Link>
              
              <button 
                onClick={async () => {
                  await fetch('/api/auth/logout', { method: 'POST' });
                  router.push('/');
                  router.refresh();
                }} 
                style={{ background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)', padding: '0.75rem', borderRadius: 'var(--radius)', marginTop: '0.5rem' }}
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* AI Smart Panel */}
          <div className={`glass-panel ${styles.card}`} style={{ border: '1px solid var(--primary)' }}>
            <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Sparkles size={24} /> AI Smart Hub
            </h2>
            
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius)' }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>AI Style Recommendation</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, marginBottom: '0.25rem' }}>{aiRecommendation.title}</div>
              <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>{aiRecommendation.desc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => requestAccess(() => router.push('/scan'))} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: '#10b981', border: 'none', width: '100%', padding: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                <Camera size={18} /> AI Camera Car Scan
              </button>
              <button onClick={() => requestAccess(() => router.push('/damage-detection'))} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--warning)', color: '#000', border: 'none', width: '100%', padding: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                <Camera size={18} /> AI Damage Detection
              </button>
              <button onClick={() => requestAccess(() => router.push('/configurator'))} className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: 'none', width: '100%', padding: '0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}>
                Open 3D/AR Studio
              </button>
              <Link href="/garage" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                Enter Virtual 3D Garage
              </Link>
              <Link href="/community" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                View Community Designs
              </Link>
            </div>
          </div>
        </div>

        {/* History Panel & Predictor */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* AI Resale Value Predictor */}
          <div className={`glass-panel ${styles.card}`}>
            <h2 className={styles.cardTitle} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={24} /> AI Resale Value Predictor</h2>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', opacity: 0.8 }}>Estimate the market value of your {user.carModel || 'vehicle'} after modifications.</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Vehicle Age (Years)</label>
                 <input type="number" className="input-field" value={resaleParams.age} onChange={e => setResaleParams({...resaleParams, age: Number(e.target.value)})} min={0} max={30} />
              </div>
              <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Mileage (km)</label>
                 <input type="number" className="input-field" value={resaleParams.mileage} onChange={e => setResaleParams({...resaleParams, mileage: Number(e.target.value)})} step={1000} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Current Condition</label>
                 <select className="input-field" value={resaleParams.condition} onChange={e => setResaleParams({...resaleParams, condition: e.target.value})}>
                    <option value="excellent">Excellent (Like New)</option>
                    <option value="good">Good (Minor Wear)</option>
                    <option value="fair">Fair (Visible Scratches)</option>
                    <option value="poor">Poor (Requires Bodywork)</option>
                 </select>
              </div>
              <div style={{ flex: 1 }}>
                 <label style={{ fontSize: '0.8rem', opacity: 0.8 }}>Primary Mod Type</label>
                 <select className="input-field" value={resaleParams.modType} onChange={e => setResaleParams({...resaleParams, modType: e.target.value})}>
                    <option value="bodykit">Performance Body Kit</option>
                    <option value="alloy">Premium Alloy Wheels</option>
                    <option value="paint">Custom Paint Job</option>
                    <option value="none">Stock (No Mods)</option>
                 </select>
              </div>
            </div>

            <button onClick={predictResale} className="btn-primary" style={{ width: '100%' }}>Predict Value</button>

            {resaleValue !== null && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>Estimated AI Resale Price</div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--success)' }}>
                  ₹{resaleValue.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>

          <div className={`glass-panel ${styles.card}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Saved Configurations</h2>
            </div>
            
            {mods.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
                <p>You haven&apos;t saved any modifications yet.</p>
              </div>
            ) : (
              <div className={styles.historyGrid}>
                {mods.map(mod => (
                  <div key={mod._id} className={styles.historyCard}>
                    {mod.previewImage ? (
                      <>
                        <Image src={mod.previewImage} alt={mod.name} width={200} height={120} unoptimized className={styles.historyImg} />
                      </>
                    ) : (
                      <div className={styles.historyImg} />
                    )}
                    <div className={styles.historyContent}>
                      <div className={styles.historyName}>{mod.name}</div>
                      <div className={styles.historyDate}>{new Date(mod.createdAt).toLocaleDateString()}</div>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                        <Link 
                          href={`/configurator?base=${determineBaseGeometry(mod.carModel || 'Standard Sedan')}`} 
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', background: 'var(--primary)', color: 'white', borderRadius: '4px' }}
                        >
                          Load 3D
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={`glass-panel ${styles.card}`}>
            <h2 className={styles.cardTitle} style={{ margin: 0 }}>Recent Orders</h2>
            <div style={{ padding: '3rem', textAlign: 'center', opacity: 0.6 }}>
              <p>You aren&apos;t any orders in the marketplace yet.</p>
            </div>
            <Link href="/marketplace" className="btn-primary" style={{ display: 'block', textAlign: 'center', maxWidth: '300px', margin: '0 auto' }}>
              Explore Marketplace Deals
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
