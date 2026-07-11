import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgBg from '../assets/floor_bg.png';

export const Floor6Intro = ({ onEnter }) => {
    const { scrollYProgress } = useScroll();

    const whiteLayerOpacity = useTransform(scrollYProgress,
        [0, 0.08, 0.18, 0.26, 0.35, 0.45, 0.54, 0.62, 0.72, 0.81, 1.0],
        [0, 1,    1,    0,    1,    1,    0,    1,    1,    0,    0  ]
    );

    const textContainerStyle = {
        maxWidth: '800px',
        width: '100%',
        padding: '50px 20px',
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
        color: '#ffffff',
        fontFamily: 'var(--font-jp)',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        letterSpacing: '0.1em'
    };

    const blockStyle = { marginBottom: '7rem' };
    const lineStyle = { margin: 0, lineHeight: 4.0 };

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${imgBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.4))',
                    zIndex: 2
                }} />
            </div>

            <motion.div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(255, 255, 255, 0.3)',
                pointerEvents: 'none',
                opacity: whiteLayerOpacity,
                zIndex: 20
            }} />

            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>

                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>「時代」を動かす感性が、ここで目覚める。</p>
                            <p style={lineStyle}>——空の視点から、世界の流れを読み解く。</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>直感とは、蓄積された知恵が<br/>一瞬に凝縮されたものです。</p>
                            <p style={lineStyle}>ここでは、その直感を信頼し、<br/>形にする力を育てます。</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>未来は予測するものではなく、<br/>感じ取るものです。</p>
                            <p style={lineStyle}>あなたの感性が、<br/>まだ見えていない景色を先取りします。</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontWeight: 'bold', fontSize: '1.2em' }}>マインドプロセス6：時代感応（Era Resonance）</p>
                            <br />
                            <p style={lineStyle}>感性を拓き、直感を形にする。</p>
                            <p style={lineStyle}>未来の景色を先取りするスタジオへ、ようこそ。</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontSize: '2em', fontWeight: 'bold', color: 'var(--floor-6)' }}>6F</p>
                            <p style={{ ...lineStyle, fontSize: '1.5em', fontWeight: 'bold' }}>時代を動かす</p>
                        </div>
                    </div>
                </motion.div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        style={{
                            padding: '16px 48px',
                            borderRadius: '40px',
                            background: 'rgba(255,255,255,0.12)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.35)',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        6階のフロアへ進む <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
