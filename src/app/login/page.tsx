'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import ThreeBackground from '@/components/ThreeBackground';
import { ShieldCheck, Phone, Mail, ArrowRight, Smartphone } from 'lucide-react';
import styles from '../auth.module.css';

export default function Login() {
  const router = useRouter();
  
  // Login Mode
  const [loginMode, setLoginMode] = useState<'phone' | 'email'>('phone');
  
  // State for Phone Auth
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  // State for Email Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Common State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // Initialize Recaptcha only once
    const isMock = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('mock');
    
    if (typeof window !== 'undefined' && !recaptchaVerifier && recaptchaContainerRef.current && !isMock) {
      try {
        const verifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
          size: 'invisible',
          callback: () => {
            // reCAPTCHA solved
          }
        });
        setRecaptchaVerifier(verifier);
      } catch (err) {
        console.error('Recaptcha init failed', err);
      }
    }
    
    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!phoneNumber.startsWith('+')) {
      setError('Please include country code (e.g., +91 for India)');
      setLoading(false);
      return;
    }

    try {
      const isMock = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('mock');
      
      if (isMock) {
         console.warn('Simulating OTP sent due to mock Firebase config');
         setOtpSent(true);
         setLoading(false);
         return;
      }

      if (!recaptchaVerifier) throw new Error('Recaptcha not initialized (check Firebase config)');
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let idToken = 'mock-id-token';
      
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        idToken = await result.user.getIdToken();
      } else if (process.env.NODE_ENV !== 'development') {
        throw new Error('OTP confirmation session expired');
      }

      // Send to our Next.js backend to bridge session
      const res = await fetch('/api/auth/firebase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, phoneNumber })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication bridge failed');

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      // 2FA Intercept
      if (data.requires2FA) {
        router.push(`/verify-otp?token=${data.tempToken}&method=${data.method}`);
        return;
      }

      router.push('/dashboard');
      router.refresh(); 
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      
      {/* 3D Dashboard Background */}
      <ThreeBackground />
      
      {/* Invisible Recaptcha Container */}
      <div ref={recaptchaContainerRef}></div>

      {/* Login Glassmorphic UI */}
      <div className={`glass-panel ${styles.card}`} style={{ zIndex: 10, maxWidth: '450px', width: '90%', padding: '3rem', background: 'rgba(10, 10, 10, 0.65)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255, 255, 255, 0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
           <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}>
              <ShieldCheck size={32} color="#fff" />
           </div>
        </div>

        <h1 className={styles.title} style={{ textAlign: 'center', fontSize: '1.8rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Secure Access
        </h1>
        <p className={styles.subtitle} style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Enter your garage using military-grade encryption.
        </p>

        {/* Mode Toggles */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', padding: '0.25rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius)' }}>
           <button onClick={() => setLoginMode('phone')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: 'none', background: loginMode === 'phone' ? 'var(--primary)' : 'transparent', color: loginMode === 'phone' ? '#fff' : 'var(--text)', borderRadius: 'calc(var(--radius) - 4px)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.85rem' }}>
              <Smartphone size={16} /> OTP Login
           </button>
           <button onClick={() => setLoginMode('email')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', border: 'none', background: loginMode === 'email' ? 'var(--surface-hover)' : 'transparent', color: loginMode === 'email' ? '#fff' : 'var(--text)', borderRadius: 'calc(var(--radius) - 4px)', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.85rem' }}>
              <Mail size={16} /> Legacy Email
           </button>
        </div>
        
        {error && <div className={styles.error} style={{ marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>}
        
        {/* Phone Auth Flow */}
        {loginMode === 'phone' && (
          !otpSent ? (
            <form onSubmit={handleSendOtp} className={styles.form}>
              <div>
                <label className="label" style={{ color: 'var(--text-muted)' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="tel" 
                    className="input-field" 
                    placeholder="+91 98765 43210"
                    value={phoneNumber} 
                    onChange={e => setPhoneNumber(e.target.value)} 
                    style={{ paddingLeft: '3rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                    required 
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', height: '3rem', marginTop: '1rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}>
                {loading ? 'Securing Connection...' : <>Send Secure OTP <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className={styles.form}>
              <div>
                <label className="label" style={{ color: 'var(--text-muted)' }}>Enter 6-Digit OTP</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="• • • • • •"
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  maxLength={6}
                  style={{ textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(59, 130, 246, 0.5)' }}
                  required 
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ height: '3rem', marginTop: '1rem', background: 'var(--success)', border: 'none', color: '#000', fontWeight: 'bold' }}>
                {loading ? 'Verifying...' : 'Authenticate & Enter'}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', marginTop: '1rem', textAlign: 'center', width: '100%' }}>
                Change Phone Number
              </button>
            </form>
          )
        )}

        {/* Email Auth Flow */}
        {loginMode === 'email' && (
          <form onSubmit={handleEmailSubmit} className={styles.form}>
            <div>
              <label className="label" style={{ color: 'var(--text-muted)' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                required 
              />
            </div>
            <div>
              <label className="label" style={{ color: 'var(--text-muted)' }}>Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                required 
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading} style={{ height: '3rem', marginTop: '1rem', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
              {loading ? 'Decrypting...' : 'Sign In'}
            </button>
          </form>
        )}
        
        <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No access clearance? <Link href="/signup" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Request Access</Link>
        </p>
      </div>
    </div>
  );
}
