import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgPath1 from '../assets/intro_new_1.png';
import imgPath2 from '../assets/intro_new_2.jpg';
import imgPath3 from '../assets/intro_new_3.jpg';
import overlayImg from '../assets/overlay_center.png';

const bgImages = [imgPath1, imgPath2, imgPath3];

export const IntroSequence = ({ onEnter }) => {
    const { scrollYProgress } = useScroll();

    // 背景: Layer3が在中している時（頂点）に切り替え
    // cycle1: 0.185-0.210, cycle2: 0.485-0.510
    const opacity0 = useTransform(scrollYProgress, [0, 0.185, 0.210], [1, 1, 0]);
    const opacity1 = useTransform(scrollYProgress, [0.185, 0.210, 0.485, 0.510], [0, 1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.485, 0.510, 1.0], [0, 1, 1]);
    const opacities = [opacity0, opacity1, opacity2];

    // 0→1→2→3→2→1→0 を3サイクル繰り返し、最後に0→1で終わる
    // 各サイクル幅0.300、サイクル内の構成:
    //   0.000-0.030: 0→1 (Layer1入場)
    //   0.040-0.070: 1→2 (Layer2入場)
    //   0.070-0.160: Layer2状態【テキスト表示】
    //   0.160-0.185: 2→3 (Layer3入場)
    //   0.185-0.205: Layer3状態
    //   0.205-0.230: 3→2 (Layer3退場)
    //   0.230-0.260: 2→1 (Layer2退場・テキストなし)
    //   0.260-0.285: 1→0 (Layer1退場)
    //   0.285-0.300: Layer0状態【背景切り替え】

    // Layer1: 各サイクルで最初に入場・最後に退場（最終サイクル後は再入場しない）
    const layer1Y = useTransform(scrollYProgress,
        [0.000, 0.030,  0.260, 0.285, 0.286, 0.300, 0.330,  0.560, 0.585, 0.586, 0.600, 0.630,  0.860, 0.885,  1.000],
        ['100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // Layer2: 各サイクルでLayer1の後に入場、Layer3より先に退場
    const layer2Y = useTransform(scrollYProgress,
        [0.000, 0.040, 0.070,  0.230, 0.260, 0.261, 0.340, 0.370,  0.530, 0.560, 0.561, 0.640, 0.670,  0.830, 0.860,  1.000],
        ['100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // オーバーレイ画像: 0→1の入場に合わせて表示、Layer0に戻るとフェードアウト
    // 各サイクルで繰り返す（cycle1: 0.000-0.285, cycle2: 0.300-0.585, cycle3: 0.600-0.885）
    const overlayOpacity = useTransform(scrollYProgress,
        [0.000, 0.030,  0.260, 0.285,  0.300, 0.330,  0.560, 0.585,  0.600, 0.630,  0.860, 0.885,  1.000],
        [0,     1,      1,     0,       0,     1,      1,     0,       0,     1,      1,     0,       0]
    );

    // Layer3: 各サイクルの頂点で入退場
    const layer3Y = useTransform(scrollYProgress,
        [0.000, 0.160, 0.185,  0.205, 0.230, 0.231, 0.460, 0.485,  0.505, 0.530, 0.531, 0.760, 0.785,  0.805, 0.830,  1.000],
        ['100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%', '100%', '100%', '0%',  '0%', '-100%',  '-100%']
    );

    // テキスト: 上昇フェーズのLayer2窓のみ表示（下降時はなし）
    // サイクル1(bg0) Layer2窓: 0.070-0.160 → text1 + text2
    const text1Y = useTransform(scrollYProgress,
        [0.070, 0.071, 0.112, 0.113],
        ['250vh', '100vh', '-60vh', '-250vh']
    );
    const text2Y = useTransform(scrollYProgress,
        [0.110, 0.111, 0.158, 0.159],
        ['250vh', '100vh', '-90vh', '-250vh']
    );
    // サイクル2(bg1) Layer2窓: 0.370-0.460 → text3
    const text3Y = useTransform(scrollYProgress,
        [0.370, 0.371, 0.455, 0.456],
        ['250vh', '100vh', '-85vh', '-250vh']
    );
    // サイクル3(bg2) Layer2窓: 0.670-0.760 → text4
    const text4Y = useTransform(scrollYProgress,
        [0.670, 0.671, 0.755, 0.756],
        ['250vh', '100vh', '-75vh', '-250vh']
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
            lines: [
                'この大学はその心の階層を、7つの建物で表現しています。',
                '「心の視点を引き上げる」ための"学び"の場と空間が各建物で繰り広げられています。',
                '自由自在に行ったり来たりを楽しみながら',
                '素直にあなた自身の感じるままに─'
            ]
        },
        {
            y: text2Y,
            lines: [
                '「誰かのために貢献したい」',
                'そう思う人々が世界に溢れることー',
                'マインド大学は、「学び」を学ぶ"場と空間"を創り出しています。',
                '学び続けるプロセスは多くの人にとって、勇気や希望となります。',
                '自らの"心の力"を最大限に発揮できる、',
                '「マインドの法則」をベースとした、',
                '「本質的な」学びの"場"を通して、',
                '訪れる人の潜在的な心の力を引き出し',
                '未来の希望を創り出す人財を育成していきます。'
            ]
        },
        {
            y: text3Y,
            lines: [
                '大学で学べる事',
                '人はすでに何かを持っている',
                '人は、生まれ持った何かを持っています。',
                'それはまだ言葉になっていない可能性',
                'まだ形になっていない方向',
                'まだ気づいていない力です。',
                '人の心の奥には、',
                'その人らしい可能性がすでに存在しています。'
            ]
        },
        {
            y: text4Y,
            lines: [
                'その人らしさが現れるとき',
                '人は自分らしさと繋がるとき',
                '自然に動き始めます。',
                '努力して変わるのではなく',
                '気づいたら変わっていたという形で変化が起こります。',
                'それは外から与えられた変化ではなく',
                '内側から生まれる変化だからです。'
            ]
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

            {/* オーバーレイ画像: 背景とレイヤーの間、レイヤーがある間うっすら表示 */}
            <motion.div style={{
                position: 'fixed', inset: 0,
                backgroundImage: `url(${overlayImg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: overlayOpacity,
                zIndex: 5,
                pointerEvents: 'none',
            }} />

            {/* Layer 1 */}
            <motion.div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(255, 255, 255, 0.5)',
                pointerEvents: 'none',
                y: layer1Y,
                zIndex: 10,
                maskImage: 'linear-gradient(to bottom, transparent 0%, white 3%, white 97%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 3%, white 97%, transparent 100%)',
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
                    maskImage: 'linear-gradient(to bottom, transparent 0%, white 3%, white 97%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 3%, white 97%, transparent 100%)',
                }}>
                    {texts.map((item, idx) => (
                        <motion.div key={idx} style={{
                            position: 'absolute', left: 0, right: 0,
                            display: 'flex', justifyContent: 'center',
                            y: item.y
                        }}>
                            <div style={textStyle}>
                                {item.lines.map((line, lIdx) => (
                                    <p key={lIdx} style={lineStyle}>{line}</p>
                                ))}
                            </div>
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
                    maskImage: 'linear-gradient(to bottom, transparent 0%, white 3%, white 97%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, white 3%, white 97%, transparent 100%)',
                }} />
            </div>

            {/* スクロール量維持用スペーサー */}
            <div style={{ position: 'relative', zIndex: 20, paddingTop: '400vh', paddingBottom: '40vh' }}>
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />
                <div style={{ minHeight: '240vh', marginBottom: '200vh' }} />

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40vh' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--floor-4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        style={{
                            padding: '16px 48px',
                            borderRadius: '40px',
                            background: 'var(--floor-4)',
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
                        大学ルームに入る <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
