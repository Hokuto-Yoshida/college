import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { SpiralNav } from './SpiralNav';

import imgPath1 from '../assets/intro_bg_1.png';
import imgPath2 from '../assets/intro_bg_2.png';
import imgPath3 from '../assets/intro_bg_3.png';
import imgPath4 from '../assets/intro_bg_4.png';
import introOpening from '../assets/intro_opening.png';

// 上下の端をぼかすマスク
const MASK = 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)';

export const MainBuildingIntro = ({ onEnter, floors = [], onSelectFloor }) => {
    // useScroll()内部のscrollYProgressとマウント判定用のscroll値がズレると
    // 「マウントはされているのにopacityは0のまま」になるため、両方を同じ手動計算の
    // progress値から駆動する（イントロ画面と同じ方式）
    const scrollYProgress = useMotionValue(0);
    const [showElevator, setShowElevator] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);

    // 各背景/画像/白幕レイヤーを、自分のサイクルが終わったら完全にDOMから外す（opacityだけに頼らず確実に消す）
    const [bg0On, setBg0On] = useState(true);
    const [bg1On, setBg1On] = useState(false);
    const [bg2On, setBg2On] = useState(false);
    const [bg3On, setBg3On] = useState(false);
    const [open0On, setOpen0On] = useState(true);
    const [open1On, setOpen1On] = useState(false);
    const [open2On, setOpen2On] = useState(false);
    const [open3On, setOpen3On] = useState(false);
    const [veil0On, setVeil0On] = useState(true);
    const [veil1On, setVeil1On] = useState(false);
    const [veil2On, setVeil2On] = useState(false);
    const [veil3On, setVeil3On] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max > 0 ? window.scrollY / max : 0;
            scrollYProgress.set(progress);
            setButtonVisible(progress >= 0.97);

            setBg0On(progress < 0.33);
            setBg1On(progress >= 0.23 && progress < 0.58);
            setBg2On(progress >= 0.48 && progress < 0.83);
            setBg3On(progress >= 0.73);
            setOpen0On(progress < 0.33);
            setOpen1On(progress >= 0.30 && progress < 0.58);
            setOpen2On(progress >= 0.55 && progress < 0.83);
            setOpen3On(progress >= 0.80);
            setVeil0On(progress < 0.24);
            setVeil1On(progress >= 0.35 && progress < 0.50);
            setVeil2On(progress >= 0.60 && progress < 0.75);
            setVeil3On(progress >= 0.85 && progress < 0.99);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── 4サイクル均等設計 ─────────────────────────────────────────
    // 各サイクル: 背景だけ → 画像挿入 → レイヤー＋テキスト → レイヤー消す → 背景と一緒に画像退場
    // bg0: 0-0.25, bg1: 0.25-0.50, bg2: 0.50-0.75, bg3: 0.75-1.00 (トランジション 0.06)
    // 背景同士は同じ位置に重ねたままopacityでじわっとクロスフェード
    const bg0Opacity = useTransform(scrollYProgress, [0, 0.25, 0.31], [1, 1, 0]);
    const bg1Opacity = useTransform(scrollYProgress, [0.25, 0.31, 0.50, 0.56], [0, 1, 1, 0]);
    const bg2Opacity = useTransform(scrollYProgress, [0.50, 0.56, 0.75, 0.81], [0, 1, 1, 0]);
    const bg3Opacity = useTransform(scrollYProgress, [0.75, 0.81], [0, 1]);

    // ── opening image: 下からスライドイン、退場は背景クロスフェードに合わせてぼんやりフェードアウト ──
    const open0Y = useTransform(scrollYProgress, [0.03, 0.07], ['100%', '0%']);
    const open1Y = useTransform(scrollYProgress, [0.32, 0.36], ['100%', '0%']);
    const open2Y = useTransform(scrollYProgress, [0.57, 0.61], ['100%', '0%']);
    const open3Y = useTransform(scrollYProgress, [0.82, 0.86], ['100%', '0%']);

    const open0Opacity = useTransform(scrollYProgress, [0.25, 0.31], [1, 0]);
    const open1Opacity = useTransform(scrollYProgress, [0.50, 0.56], [1, 0]);
    const open2Opacity = useTransform(scrollYProgress, [0.75, 0.81], [1, 0]);
    const open0Blur = useTransform(scrollYProgress, [0.25, 0.31], ['blur(0px)', 'blur(16px)']);
    const open1Blur = useTransform(scrollYProgress, [0.50, 0.56], ['blur(0px)', 'blur(16px)']);
    const open2Blur = useTransform(scrollYProgress, [0.75, 0.81], ['blur(0px)', 'blur(16px)']);

    // ── 白幕: 画像の後にスライドイン ─────────────────────────────
    const veil0Y = useTransform(scrollYProgress, [0.08, 0.11, 0.19, 0.22], ['100%', '0%', '0%', '-100%']);
    const veil1Y = useTransform(scrollYProgress, [0.37, 0.40, 0.45, 0.48], ['100%', '0%', '0%', '-100%']);
    const veil2Y = useTransform(scrollYProgress, [0.62, 0.65, 0.70, 0.73], ['100%', '0%', '0%', '-100%']);
    const veil3Y = useTransform(scrollYProgress, [0.87, 0.90, 0.94, 0.97], ['100%', '0%', '0%', '-100%']);

    // ── 白幕（靄）: 退場時にボヤっとフェード＋ぼかしながら消える ──
    const veil0Opacity = useTransform(scrollYProgress, [0.19, 0.22], [1, 0]);
    const veil1Opacity = useTransform(scrollYProgress, [0.45, 0.48], [1, 0]);
    const veil2Opacity = useTransform(scrollYProgress, [0.70, 0.73], [1, 0]);
    const veil3Opacity = useTransform(scrollYProgress, [0.94, 0.97], [1, 0]);
    const veil0Blur = useTransform(scrollYProgress, [0.19, 0.22], ['blur(0px)', 'blur(16px)']);
    const veil1Blur = useTransform(scrollYProgress, [0.45, 0.48], ['blur(0px)', 'blur(16px)']);
    const veil2Blur = useTransform(scrollYProgress, [0.70, 0.73], ['blur(0px)', 'blur(16px)']);
    const veil3Blur = useTransform(scrollYProgress, [0.94, 0.97], ['blur(0px)', 'blur(16px)']);

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
            veilOpacity: veil0Opacity,
            veilBlur: veil0Blur,
            on: veil0On,
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
            veilOpacity: veil1Opacity,
            veilBlur: veil1Blur,
            on: veil1On,
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
            veilOpacity: veil2Opacity,
            veilBlur: veil2Blur,
            on: veil2On,
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
            veilOpacity: veil3Opacity,
            veilBlur: veil3Blur,
            on: veil3On,
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
                {[
                    { opacity: bg0Opacity, on: bg0On },
                    { opacity: bg1Opacity, on: bg1On },
                    { opacity: bg2Opacity, on: bg2On },
                    { opacity: bg3Opacity, on: bg3On },
                ].map((bg, i) => bg.on && (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${[imgPath1, imgPath2, imgPath3, imgPath4][i]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: bg.opacity,
                        }}
                    />
                ))}
            </div>

            {/* ── opening image: 下からスライドイン、退場は背景クロスフェードに合わせてぼんやりフェードアウト（2枚重ね） ── */}
            {[
                { y: open0Y, opacity: open0Opacity, blur: open0Blur, on: open0On },
                { y: open1Y, opacity: open1Opacity, blur: open1Blur, on: open1On },
                { y: open2Y, opacity: open2Opacity, blur: open2Blur, on: open2On },
                { y: open3Y, on: open3On },
            ].map((layer, i) => layer.on && (
                <motion.div
                    key={i}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 3,
                        pointerEvents: 'none',
                        y: layer.y,
                        opacity: layer.opacity,
                        filter: layer.blur,
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
            {sections.map((section, si) => section.on && (
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
                            opacity: section.veilOpacity,
                            filter: section.veilBlur,
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
