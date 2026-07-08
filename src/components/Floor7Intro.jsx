import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ※添付いただいた画像の代わりに、既存の画像パスを仮で設定しています。
// 実際の画像ファイル名に合わせて変更してください。
import imgHallway from '../assets/floor_bg.png'; // 7F intro背景

export const Floor7Intro = ({ onEnter }) => {
    const { scrollYProgress } = useScroll();


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
        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
        color: '#ffffff',
        fontFamily: 'var(--font-jp)',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        letterSpacing: '0.1em'
    };

    const blockStyle = {
        marginBottom: '7rem'
    };

    const lineStyle = {
        margin: 0,
        lineHeight: 4.0
    };

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* Fixed Background Container */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${imgHallway})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }} />
                {/* 視認性向上のためのグラデーションオーバーレイ */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.4))',
                    zIndex: 2
                }} />
            </div>

            {/* Scroll-Linked White Layer */}
            <motion.div
                style={{
                    position: 'fixed', inset: 0,
                    background: 'rgba(255, 255, 255, 0.3)', 
                    pointerEvents: 'none',
                    opacity: whiteLayerOpacity,
                    zIndex: 20
                }}
            />

            {/* Scrolling Content Panels */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>
                
                {/* Section 1 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>「自分」を超え、世界と響き合う。</p>
                            <p style={lineStyle}>——潜在意識の最深部で、<br/>真の「自分軸」が完成する。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 2 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>思考やエゴをすべて削ぎ落としたとき、<br/>心に現れるのは「空っぽ」な自分ではありません。</p>
                            <p style={lineStyle}>そこにあるのは、宇宙のように無限に広がる、<br/>あなたの潜在能力そのものです。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>目の前の執着（重力）から自由になり、<br/>広い視座で未来を見渡すとき、</p>
                            <p style={lineStyle}>「私」という小さな枠組みは消え、<br/>社会や地球と分かちがたくつながる。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 4 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{...lineStyle, fontWeight: 'bold', fontSize: '1.2em'}}>マインドプロセス7：自己超越（Self-Transcendence）</p>
                            <br/>
                            <p style={lineStyle}>ひとつの企業が繁栄し、世界が潤い、地球が持続していく。</p>
                            <p style={lineStyle}>すべてが調和する「共生の未来」を、ここから描き出しましょう。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 5 */}
                <motion.div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', marginBottom: '35vh' }}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{...lineStyle, fontSize: '2em', fontWeight: 'bold', color: 'var(--floor-7)'}}>7F</p>
                            <p style={{...lineStyle, fontSize: '1.5em', fontWeight: 'bold'}}>地球を動かす</p>
                        </div>
                    </div>
                </motion.div>

                {/* Final Enter Button */}
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
                            transition: 'box-shadow 0.3s ease'
                        }}
                    >
                        7階のフロアへ進む <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
