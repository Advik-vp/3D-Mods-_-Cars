'use client';
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Timer } from 'lucide-react';
import styles from './page.module.css';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const method = searchParams.get('method');

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Strict 5 minute global limit
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!token) router.push('/login');
    const timer = setInterval(() => setTimeLeft(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, [token, router]);

  const handleInputChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-advance cursor bridging UX requirements
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const submitOTP = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return setError('Security requirement unmet. Enter all 6 verification digits.');
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken: token, otp: code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Secure pipeline verification rejection');
      
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      setOtp(['', '', '', '', '', '']); // Wipe buffer on failure
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tempToken: token })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      alert('A fresh unique OTP trace has been dispatched safely to your registered ' + method + '.');
      setTimeLeft(300); // Renew constraint limits
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      alert(message);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <ShieldCheck size={56} color="var(--primary)" style={{ margin: '0 auto 1.5rem' }} />
        <h1 className={styles.title}>Two-Step Verification</h1>
        <p className={styles.subtitle}>
          To protect your garage architecture configurations, a 6-digit confirmation protocol code was dispatched strictly via <strong>{method === 'phone' ? 'SMS' : 'Email'}</strong>.
        </p>

        <div className={styles.timer} style={{ color: timeLeft < 60 ? 'var(--error)' : 'var(--warning)' }}>
           <Timer size={32} /> {formatTime(timeLeft)}
        </div>

        {error && <div style={{ color: '#000', background: 'var(--error)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>{error}</div>}

        <form onSubmit={submitOTP}>
          <div className={styles.otpGroup}>
            {otp.map((digit, i) => (
              <input 
                key={i} 
                ref={el => { inputsRef.current[i] = el; }} 
                type="text" 
                inputMode="numeric"
                className={styles.otpBox} 
                value={digit} 
                onChange={e => handleInputChange(i, e.target.value)} 
                onKeyDown={e => handleKeyDown(i, e)} 
                disabled={timeLeft === 0}
                autoFocus={i === 0}
              />
            ))}
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '1.1rem', letterSpacing: '1px' }} disabled={loading || timeLeft === 0}>
            {loading ? 'Verifying Strict Signature...' : 'Confirm Authentication'}
          </button>
        </form>

        <p className={styles.resendText}>
          Did not receive the authentication signature layer? <br/>
          <button className={styles.resendBtn} onClick={handleResend} disabled={timeLeft > 270}>Resend Output Transmission Line</button>
        </p>
      </div>
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <Suspense fallback={<div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: 'var(--primary)' }}>Validating Verification Handshake Pipeline...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
