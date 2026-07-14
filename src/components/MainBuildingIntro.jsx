import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { SpiralNav } from './SpiralNav';

import imgPath1 from '../assets/intro_bg_1.png';
import imgPath2 from '../assets/intro_bg_2.png';
import imgPath3 from '../assets/intro_bg_3.png';
import imgPath4 from '../assets/intro_bg_4.png';
import introOpening from '../assets/intro_opening.png';

// 上下の端をぼかすマスク
const MASK = 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)';

export const MainBuildingIntro = ({ onEnter, floors = [], onSelectFloor }) => {
    const { scrollYProgress } = useScroll();
    const [showElevator, setShowElevator] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        setButtonVisible(v >= 0.97);
    });

    // ── 4サイクル均等設計 ─────────────────────────────────────────
    // 各サイクル: 背景だけ → 画像挿入 → レイヤー＋テキスト → レイヤー消す → 背景と一緒に画像退場
    // bg0: 0-0.25, bg1: 0.25-0.50, bg2: 0.50-0.75, bg3: 0.75-1.00 (トランジション 0.06)
    // 100% にすることでトランジション中点で bg どうしがぴったり接する（黒なし）
    const bg0Y = useTransform(scrollYProgress, [0, 0.25, 0.31], ['0%', '0%', '-100%']);
    const bg1Y = useTransform(scrollYProgress, [0.25, 0.31, 0.50, 0.56], ['100%', '0%', '0%', '-100%']);
    const bg2Y = useTransform(scrollYProgress, [0.50, 0.56, 0.75, 0.81], ['100%', '0%', '0%', '-100%']);
    const bg3Y = useTransform(scrollYProgress, [0.75, 0.81], ['100%', '0%']);

    // ── opening image: 下からスライドイン、退場は背景と同時 ──────
    const open0Y = useTransform(scrollYProgress, [0.03, 0.07, 0.25, 0.31], ['100%', '0%', '0%', '-100%']);
    const open1Y = useTransform(scrollYProgress, [0.32, 0.36, 0.50, 0.56], ['100%', '0%', '0%', '-100%']);
    const open2Y = useTransform(scrollYProgress, [0.57, 0.61, 0.75, 0.81], ['100%', '0%', '0%', '-100%']);
    const open3Y = useTransform(scrollYProgress, [0.82, 0.86], ['100%', '0%']);

    // ── 白幕: 画像の後にスライドイン ─────────────────────────────
    const veil0Y = useTransform(scrollYProgress, [0.08, 0.11, 0.19, 0.22], ['100%', '0%', '0%', '-100%']);
    const veil1Y = useTransform(scrollYProgress, [0.37, 0.40, 0.45, 0.48], ['100%', '0%', '0%', '-100%']);
    const veil2Y = useTransform(scrollYProgress, [0.62, 0.65, 0.70, 0.73], ['100%', '0%', '0%', '-100%']);
    const veil3Y = useTransform(scrollYProgress, [0.87, 0.90, 0.94, 0.97], ['100%', '0%', '0%', '-100%']);

    // ── テキスト: 各白幕内でスクロール ───────────────────────────
    const t0Y = useTransform(scrollYProgress, [0.11, 0.13, 0.17, 0.19], ['60vh', '0vh', '0vh', '-60vh']);
    const t1Y = useTransform(scrollYProgress, [0.40, 0.42, 0.43, 0.45], ['50vh', '0vh', '0vh', '-50vh']);
    const t2Y = useTransform(scrollYProgress, [0.65, 0.67, 0.68, 0.70], ['50vh', '0vh', '0vh', '-50vh']);
    const t3Y = useTransform(scrollYProgress, [0.90, 0.92, 0.93, 0.95], ['50vh', '0vh', '0vh', '-50vh']);

    // ── スタイル ───────────────────────────────────────────────────
    const textStyle = {
        maxWidth: '720px',
        width: '100%',
        textAlign: 'center',
        fontSize: 'clamp(0.75rem, 1.5vw, 1rem)',
        color: '#333',
        fontFamily: 'var(--font-jp)',
        letterSpacing: '0.12em',
        padding: '0 32px',
    };
    const ln = { margin: 0, paddingBottom: '1.8rem', lineHeight: 2.8 };

    const sections = [
        {
            veilY: veil0Y,
            items: [{
                y: t0Y,
                node: (
                    <div style={textStyle}>
                        <p style={{ ...ln, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 'bold', color: '#222', paddingBottom: '1rem' }}>本館</p>
                        <p style={{ ...ln, fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)', color: '#999', fontFamily: 'var(--font-en)', letterSpacing: '0.35em', paddingBottom: '1.4rem' }}>Entrance</p>
                        <p style={{ ...ln, paddingBottom: 0 }}>心の階層を7階建ての建物で表現。感性と論理を統合するメインキャンパス。</p>
                    </div>
                ),
            }],
        },
        {
            veilY: veil1Y,
            items: [{
                y: t1Y,
                node: (
                    <div style={textStyle}>
                        <p style={ln}>この大学はその心の階層を、7つの建物で表現しています。</p>
                        <p style={ln}>「心の視点を引き上げる」ための"学び"の場と空間が各建物で繰り広げられています。</p>
                        <p style={{ ...ln, paddingBottom: 0 }}>自由自在に行ったり来たりを楽しみながら、素直にあなた自身の感じるままに─</p>
                    </div>
                ),
            }],
        },
        {
            veilY: veil2Y,
            items: [{
                y: t2Y,
                node: (
                    <div style={textStyle}>
                        <p style={{ ...ln, fontWeight: 'bold', color: '#222' }}>人はすでに何かを持っている</p>
                        <p style={ln}>まだ言葉になっていない可能性。まだ形になっていない方向。</p>
                        <p style={{ ...ln, paddingBottom: 0 }}>人の心の奥には、その人らしい可能性がすでに存在しています。</p>
                    </div>
                ),
            }],
        },
        {
            veilY: veil3Y,
            items: [{
                y: t3Y,
                node: (
                    <div style={textStyle}>
                        <p style={{ ...ln, fontWeight: 'bold', color: '#222' }}>その人らしさが現れるとき</p>
                        <p style={ln}>人は自分らしさと繋がるとき自然に動き始めます。</p>
                        <p style={{ ...ln, paddingBottom: 0 }}>それは外から与えられた変化ではなく、内側から生まれる変化だからです。</p>
                    </div>
                ),
            }],
        },
    ];

    return (
        <div style={{ background: '#000', minHeight: '500vh', position: 'relative' }}>

            {/* ── 背景レイヤー ── */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                {[bg0Y, bg1Y, bg2Y, bg3Y].map((bgY, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${[imgPath1, imgPath2, imgPath3, imgPath4][i]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            y: bgY,
                        }}
                    />
                ))}
            </div>

            {/* ── opening image: 下からスライドイン、背景と一緒に退場（2枚重ね） ── */}
            {[open0Y, open1Y, open2Y, open3Y].map((y, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 3,
                        pointerEvents: 'none',
                        y,
                    }}
                >
                    {[0, 1].map(j => (
                        <div key={j} style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${introOpening})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }} />
                    ))}
                </motion.div>
            ))}

            {/* ── 白幕 + テキスト ── */}
            {sections.map((section, si) => (
                <div
                    key={si}
                    style={{
                        position: 'fixed', inset: 0,
                        zIndex: 10 + si,
                        overflow: 'hidden',
                        pointerEvents: 'none',
                    }}
                >
                    <motion.div
                        style={{
                            position: 'absolute', inset: 0,
                            background: 'rgba(255,255,255,0.52)',
                            y: section.veilY,
                            maskImage: MASK,
                            WebkitMaskImage: MASK,
                        }}
                    >
                        {section.items.map((item, ii) => (
                            <motion.div
                                key={ii}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    y: item.y,
                                }}
                            >
                                {item.node}
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            ))}

            {/* ── エレベーターボタン ── */}
            {buttonVisible && (
                <div style={{
                    position: 'fixed', bottom: '10vh', left: 0, right: 0,
                    display: 'flex', justifyContent: 'center', zIndex: 30,
                }}>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowElevator(true)}
                        style={{
                            padding: '14px 44px',
                            borderRadius: '40px',
                            background: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.4)',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            backdropFilter: 'blur(8px)',
                            letterSpacing: '0.15em',
                            fontFamily: 'var(--font-jp)',
                        }}
                    >
                        エレベーターに入る
                    </motion.button>
                </div>
            )}

            {/* ── エレベーターパネル ── */}
            {showElevator && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                        position: 'fixed', top: 0, right: 0, bottom: 0,
                        width: 'min(500px, 90vw)', zIndex: 100,
                        background: 'rgba(255,255,255,0.08)',
                        borderLeft: '1px solid rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        overflow: 'hidden',
                    }}
                >
                    <SpiralNav
                        floors={floors}
                        onSelectFloor={(id) => {
                            setShowElevator(false);
                            onSelectFloor && onSelectFloor(id);
                        }}
                    />
                </motion.div>
            )}
        </div>
    );
};
