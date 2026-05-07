'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { Heart, MessageSquare, Award, Flame } from 'lucide-react';
import Image from 'next/image';

type CommunityComment = {
  userName: string;
  text: string;
};

type CommunityMod = {
  _id: string;
  name: string;
  carModel: string;
  previewImage?: string;
  likes?: number;
  comments?: CommunityComment[];
  config?: {
    baseModel?: string;
    spoiler?: string;
    interiorColor?: string;
    windowTint?: string;
  };
};

export default function Community() {
  const [mods, setMods] = useState<CommunityMod[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [key: string]: string }>({});
  const [activeComments, setActiveComments] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/community');
        if (res.ok) {
          const data = await res.json();
          setMods(data.modifications || []);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const interact = async (id: string, action: string, text?: string) => {
    try {
      const res = await fetch('/api/community/interact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action, text })
      });
      if (res.ok) {
        const d = await res.json();
        setMods(prev => prev.map(m => m._id === id ? d.mod : m));
        if (action === 'comment') setCommentText({ ...commentText, [id]: '' });
      }
    } catch {
      // Silent fail for community action requests
    }
  };

  if (loading) return <div className={styles.container}>Loading Community Gallery...</div>;

  const featured = mods.length > 0 ? mods[0] : null; 
  const trending = mods.length > 1 ? mods.slice(1) : mods; // fallback showing all in trending

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Community Gallery</h1>
        <p>Explore incredibly engineered custom vehicles shared publicly by the creative ModStudio community.</p>
      </header>

      {featured && (
        <div className={styles.heroCard}>
          <Image src={featured.previewImage || 'https://via.placeholder.com/600x400?text=3D+Profile+Snap'} alt="Featured" width={600} height={400} unoptimized className={styles.heroImg} />
          <div className={styles.heroContent}>
            <div className={styles.featuredBadge}><Award size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }}/> AI Design of the Week</div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{featured.name}</h2>
            <div className={styles.author}>Designed for: {featured.carModel}</div>
            <p className={styles.modDetails} style={{ marginTop: '1rem' }}>
              Base Geometry: {featured.config?.baseModel?.toUpperCase() || 'SEDAN'}<br/>
              Aero Spoiler: {featured.config?.spoiler?.toUpperCase() || 'NONE'}<br/>
              Interior Trim Color: {featured.config?.interiorColor || 'Standard'}<br/>
              Window Tint: {featured.config?.windowTint?.toUpperCase() || 'LIGHT'}<br/>
            </p>
            <div className={styles.interactions} style={{ marginTop: '2rem', borderTop: 'none' }}>
              <button className={styles.likeBtn} onClick={() => interact(featured._id, 'like')} style={{ fontSize: '1.2rem' }}>
                <Heart fill={(featured.likes || 0) > 0 ? '#f43f5e' : 'none'} color={(featured.likes || 0) > 0 ? '#f43f5e' : 'currentColor'} /> 
                {featured.likes || 0} Likes
              </button>
            </div>
          </div>
        </div>
      )}

      {trending.length > 0 && (
        <>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}><Flame color="#ef4444" /> Trending Community Builds</h2>
          <div className={styles.grid}>
            {trending.map(mod => (
              <div key={mod._id} className={styles.postCard}>
                <Image src={mod.previewImage || 'https://via.placeholder.com/300x200?text=Profile'} alt={mod.name} width={300} height={200} unoptimized className={styles.postImg} />
                <div className={styles.postContent}>
                  <h3 style={{ fontSize: '1.25rem' }}>{mod.name}</h3>
                  <div className={styles.author}>{mod.carModel} • Base: {mod.config?.baseModel?.toUpperCase() || 'SEDAN'}</div>
                  
                  <div className={styles.interactions}>
                    <button className={styles.likeBtn} onClick={() => interact(mod._id, 'like')}>
                      <Heart size={18} fill={(mod.likes || 0) > 0 ? '#f43f5e' : 'none'} color={(mod.likes || 0) > 0 ? '#f43f5e' : 'currentColor'} /> {mod.likes || 0}
                    </button>
                    <button className={styles.likeBtn} onClick={() => setActiveComments(activeComments === mod._id ? null : mod._id)}>
                      <MessageSquare size={18} /> {mod.comments?.length || 0}
                    </button>
                  </div>

                  {activeComments === mod._id && (
                    <div className={styles.commentSection}>
                      {mod.comments?.map((c, i) => (
                        <div key={i} className={styles.commentItem}>
                          <strong style={{ color: 'var(--primary)' }}>{c.userName}</strong>: {c.text}
                        </div>
                      ))}
                      <div className={styles.commentInput}>
                        <input className="input-field" style={{ margin: 0 }} placeholder="Add a comment..." value={commentText[mod._id] || ''} onChange={e => setCommentText({...commentText, [mod._id]: e.target.value})} />
                        <button className="btn-primary" onClick={() => interact(mod._id, 'comment', commentText[mod._id])}>Post</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {mods.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>The community gallery is currently empty. Head to the Garage to publish the first build!</div>
      )}
    </div>
  );
}
