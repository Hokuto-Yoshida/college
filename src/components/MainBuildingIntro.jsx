import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { SpiralNav } from './SpiralNav';

import imgPath1 from '../assets/intro_bg_1.png';
import imgPath2 from '../assets/intro_bg_2.png';
import imgPath3 from '../assets/intro_bg_3.png';
import imgPath4 from '../assets/intro_bg_4.png';
import overlayMist2 from '../assets/overlay_mist2.png';
import introOpening from '../assets/intro_opening.png';

const MASK = 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)';

export const MainBuildingIntro = ({ onEnter, floors = [], onSelectFloor }) => {
    const { scrollYProgress } = useScroll();
    const [showElevator, setShowElevator] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);

    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        setButtonVisible(v >= 0.97);
    });

    // ── 4サイクル均等設計 ─────────────────────────────────────────
    // 各背景: 0.25幅, トランジション0.06
    // bg0: 0-0.25 (→0.31退場), bg1: 0.25-0.50, bg2: 0.50-0.75, bg3: 0.75-1.00

    // 100% にすることでトランジション中点で bg どうしがぴったり接する（黒なし）
    const bg0Y = useTransform(scrollYProgress, [0, 0.25, 0.31], ['0%', '0%', '-100%']);
    const bg1Y = useTransform(scrollYProgress, [0.25, 0.31, 0.50, 0.56], ['100%', '0%', '0%', '-100%']);
    const bg2Y = useTransform(scrollYProgress, [0.50, 0.56, 0.75, 0.81], ['100%', '0%', '0%', '-100%']);
    const bg3Y = useTransform(scrollYProgress, [0.75, 0.81], ['100%', '0%']);


    // ── opening image: bg1/2/3 と一緒にスライドイン、3回登場 ─────
    const open1Opacity = useTransform(scrollYProgress, [0.25, 0.31], [0, 1]);
    const open2Opacity = useTransform(scrollYProgress, [0.50, 0.56], [0, 1]);
    const open3Opacity = useTransform(scrollYProgress, [0.75, 0.81], [0, 1]);

    // ── 靄: opening 表示後にフェードイン ─────────────────────────
    // cycle1: opening 0→0.06, mist 0.06→0.10
    // cycle2: bg fully in 0.31, opening 0.31→0.37, mist 0.37→0.41
    // cycle3: bg fully in 0.56, opening 0.56→0.62, mist 0.62→0.66
    // cycle4: bg fully in 0.81, opening 0.81→0.87, mist 0.87→0.91
    const mist0Opacity = useTransform(scrollYProgress,
        [0, 0.06, 0.10, 0.11, 0.21, 0.25],
        [0, 0,    0.75, 0.4,  0.4,  0.75]
    );
    const mist1Opacity = useTransform(scrollYProgress,
        [0.25, 0.37, 0.41, 0.42, 0.47, 0.50],
        [0,    0,    0.75, 0.4,  0.4,  0.75]
    );
    const mist2Opacity = useTransform(scrollYProgress,
        [0.50, 0.62, 0.66, 0.67, 0.72, 0.75],
        [0,    0,    0.75, 0.4,  0.4,  0.75]
    );
    const mist3Opacity = useTransform(scrollYProgress,
        [0.75, 0.87, 0.91, 0.92, 0.97, 1.0],
        [0,    0,    0.75, 0.4,  0.4,  0.3]
    );

    // ── ベール: mistの後にスライドイン ───────────────────────────
    const veil0Y = useTransform(scrollYProgress, [0.08, 0.11, 0.21, 0.25], ['100%', '0%', '0%', '-100%']);
    const veil1Y = useTransform(scrollYProgress, [0.39, 0.42, 0.47, 0.50], ['100%', '0%', '0%', '-100%']);
    const veil2Y = useTransform(scrollYProgress, [0.64, 0.67, 0.72, 0.75], ['100%', '0%', '0%', '-100%']);
    const veil3Y = useTransform(scrollYProgress, [0.89, 0.92, 0.97, 1.00], ['100%', '0%', '0%', '-100%']);

    // ── テキスト: 各ベール内で1つ ────────────────────────────────
    const t0Y = useTransform(scrollYProgress, [0.11, 0.14, 0.18, 0.21], ['60vh', '0vh', '0vh', '-60vh']);
    const t1Y = useTransform(scrollYProgress, [0.42, 0.44, 0.45, 0.47], ['50vh', '0vh', '0vh', '-50vh']);
    const t2Y = useTransform(scrollYProgress, [0.67, 0.69, 0.70, 0.72], ['50vh', '0vh', '0vh', '-50vh']);
    const t3Y = useTransform(scrollYProgress, [0.92, 0.94, 0.95, 0.97], ['50vh', '0vh', '0vh', '-50vh']);

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

            {/* ── 常時薄いデフォルトオーバーレイ ── */}
            <div style={{
                position: 'fixed', inset: 0, zIndex: 1,
                background: 'rgba(255,255,255,0.10)',
                pointerEvents: 'none',
            }} />

            {/* ── opening image: 3回のトランジション時にスライドイン（2枚重ね） ── */}
            {[
                { y: bg1Y, opacity: open1Opacity },
                { y: bg2Y, opacity: open2Opacity },
                { y: bg3Y, opacity: open3Opacity },
            ].map(({ y, opacity }, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 3,
                        pointerEvents: 'none',
                        y,
                        opacity,
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

            {/* ── 靄レイヤー: 各背景と同じyで一緒に動く ── */}
            {[
                { y: bg0Y, opacity: mist0Opacity },
                { y: bg1Y, opacity: mist1Opacity },
                { y: bg2Y, opacity: mist2Opacity },
                { y: bg3Y, opacity: mist3Opacity },
            ].map(({ y, opacity }, i) => (
                <motion.div
                    key={i}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 5,
                        pointerEvents: 'none',
                        y,
                        opacity,
                    }}
                >
                    <div style={{
                        position: 'absolute', inset: '-10%',
                        backgroundImage: `url(${overlayMist2})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }} />
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
                        width: '380px', zIndex: 100,
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
