import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgPath1 from '../assets/intro_bg_1.png';
import imgPath2 from '../assets/intro_bg_2.png';
import imgPath3 from '../assets/intro_bg_3.png';
import imgPath4 from '../assets/intro_bg_4.png';

const bgImages = [imgPath1, imgPath2, imgPath3, imgPath4];

export const MainBuildingIntro = ({ onEnter }) => {
    const { scrollYProgress } = useScroll();

    // 背景: レイヤーが退場するタイミングで切り替わる
    const opacity0 = useTransform(scrollYProgress, [0, 0.215, 0.248], [1, 1, 0]);
    const opacity1 = useTransform(scrollYProgress, [0.215, 0.248, 0.460, 0.498], [0, 1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.460, 0.498, 0.705, 0.748], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.705, 0.748, 1.0], [0, 1, 1]);
    const opacities = [opacity0, opacity1, opacity2, opacity3];

    // Layer 1: 先に入って最後に出る（4サイクル）
    const layer1Y = useTransform(scrollYProgress,
        [0.000, 0.040, 0.215, 0.248,
         0.249, 0.280, 0.320, 0.460, 0.498,
         0.499, 0.530, 0.570, 0.705, 0.748,
         0.749, 0.780, 0.820, 0.955, 0.985, 1.000],
        ['100%', '0%', '0%', '-100%',
         '100%', '100%', '0%', '0%', '-100%',
         '100%', '100%', '0%', '0%', '-100%',
         '100%', '100%', '0%', '0%', '-100%', '-100%']
    );

    // Layer 2: 少し遅れて入って先に出る（4サイクル）
    const layer2Y = useTransform(scrollYProgress,
        [0.000, 0.080, 0.125, 0.215, 0.248,
         0.249, 0.365, 0.405, 0.460, 0.498,
         0.499, 0.610, 0.650, 0.705, 0.748,
         0.749, 0.860, 0.900, 0.955, 0.985, 1.000],
        ['100%', '100%', '0%', '0%', '-100%',
         '100%', '100%', '0%', '0%', '-100%',
         '100%', '100%', '0%', '0%', '-100%',
         '100%', '100%', '0%', '0%', '-100%', '-100%']
    );

    // テキスト: 非アクティブ時は ±250vh に退避（layer2 が動いても絶対見えない距離）
    // アクティブ直前に 100vh へジャンプ→スクロールで流れる→直後に -250vh へ退避
    const text1Y = useTransform(scrollYProgress,
        [0.129, 0.130, 0.208, 0.209],
        ['250vh', '100vh', '-60vh', '-250vh']
    );
    const text2Y = useTransform(scrollYProgress,
        [0.407, 0.408, 0.455, 0.456],
        ['250vh', '100vh', '-80vh', '-250vh']
    );
    const text3Y = useTransform(scrollYProgress,
        [0.652, 0.653, 0.700, 0.701],
        ['250vh', '100vh', '-70vh', '-250vh']
    );
    const text4Y = useTransform(scrollYProgress,
        [0.902, 0.903, 0.950, 0.951],
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

    const texts = [
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

            {/* Layer 1 */}
            <motion.div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
                y: layer1Y,
                zIndex: 10
            }} />

            {/* Layer 2 + テキスト（セット）: overflow は静的な外枠で処理 */}
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

            {/* スクロール量維持用スペーサー */}
            <div style={{ position: 'relative', zIndex: 20, paddingTop: '400vh', paddingBottom: '40vh' }}>
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40vh' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--floor-1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        style={{
                            padding: '16px 48px',
                            borderRadius: '40px',
                            background: 'var(--floor-1)',
                            color: '#000',
                            border: 'none',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'box-shadow 0.3s ease'
                        }}
                    >
                        本館に入る <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
