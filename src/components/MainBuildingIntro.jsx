import React, { useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { SpiralNav } from './SpiralNav';

import imgPath1 from '../assets/intro_bg_1.png';
import imgPath2 from '../assets/intro_bg_2.png';
import imgPath3 from '../assets/intro_bg_3.png';
import imgPath4 from '../assets/intro_bg_4.png';
import overlayMist2 from '../assets/overlay_mist2.png';

const bgImages = [imgPath1, imgPath2, imgPath3, imgPath4];

const MASK = 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.75) 35%, #000 50%, #000 50%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0.08) 92%, transparent 100%)';

export const MainBuildingIntro = ({ onEnter, floors = [], onSelectFloor }) => {
    const { scrollYProgress } = useScroll();

    const [showElevator, setShowElevator] = useState(false);
    const [buttonVisible, setButtonVisible] = useState(false);
    useMotionValueEvent(scrollYProgress, 'change', (v) => {
        setButtonVisible(v >= 0.88);
    });

    // 背景: Layer3頂点タイミングで切り替え（4枚 → 3サイクル分 + 最終）
    // cycle1→2: 0.185-0.210, cycle2→3: 0.485-0.510, cycle3→final: 0.785-0.810
    const opacity0 = useTransform(scrollYProgress, [0, 0.185, 0.210], [1, 1, 0]);
    const opacity1 = useTransform(scrollYProgress, [0.185, 0.210, 0.485, 0.510], [0, 1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.485, 0.510, 0.785, 0.810], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.785, 0.810, 1.0], [0, 1, 1]);
    const opacities = [opacity0, opacity1, opacity2, opacity3];

    // IntroSequenceと同じ 0→1→2→3→2→1→0 を3サイクル繰り返し
    // 各サイクル幅0.300

    // 靄画像: レイヤーより早くスクロールで出入り
    const mistY = useTransform(scrollYProgress,
        [0.000, 0.010,  0.260, 0.280, 0.281, 0.290,  0.560, 0.580, 0.581, 0.590,  0.860, 0.880,  1.000],
        ['100%', '0%',  '0%', '-100%', '100%', '0%',  '0%', '-100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // Layer1: 各サイクルで最初に入場・最後に退場
    const layer1Y = useTransform(scrollYProgress,
        [0.000, 0.030,  0.260, 0.285, 0.286, 0.300, 0.330,  0.560, 0.585, 0.586, 0.600, 0.630,  0.860, 0.885,  1.000],
        ['100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // Layer2: Layer1の後に入場、Layer3より先に退場
    const layer2Y = useTransform(scrollYProgress,
        [0.000, 0.040, 0.070,  0.230, 0.260, 0.261, 0.340, 0.370,  0.530, 0.560, 0.561, 0.640, 0.670,  0.830, 0.860,  1.000],
        ['100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // Layer3: 各サイクルの頂点で入退場
    const layer3Y = useTransform(scrollYProgress,
        [0.000, 0.160, 0.185,  0.205, 0.230, 0.231, 0.460, 0.485,  0.505, 0.530, 0.531, 0.760, 0.785,  0.805, 0.830,  1.000],
        ['100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // テキスト: 上昇フェーズのLayer2窓のみ表示
    // サイクル1 Layer2窓(0.070-0.160): title + text1 + text2
    const text0Y = useTransform(scrollYProgress,
        [0.070, 0.071, 0.096, 0.097],
        ['250vh', '100vh', '-50vh', '-250vh']
    );
    const text1Y = useTransform(scrollYProgress,
        [0.094, 0.095, 0.124, 0.125],
        ['250vh', '100vh', '-60vh', '-250vh']
    );
    const text2Y = useTransform(scrollYProgress,
        [0.122, 0.123, 0.158, 0.159],
        ['250vh', '100vh', '-80vh', '-250vh']
    );
    // サイクル2 Layer2窓(0.370-0.460): text3
    const text3Y = useTransform(scrollYProgress,
        [0.370, 0.371, 0.455, 0.456],
        ['250vh', '100vh', '-70vh', '-250vh']
    );
    // サイクル3 Layer2窓(0.670-0.760): text4
    const text4Y = useTransform(scrollYProgress,
        [0.670, 0.671, 0.755, 0.756],
        ['250vh', '100vh', '-70vh', '-250vh']
    );

    const textStyle = {
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.95rem)',
        color: '#666666',
        fontFamily: 'var(--font-jp)',
        letterSpacing: '0.1em',
        padding: '0 20px'
    };

    const lineStyle = { margin: 0, paddingBottom: '3rem', lineHeight: 4.0 };

    const titleStyle = {
        maxWidth: '800px',
        width: '100%',
        textAlign: 'center',
        fontFamily: 'var(--font-jp)',
        letterSpacing: '0.15em',
        padding: '0 20px'
    };

    const texts = [
        {
            y: text0Y,
            content: (
                <div style={titleStyle}>
                    <p style={{ margin: 0, paddingBottom: '1.2rem', lineHeight: 2.0, fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 'bold', color: '#333' }}>本館</p>
                    <p style={{ margin: 0, paddingBottom: '1.5rem', lineHeight: 2.0, fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#888', fontFamily: 'var(--font-en)', letterSpacing: '0.3em' }}>Entrance</p>
                    <p style={{ margin: 0, lineHeight: 2.5, fontSize: 'clamp(0.7rem, 1.5vw, 0.95rem)', color: '#666' }}>心の階層を7階建ての建物で表現。感性と論理を統合するメインキャンパス。</p>
                </div>
            )
        },
        {
            y: text1Y,
            content: (
                <>
                    <p style={lineStyle}>この大学はその心の階層を、7つの建物で表現しています。</p>
                    <p style={lineStyle}>「心の視点を引き上げる」ための"学び"の場と空間が各建物で繰り広げられています。</p>
                    <p style={lineStyle}>自由自在に行ったり来たりを楽しみながら</p>
                    <p style={lineStyle}>素直にあなた自身の感じるままに─</p>
                </>
            )
        },
        {
            y: text2Y,
            content: (
                <>
                    <p style={{ ...lineStyle, fontWeight: 'bold' }}>「誰かのために貢献したい」</p>
                    <p style={lineStyle}>そう思う人々が世界に溢れることー</p>
                    <p style={lineStyle}>マインド大学は、「学び」を学ぶ"場と空間"を創り出しています。</p>
                    <p style={lineStyle}>学び続けるプロセスは多くの人にとって、勇気や希望となります。</p>
                    <p style={lineStyle}>自らの"心の力"を最大限に発揮できる、</p>
                    <p style={lineStyle}>「マインドの法則」をベースとした、「本質的な」学びの"場"を通して、</p>
                    <p style={lineStyle}>訪れる人の潜在的な心の力を引き出し</p>
                    <p style={lineStyle}>未来の希望を創り出す人財を育成していきます。</p>
                </>
            )
        },
        {
            y: text3Y,
            content: (
                <>
                    <p style={{ ...lineStyle, fontWeight: 'bold' }}>大学で学べる事</p>
                    <p style={{ ...lineStyle, fontWeight: 'bold' }}>人はすでに何かを持っている</p>
                    <p style={lineStyle}>人は、生まれ持った何かを持っています。</p>
                    <p style={lineStyle}>それはまだ言葉になっていない可能性</p>
                    <p style={lineStyle}>まだ形になっていない方向</p>
                    <p style={lineStyle}>まだ気づいていない力です。</p>
                    <p style={lineStyle}>人の心の奥には、その人らしい可能性がすでに存在しています。</p>
                </>
            )
        },
        {
            y: text4Y,
            content: (
                <>
                    <p style={{ ...lineStyle, fontWeight: 'bold' }}>その人らしさが現れるとき</p>
                    <p style={lineStyle}>人は自分らしさと繋がるとき自然に動き始めます。</p>
                    <p style={lineStyle}>努力して変わるのではなく</p>
                    <p style={lineStyle}>気づいたら変わっていたという形で</p>
                    <p style={lineStyle}>変化が起こります。</p>
                    <p style={lineStyle}>それは外から与えられた変化ではなく</p>
                    <p style={lineStyle}>内側から生まれる変化だからです。</p>
                </>
            )
        }
    ];

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* 背景画像 */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                {bgImages.map((img, idx) => (
                    <motion.div key={idx} style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: `url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        opacity: opacities[idx],
                    }} />
                ))}
            </div>

            {/* 靄画像: スクロールでスライドイン（レイヤーより早い） */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 5, pointerEvents: 'none' }}>
                <motion.div style={{ position: 'absolute', inset: 0, y: mistY, maskImage: MASK, WebkitMaskImage: MASK }}>
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${overlayMist2})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${overlayMist2})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                </motion.div>
            </div>

            {/* Layer 1 */}
            <motion.div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
                y: layer1Y,
                zIndex: 10,
                maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.75) 35%, #000 50%, #000 50%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0.08) 92%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.08) 8%, rgba(0,0,0,0.2) 15%, rgba(0,0,0,0.45) 25%, rgba(0,0,0,0.75) 35%, #000 50%, #000 50%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.45) 75%, rgba(0,0,0,0.2) 85%, rgba(0,0,0,0.08) 92%, transparent 100%)',
            }} />

            {/* Layer 2 + テキスト */}
            <div style={{
                position: 'fixed', inset: 0,
                overflow: 'hidden',
                zIndex: 11,
                pointerEvents: 'none'
            }}>
                <motion.div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255, 255, 255, 0.45)',
                    y: layer2Y,
                    maskImage: MASK, WebkitMaskImage: MASK,
                }}>
                    {texts.map((item, idx) => (
                        <motion.div key={idx} style={{
                            position: 'absolute', left: 0, right: 0,
                            display: 'flex', justifyContent: 'center',
                            y: item.y
                        }}>
                            <div style={textStyle}>{item.content}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Layer 3 */}
            <div style={{
                position: 'fixed', inset: 0,
                overflow: 'hidden',
                zIndex: 12,
                pointerEvents: 'none'
            }}>
                <motion.div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255, 255, 255, 0.8)',
                    y: layer3Y,
                    maskImage: MASK, WebkitMaskImage: MASK,
                }} />
            </div>

            {/* スクロール量維持用スペーサー */}
            <div style={{ position: 'relative', zIndex: 20, paddingTop: '400vh', paddingBottom: '40vh' }}>
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />

                <div style={{ marginTop: '40vh' }} />
            </div>

            {/* 固定エレベーターボタン（最終背景時に表示） */}
            {buttonVisible && (
                <div style={{
                    position: 'fixed',
                    bottom: '10vh',
                    left: 0, right: 0,
                    display: 'flex',
                    justifyContent: 'center',
                    zIndex: 30,
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

            {/* エレベーターパネル（右側スライドイン・SpiralNav） */}
            {showElevator && (
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                        position: 'fixed', top: 0, right: 0, bottom: 0,
                        width: '380px',
                        zIndex: 100,
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
