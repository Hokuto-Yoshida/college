import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import classroomBg from '../assets/virtual_classroom.png';

export function ClassroomModal({ isOpen, onClose, linkUrl, title }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Classroom Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${classroomBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    pointerEvents: 'none'
                }} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        padding: '12px',
                        borderRadius: '50%',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: 'rgba(255,255,255,0.8)',
                        color: 'black',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                >
                    <X size={24} />
                </button>

                {/* Content Area (Placed on Whiteboard roughly) */}
                <div style={{
                    position: 'absolute',
                    top: '25%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50%',
                    maxWidth: '600px',
                    padding: '40px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    border: '1px solid rgba(200,200,200,0.5)'
                }}>
                    <h2 style={{ color: '#333', marginBottom: '16px', fontSize: '1.5rem' }}>{title}</h2>
                    <p style={{ color: '#666', marginBottom: '32px' }}>
                        リアルタイム講義の準備ができました。<br />
                        以下のボタンから、オンライン教室（Zoom等）へ入室してください。
                    </p>

                    <a
                        href={linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '12px',
                            background: 'var(--floor-4, #4facfe)',
                            color: 'white',
                            padding: '16px 32px',
                            borderRadius: '30px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            boxShadow: '0 8px 16px rgba(79, 172, 254, 0.3)',
                            transition: 'transform 0.2s, box-shadow 0.2s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 12px 20px rgba(79, 172, 254, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 8px 16px rgba(79, 172, 254, 0.3)';
                        }}
                    >
                        <ExternalLink size={20} />
                        講義ルームへ入室する
                    </a>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
