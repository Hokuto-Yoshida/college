import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgPath1 from '../assets/intro_new_1.png';
import imgPath2 from '../assets/intro_new_2.jpg';
import imgPath3 from '../assets/intro_new_3.jpg';
import introOpening from '../assets/intro_opening.png';

// 上下の端をぼかすマスク
const MASK = 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)';

export const IntroSequence = ({ onEnter }) => {
    // useScroll()内部のscrollYProgressと、マウント判定に使うscroll値がズレて
    // 「マウントはされているのにopacityは0のまま」というズレが起きていたため、
    // 両方を同じ手動計算のprogress値から駆動する（ズレようがない構成にする）
    const scrollYProgress = useMotionValue(0);

    // スクロール終盤でボタン表示（scrollイベント直読みで確実に）
    const [buttonVisible, setButtonVisible] = useState(false);

    // 各背景/画像/白幕レイヤーを、自分のサイクルが終わったら完全にDOMから外す（opacityだけに頼らず確実に消す）
    const [bg0On, setBg0On] = useState(true);
    const [bg1On, setBg1On] = useState(false);
    const [bg2On, setBg2On] = useState(false);
    const [open0On, setOpen0On] = useState(true);
    const [open1On, setOpen1On] = useState(false);
    const [open2On, setOpen2On] = useState(false);
    const [veil0On, setVeil0On] = useState(true);
    const [veil1On, setVeil1On] = useState(false);
    const [veil2On, setVeil2On] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const progress = max > 0 ? window.scrollY / max : 0;
            scrollYProgress.set(progress);
            setButtonVisible(progress >= 0.93);

            setBg0On(progress < 0.42);
            setBg1On(progress >= 0.30 && progress < 0.75);
            setBg2On(progress >= 0.63);
            setOpen0On(progress < 0.42);
            setOpen1On(progress >= 0.38 && progress < 0.75);
            setOpen2On(progress >= 0.71);
            setVeil0On(progress < 0.33);
            setVeil1On(progress >= 0.44 && progress < 0.65);
            setVeil2On(progress >= 0.77 && progress < 0.95);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // ── 3サイクル均等設計 ─────────────────────────────────────────
    // 各サイクル: 背景だけ → 画像挿入 → レイヤー＋テキスト → レイヤー消す → 背景と一緒に画像退場
    // bg0: 0-0.33, bg1: 0.33-0.66, bg2: 0.66-1.00 (トランジション 0.06)
    // 背景同士は同じ位置に重ねたままopacityでじわっとクロスフェード（6階の背景切り替えと同じ方式）
    const bg0Opacity = useTransform(scrollYProgress, [0, 0.33, 0.39], [1, 1, 0]);
    const bg1Opacity = useTransform(scrollYProgress, [0.33, 0.39, 0.66, 0.72], [0, 1, 1, 0]);
    const bg2Opacity = useTransform(scrollYProgress, [0.66, 0.72], [0, 1]);

    // ── opening image: 下からスライドイン、退場は背景クロスフェードに合わせてぼんやりフェードアウト ──
    // （スライドで退場すると境界線が目立つため、背景が変わるタイミングと同じ範囲でopacity+blurのみで消す）
    const open0Y = useTransform(scrollYProgress, [0.04, 0.09], ['100%', '0%']);
    const open1Y = useTransform(scrollYProgress, [0.41, 0.46], ['100%', '0%']);
    const open2Y = useTransform(scrollYProgress, [0.74, 0.79], ['100%', '0%']);

    const open0Opacity = useTransform(scrollYProgress, [0.33, 0.39], [1, 0]);
    const open1Opacity = useTransform(scrollYProgress, [0.66, 0.72], [1, 0]);
    const open0Blur = useTransform(scrollYProgress, [0.33, 0.39], ['blur(0px)', 'blur(16px)']);
    const open1Blur = useTransform(scrollYProgress, [0.66, 0.72], ['blur(0px)', 'blur(16px)']);

    // ── 白幕: 画像の後にスライドイン ─────────────────────────────
    const veil0Y = useTransform(scrollYProgress, [0.11, 0.14, 0.27, 0.31], ['100%', '0%', '0%', '-100%']);
    const veil1Y = useTransform(scrollYProgress, [0.46, 0.49, 0.59, 0.63], ['100%', '0%', '0%', '-100%']);
    const veil2Y = useTransform(scrollYProgress, [0.79, 0.82, 0.89, 0.93], ['100%', '0%', '0%', '-100%']);

    // ── 白幕（靄）: 退場時にボヤっとフェード＋ぼかしながら消える（背景クロスフェードに合わせる試験実装） ──
    const veil0Opacity = useTransform(scrollYProgress, [0.27, 0.31], [1, 0]);
    const veil1Opacity = useTransform(scrollYProgress, [0.59, 0.63], [1, 0]);
    const veil2Opacity = useTransform(scrollYProgress, [0.89, 0.93], [1, 0]);
    const veil0Blur = useTransform(scrollYProgress, [0.27, 0.31], ['blur(0px)', 'blur(16px)']);
    const veil1Blur = useTransform(scrollYProgress, [0.59, 0.63], ['blur(0px)', 'blur(16px)']);
    const veil2Blur = useTransform(scrollYProgress, [0.89, 0.93], ['blur(0px)', 'blur(16px)']);

    // ── テキスト: 各白幕内でスクロール ───────────────────────────
    // 白幕1: 2テキスト
    const t0Y = useTransform(scrollYProgress, [0.14, 0.16, 0.19, 0.21], ['60vh', '0vh', '0vh', '-60vh']);
    const t1Y = useTransform(scrollYProgress, [0.21, 0.23, 0.25, 0.27], ['60vh', '0vh', '0vh', '-60vh']);
    // 白幕2: 1テキスト
    const t2Y = useTransform(scrollYProgress, [0.49, 0.52, 0.56, 0.59], ['60vh', '0vh', '0vh', '-60vh']);
    // 白幕3: 1テキスト
    const t3Y = useTransform(scrollYProgress, [0.82, 0.84, 0.87, 0.89], ['60vh', '0vh', '0vh', '-60vh']);

    // ── スタイル ──────────────────────────────────────────────────
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
            items: [
                {
                    y: t0Y,
                    node: (
                        <div style={textStyle}>
                            <p style={ln}>この大学はその心の階層を、7つの建物で表現しています。</p>
                            <p style={ln}>「心の視点を引き上げる」ための"学び"の場と空間が各建物で繰り広げられています。</p>
                            <p style={ln}>自由自在に行ったり来たりを楽しみながら</p>
                            <p style={{ ...ln, paddingBottom: 0 }}>素直にあなた自身の感じるままに─</p>
                        </div>
                    ),
                },
                {
                    y: t1Y,
                    node: (
                        <div style={textStyle}>
                            <p style={{ ...ln, fontWeight: 'bold', color: '#222' }}>「誰かのために貢献したい」</p>
                            <p style={ln}>そう思う人々が世界に溢れることー</p>
                            <p style={ln}>マインド大学は、「学び」を学ぶ"場と空間"を創り出しています。</p>
                            <p style={ln}>学び続けるプロセスは多くの人にとって、勇気や希望となります。</p>
                            <p style={{ ...ln, paddingBottom: 0 }}>訪れる人の潜在的な心の力を引き出し、未来の希望を創り出す人財を育成していきます。</p>
                        </div>
                    ),
                },
            ],
        },
        {
            veilY: veil1Y,
            veilOpacity: veil1Opacity,
            veilBlur: veil1Blur,
            on: veil1On,
            items: [
                {
                    y: t2Y,
                    node: (
                        <div style={textStyle}>
                            <p style={{ ...ln, fontWeight: 'bold', color: '#222' }}>人はすでに何かを持っている</p>
                            <p style={ln}>人は、生まれ持った何かを持っています。</p>
                            <p style={ln}>それはまだ言葉になっていない可能性</p>
                            <p style={ln}>まだ形になっていない方向</p>
                            <p style={{ ...ln, paddingBottom: 0 }}>人の心の奥には、その人らしい可能性がすでに存在しています。</p>
                        </div>
                    ),
                },
            ],
        },
        {
            veilY: veil2Y,
            veilOpacity: veil2Opacity,
            veilBlur: veil2Blur,
            on: veil2On,
            items: [
                {
                    y: t3Y,
                    node: (
                        <div style={textStyle}>
                            <p style={{ ...ln, fontWeight: 'bold', color: '#222' }}>その人らしさが現れるとき</p>
                            <p style={ln}>人は自分らしさと繋がるとき自然に動き始めます。</p>
                            <p style={ln}>努力して変わるのではなく、気づいたら変わっていたという形で変化が起こります。</p>
                            <p style={{ ...ln, paddingBottom: 0 }}>それは外から与えられた変化ではなく、内側から生まれる変化だからです。</p>
                        </div>
                    ),
                },
            ],
        },
    ];

    return (
        <div style={{ background: '#000', minHeight: '700vh', position: 'relative' }}>

            {/* ── 背景レイヤー ── */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden' }}>
                {[
                    { opacity: bg0Opacity, on: bg0On },
                    { opacity: bg1Opacity, on: bg1On },
                    { opacity: bg2Opacity, on: bg2On },
                ].map((bg, i) => bg.on && (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute', inset: 0,
                            backgroundImage: `url(${[imgPath1, imgPath2, imgPath3][i]})`,
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
                { y: open2Y, on: open2On },
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

            {/* ── 大学ルームに入るボタン（最後に表示） ── */}
            {buttonVisible && (
                <div style={{
                    position: 'fixed', bottom: '10vh', left: 0, right: 0,
                    display: 'flex', justifyContent: 'center', zIndex: 30,
                }}>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
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
                            gap: '12px',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        大学ルームに入る <ArrowRight />
                    </motion.button>
                </div>
            )}
        </div>
    );
};
