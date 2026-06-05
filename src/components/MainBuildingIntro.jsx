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

    // スクロールに応じた4枚の画像の不透明度マッピング
    // テキストが画面中央に来るタイミング(約 0, 0.26, 0.54, 0.81)に合わせて背景を切り替える
    const opacity0 = useTransform(scrollYProgress, [0, 0.08, 0.18], [1, 1, 0]);
    const opacity1 = useTransform(scrollYProgress, [0.08, 0.18, 0.35, 0.45], [0, 1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.62, 0.72], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.62, 0.72, 1.0], [0, 1, 1]);
    const opacities = [opacity0, opacity1, opacity2, opacity3];

    // 文字が中央にある時はレイヤーを透明にし、文字と文字の間の移動中に白レイヤーを濃くする
    const whiteLayerOpacity = useTransform(scrollYProgress, 
        [0, 0.08, 0.18, 0.26, 0.35, 0.45, 0.54, 0.62, 0.72, 0.81, 1.0],
        [0, 1,    1,    0,    1,    1,    0,    1,    1,    0,    0  ]
    );

    const textContainerStyle = {
        maxWidth: '800px',
        width: '100%',
        padding: '50px 20px',
        textAlign: 'center',
        fontSize: 'clamp(0.7rem, 1.5vw, 0.95rem)',
        color: '#ffffff',
        fontFamily: 'var(--font-jp)',
        textShadow: '0 2px 12px rgba(0,0,0,0.3)', // 黒いシャドウを大幅に弱くして明るい印象に
        letterSpacing: '0.1em'
    };

    const blockStyle = {
        marginBottom: '7rem'
    };

    const lineStyle = {
        margin: 0,
        lineHeight: 4.5
    };

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* Fixed Background Container */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                {/* Scroll-Linked Images */}
                {bgImages.map((img, idx) => (
                    <motion.div
                        key={idx}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: opacities[idx],
                            zIndex: 0
                        }}
                    />
                ))}

                {/* Soft Gradient Overlay for slight Readability without being too dark */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.2))',
                    zIndex: 2
                }} />
            </div>

            {/* Scroll-Linked White Layer - 画面と文字全体を覆う薄い白レイヤー */}
            <motion.div
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(255, 255, 255, 0.4)', // 薄いベール
                    pointerEvents: 'none',
                    opacity: whiteLayerOpacity,
                    zIndex: 20
                }}
            />

            {/* Scrolling Content Panels (Contiguous text flow) */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>
                
                {/* Section 1 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>この大学はその心の階層を、7つの建物で表現しています。</p>
                            <p style={lineStyle}>「心の視点を引き上げる」ための”学び”の場と空間が各建物で繰り広げられています。</p>
                            <p style={lineStyle}>自由自在に行ったり来たりを楽しみながら<br/>素直にあなた自身の感じるままに─</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 2 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{...lineStyle, fontWeight: 'bold'}}>「誰かのために貢献したい」</p>
                            <p style={lineStyle}>そう思う人々が世界に溢れることー<br/>マインド大学は、「学び」を学ぶ”場と空間”を創り出しています。</p>
                            <p style={lineStyle}>学び続けるプロセスは多くの人にとって、勇気や希望となります。</p>
                            <p style={lineStyle}>自らの“心の力”を最大限に発揮できる、<br/>「マインドの法則」をベースとした、「本質的な」学びの”場”を通して、<br/>訪れる人の潜在的な心の力を引き出し<br/>未来の希望を創り出す人財を育成していきます。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{...lineStyle, fontWeight: 'bold'}}>大学で学べる事<br/>人はすでに何かを持っている</p>
                            <p style={lineStyle}>人は、生まれ持った何かを持っています。<br/>それはまだ言葉になっていない可能性<br/>まだ形になっていない方向<br/>まだ気づいていない力です。</p>
                            <p style={lineStyle}>人の心の奥には、その人らしい可能性がすでに存在しています。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 4 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{...lineStyle, fontWeight: 'bold'}}>その人らしさが現れるとき</p>
                            <p style={lineStyle}>人は自分らしさと繋がるとき自然に動き始めます。</p>
                            <p style={lineStyle}>努力して変わるのではなく<br/>「気づいたら変わっていた」<br/>という形で変化が起こります。</p>
                            <p style={lineStyle}>それは外から与えられた変化ではなく<br/>内側から生まれる変化だからです。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Final Enter Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--floor-1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        style={{
                            padding: '16px 48px',
                            borderRadius: '40px',
                            background: 'var(--floor-1)', // 本館のテーマカラーなどに合わせる
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
