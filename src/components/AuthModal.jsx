import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, ArrowRight, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AuthModal({ isOpen, onClose }) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.username || !formData.password) {
            setError('すべてのフィールドを入力してください');
            return;
        }

        const result = isLogin
            ? login(formData.username, formData.password)
            : register(formData.username, formData.password);

        if (result.success) {
            onClose();
            // Optional: Show welcome toast?
        } else {
            setError(result.message);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 1000,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    style={{
                        width: '100%', maxWidth: '400px',
                        background: 'rgba(10, 15, 30, 0.85)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '24px',
                        padding: '32px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Decorative Elements */}
                    <div style={{ position: 'absolute', top: -100, left: -100, width: 200, height: 200, background: 'radial-gradient(circle, rgba(129,230,217,0.15), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                    <div style={{ position: 'absolute', bottom: -100, right: -100, width: 200, height: 200, background: 'radial-gradient(circle, rgba(167,139,250,0.15), transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <X size={24} />
                    </button>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: 60, height: 60, margin: '0 auto 16px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02))',
                            border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Key size={24} color="var(--floor-5)" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', margin: 0, fontWeight: 300 }}>
                            {isLogin ? 'Welcome Back' : 'Student Entry'}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>
                            {isLogin ? 'マインド大学へログイン' : 'あなたのための心の階層キーを発行します'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="ユーザー名"
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 44px',
                                        borderRadius: '12px', background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '1rem',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="パスワード"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    style={{
                                        width: '100%', padding: '12px 12px 12px 44px',
                                        borderRadius: '12px', background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: 'white', fontSize: '1rem',
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ color: '#ff6b6b', fontSize: '0.9rem', marginBottom: '20px', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{
                                width: '100%', padding: '14px', borderRadius: '14px',
                                background: 'linear-gradient(90deg, var(--floor-5), var(--floor-4))',
                                color: '#000', fontWeight: 'bold', fontSize: '1rem', border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                marginBottom: '20px'
                            }}
                        >
                            {isLogin ? 'ログイン' : '登録して始める'} <ArrowRight size={18} />
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        {isLogin ? 'まだアカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？'}
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            style={{
                                background: 'none', border: 'none', color: 'var(--floor-3)',
                                fontWeight: 'bold', cursor: 'pointer', marginLeft: '8px',
                                textDecoration: 'underline'
                            }}
                        >
                            {isLogin ? '新規登録' : 'ログイン'}
                        </button>
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
