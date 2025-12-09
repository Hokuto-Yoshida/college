import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';

export function ResponseModal({ isOpen, onClose, response, questions }) {
    if (!isOpen || !response) return null;

    return (
        <AnimatePresence>
            <div
                style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-panel"
                    style={{
                        position: 'relative',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '85vh',
                        overflowY: 'auto',
                        borderRadius: '24px',
                        padding: '32px',
                        background: 'var(--bg-deep)', // Darker background for readability
                        border: '1px solid var(--glass-highlight)',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }}
                >
                    <button
                        onClick={onClose}
                        style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <X />
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--glass-border)' }}>
                        <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}>
                            <User size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{response.name}</h3>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                {new Date(response.timestamp).toLocaleString('ja-JP')}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {questions.map((q, index) => {
                            const answer = response.answers[q.id];
                            if (!answer) return null; // Skip unanswered ? or show empty? Show all for completeness.

                            return (
                                <div key={q.id}>
                                    <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                                        Q{index + 1}. {q.text}
                                    </h4>
                                    <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.6, whiteSpace: 'pre-wrap', color: 'var(--text-main)' }}>
                                        {answer || <span style={{ opacity: 0.3 }}>(未回答)</span>}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <button
                            onClick={onClose}
                            style={{
                                padding: '12px 32px',
                                borderRadius: '30px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(255,255,255,0.05)',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            閉じる
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
