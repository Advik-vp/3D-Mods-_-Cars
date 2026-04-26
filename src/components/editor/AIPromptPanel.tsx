'use client';

import React, { useState } from 'react';
import styles from '@/app/studio/studio.module.css';
import { useStudioContext } from '@/context/StudioContext';
import { Sparkles, Loader2 } from 'lucide-react';

export function AIPromptPanel() {
  const { updateCarConfig } = useStudioContext();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setError('');
    
    try {
      const res = await fetch('/api/ai-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      updateCarConfig(data.config);
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.toolContent}>
      <h3><span style={{color: '#00f3ff'}}>✦</span> AI Prompt Studio</h3>
      <p style={{ color: '#8b9bb4', fontSize: '0.9rem', marginBottom: '10px' }}>
        Describe your dream car aesthetic. Our AI will automatically configure the paint, styling, body kit, and illumination.
      </p>
      
      <textarea 
        className={styles.cyberTextArea}
        placeholder="e.g. Make this car look like a futuristic cyberpunk racing car with widebody fenders and purple neon lights..."
        value={aiPrompt}
        onChange={(e) => setAiPrompt(e.target.value)}
      />
      
      {error && <p style={{ color: '#ff4444', fontSize: '0.85rem', marginBottom: '10px' }}>{error}</p>}
      
      <button 
        className={styles.cyberBtn} 
        onClick={handleGenerate}
        disabled={isGenerating || !aiPrompt}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', opacity: isGenerating ? 0.7 : 1 }}
      >
        {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
        {isGenerating ? 'Generating Architecture...' : 'Generate AI Design'}
      </button>
    </div>
  );
}
