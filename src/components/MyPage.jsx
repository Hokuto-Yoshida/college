import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, BookOpen, Key, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY_RESPONSES = 'mind_university_classroom_v1';

export function MyPage({ onClose }) {
    const { user, logout } = useAuth();
    const [userResponses, setUserResponses] = useState([]);

    useEffect(() => {
        // 1. Get all responses
        const saved = localStorage.getItem(STORAGE_KEY_RESPONSES);
        const all = saved ? JSON.parse(saved) : [];

        // 2. Filter for THIS user
        // Ideally we filter by ID, but for existing/anonymous ones we might match name? 
        // For now strict ID match if we add IDs, or just username match if that's what we have.
        // The current Classroom doesn't save user ID yet. We will update Classroom to save user ID.
        // Assuming Classroom saves `userId` field:

        // Fallback: match by username for legacy data or robust fuzzy match? 
        // Let's rely on username for now until we update Classroom to inject user ID.
        const mine = all.filter(r => r.name === user.username || r.userId === user.id);
        setUserResponses(mine.sort((a, b) => b.timestamp - a.timestamp)); // Newest first
    }, [user]);

    if (!user) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            style={{
                position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: '480px', height: '100vh',
                background: 'rgba(5, 10, 20, 0.95)', backdropFilter: 'blur(20px)',
                zIndex: 500, overflowY: 'auto', borderLeft: '1px solid rgba(255,255,255,0.1)',
                padding: '32px'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', fontFamily: 'var(--font-en)' }}>My Portfolio</h2>
                <button
                    onClick={onClose}
                    style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}
                >
                    Close
                </button>
            </div>

            {/* Student Card */}
            <div className="glass-panel" style={{
                padding: '24px', borderRadius: '24px', marginBottom: '32px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                    <div style={{
                        width: 64, height: 64, borderRadius: '50%', background: 'var(--floor-7)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.5rem', fontWeight: 'bold', color: '#000'
                    }}>
                        {user.username[0].toUpperCase()}
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{user.username}</h3>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Student ID: {user.studentId}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Joined</div>
                        <div style={{ fontSize: '1rem' }}>{new Date(user.joinedAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Workshops</div>
                        <div style={{ fontSize: '1rem' }}>{userResponses.length} Completed</div>
                    </div>
                </div>

                <button
                    onClick={() => { logout(); onClose(); }}
                    style={{
                        width: '100%', marginTop: '20px', padding: '10px', borderRadius: '10px',
                        background: 'rgba(255, 100, 100, 0.1)', border: '1px solid rgba(255, 100, 100, 0.3)',
                        color: '#ffaaaa', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                >
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {/* History */}
            <h3 style={{ marginBottom: '20px', fontSize: '1.1rem', color: 'var(--text-muted)' }}>Mind History</h3>

            {userResponses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '2px dashed var(--glass-border)', borderRadius: '16px' }}>
                    <p>まだ記録がありません。<br />教室でワークに参加してみましょう。</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {userResponses.map(r => (
                        <div key={r.id} className="glass-panel" style={{ padding: '16px', borderRadius: '16px', borderLeft: `4px solid ${r.floorId ? 'var(--floor-4)' : 'gray'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                                <span className="badge" style={{ padding: '2px 8px', fontSize: '0.75rem' }}>{r.floorId || 'Campus'}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{new Date(r.timestamp).toLocaleDateString()}</span>
                            </div>
                            <div style={{ marginBottom: '8px', fontSize: '0.9rem', opacity: 0.9 }}>
                                {Object.values(r.answers)[1] || Object.values(r.answers)[0]}
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </motion.div>
    );
}
