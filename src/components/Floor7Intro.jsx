import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgHallway from '../assets/floor_bg.png'; // 7F intro背景（切り替わらない固定背景）
import introOpening from '../assets/intro_opening.png'; // イントロと同じ画像。一度だけ出してそのまま残す

// 上下の端をぼかすマスク（イントロ/本館導入と同じ）
const MASK = 'linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)';

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

const sectionStyle = {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    marginBottom: '35vh',
};

export const Floor7Intro = ({ onEnter }) => {
    // エントランス（FloorIntro）と同じく、スクロールに合わせて靄が出ては消える
    const { scrollYProgress } = useScroll();
    const mistOpacity = useTransform(scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1.0],
        [0, 0.5,  1,   0.5,  0]
    );

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* Fixed Background（切り替わらない固定背景） */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${imgHallway})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                {/* 視認性向上のためのグラデーションオーバーレイ */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.4))',
                }} />
            </div>

            {/* opening image: 靄と同じく、スクロールに合わせて出ては消える */}
            <motion.div
                style={{
                    position: 'fixed', inset: 0, zIndex: 1,
                    pointerEvents: 'none',
                    backgroundImage: `url(${introOpening})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: mistOpacity,
                }}
            />

            {/* 靄（白幕）: エントランスと同じく、スクロールに合わせて出ては消える */}
            <motion.div
                style={{
                    position: 'fixed', inset: 0, zIndex: 2,
                    pointerEvents: 'none',
                    background: 'rgba(255, 255, 255, 0.3)',
                    maskImage: MASK,
                    WebkitMaskImage: MASK,
                    opacity: mistOpacity,
                }}
            />

            {/* Scrolling Content Panels */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>

                {/* Section 1 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>「自分」を超え、世界と響き合う。</p>
                            <p style={lineStyle}>——潜在意識の最深部で、<br />真の「自分軸」が完成する。</p>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>思考やエゴをすべて削ぎ落としたとき、<br />心に現れるのは「空っぽ」な自分ではありません。</p>
                            <p style={lineStyle}>そこにあるのは、宇宙のように無限に広がる、<br />あなたの潜在能力そのものです。</p>
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>目の前の執着（重力）から自由になり、<br />広い視座で未来を見渡すとき、</p>
                            <p style={lineStyle}>「私」という小さな枠組みは消え、<br />社会や地球と分かちがたくつながる。</p>
                        </div>
                    </div>
                </div>

                {/* Section 4 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontWeight: 'bold', fontSize: '1.2em' }}>マインドプロセス7：自己超越（Self-Transcendence）</p>
                            <br />
                            <p style={lineStyle}>ひとつの企業が繁栄し、世界が潤い、地球が持続していく。</p>
                            <p style={lineStyle}>すべてが調和する「共生の未来」を、ここから描き出しましょう。</p>
                        </div>
                    </div>
                </div>

                {/* Section 5 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontSize: '2em', fontWeight: 'bold', color: 'var(--floor-7)' }}>7F</p>
                            <p style={{ ...lineStyle, fontSize: '1.5em', fontWeight: 'bold' }}>地球を動かす</p>
                        </div>
                    </div>
                </div>

                {/* 進むボタン */}
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
                        7階のフロアへ進む <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
