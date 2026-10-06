import React from 'react';
import { motion, useTransform } from 'framer-motion';

import doorLeft from '../assets/entrance_door_left.png';
import doorRight from '../assets/entrance_door_right.png';

// フロア内の扉演出（App.jsx の doorPhase2 など）と同じ流れ:
// スクロール最下部でボタン表示 → 押すと扉フェードイン → 扉の下を黒に → 左右に開く → フロアへ
export const EntranceDoor = ({ scrollYProgress, label, onEnter }) => {
    const [phase, setPhase] = React.useState('idle'); // 'idle' | 'split' | 'darken' | 'open'
    const buttonOpacity = useTransform(scrollYProgress, [0.88, 1.0], [0, 1]);
    const buttonPointer = useTransform(scrollYProgress, (p) => (p >= 0.88 ? 'auto' : 'none'));

    const handleOpen = () => {
        setPhase('split');
        setTimeout(() => setPhase('darken'), 950);
        setTimeout(() => setPhase('open'), 1500);
        setTimeout(onEnter, 1500 + 2200);
    };

    return (
        <>
            {phase === 'idle' && (
                <motion.div style={{
                    position: 'fixed', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: buttonOpacity,
                    zIndex: 25,
                    pointerEvents: 'none',
                }}>
                    <motion.button
                        style={{
                            pointerEvents: buttonPointer,
                            padding: '16px 48px',
                            borderRadius: '40px',
                            background: 'rgba(255,255,255,0.12)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.3)',
                            fontSize: '1.1rem',
                            fontFamily: 'var(--font-jp)',
                            letterSpacing: '0.2em',
                            cursor: 'pointer',
                            backdropFilter: 'blur(16px)',
                            WebkitBackdropFilter: 'blur(16px)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                        }}
                        whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleOpen}
                    >
                        {label}
                    </motion.button>
                </motion.div>
            )}

            {phase !== 'idle' && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: phase === 'darken' || phase === 'open' ? 1 : 0 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 29 }}
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, x: phase === 'open' ? '-100%' : '0%' }}
                        transition={{
                            opacity: { duration: 0.8 },
                            x: { duration: 2.2, ease: [0.33, 0.0, 0.2, 1.0] },
                        }}
                        style={{
                            position: 'fixed', top: 0, left: 0,
                            width: '50vw', height: '100vh',
                            backgroundImage: `url(${doorLeft})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'right center',
                            zIndex: 30,
                        }}
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, x: phase === 'open' ? '100%' : '0%' }}
                        transition={{
                            opacity: { duration: 0.8 },
                            x: { duration: 2.2, ease: [0.33, 0.0, 0.2, 1.0] },
                        }}
                        style={{
                            position: 'fixed', top: 0, right: 0,
                            width: '50vw', height: '100vh',
                            backgroundImage: `url(${doorRight})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'left center',
                            zIndex: 30,
                        }}
                    />
                </>
            )}
        </>
    );
};
