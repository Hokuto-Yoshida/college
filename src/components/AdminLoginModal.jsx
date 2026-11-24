import React, { useEffect, useRef, useState } from 'react';
import { Lock, X } from 'lucide-react';
import { verifyAdminPassword } from '../data/adminAuth';

// 管理画面（設定）を開く前に出す、パスワードの入力欄
export function AdminLoginModal({ onSuccess, onClose }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [checking, setChecking] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    const submit = async (e) => {
        e.preventDefault();
        if (!password || checking) return;
        setChecking(true);
        setError('');
        try {
            if (await verifyAdminPassword(password)) {
                onSuccess();
            } else {
                setError('パスワードが違います');
                setPassword('');
                inputRef.current?.focus();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
            onClick={onClose}
            style={{
                position: 'fixed', inset: 0, zIndex: 2100, padding: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(5, 10, 20, 0.6)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
            }}
        >
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative', width: '100%', maxWidth: '340px', boxSizing: 'border-box',
                    padding: '28px 24px 24px', borderRadius: '18px',
                    background: 'rgba(66, 51, 41, 0.92)', color: 'white', fontFamily: 'var(--font-jp)',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.45)',
                }}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="閉じる"
                    style={{
                        position: 'absolute', top: '10px', right: '10px', width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', borderRadius: '50%', background: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                    }}
                >
                    <X size={18} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Lock size={18} />
                    <h2 id="admin-login-title" style={{ margin: 0, fontSize: '1.05rem' }}>管理画面</h2>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '0.8rem', opacity: 0.8 }}>パスワードを入力してください</p>
                <input
                    ref={inputRef}
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    aria-label="パスワード"
                    aria-invalid={!!error}
                    style={{
                        width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '1rem',
                        border: `1px solid ${error ? '#f87171' : 'rgba(255,255,255,0.3)'}`,
                        background: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none',
                    }}
                />
                <div role="alert" style={{ minHeight: '1.4em', margin: '6px 0 10px', fontSize: '0.8rem', color: '#fca5a5' }}>
                    {error}
                </div>
                <button
                    type="submit"
                    disabled={!password || checking}
                    style={{
                        width: '100%', padding: '11px', borderRadius: '999px', border: 'none',
                        background: !password || checking ? 'rgba(188,163,146,0.35)' : '#bca392',
                        color: '#2a2019', fontWeight: 'bold', fontSize: '0.95rem', cursor: !password || checking ? 'default' : 'pointer',
                    }}
                >
                    {checking ? '確認しています…' : '開く'}
                </button>
            </form>
        </div>
    );
}
