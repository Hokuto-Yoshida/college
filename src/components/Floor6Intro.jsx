import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgBg from '../assets/floor_bg.png'; // 6F intro背景（切り替わらない固定背景）
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

export const Floor6Intro = ({ onEnter }) => {
    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* Fixed Background（切り替わらない固定背景） */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${imgBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                {/* 視認性向上のためのグラデーションオーバーレイ */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.4))',
                }} />
            </div>

            {/* opening image: 一度だけフェードインして、そのまま残る（背景が変わらないので退場させない） */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 1,
                    pointerEvents: 'none',
                    backgroundImage: `url(${introOpening})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* 靄（白幕）: 一度だけフェードインして、そのまま残る */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 2,
                    pointerEvents: 'none',
                    background: 'rgba(255, 255, 255, 0.3)',
                    maskImage: MASK,
                    WebkitMaskImage: MASK,
                }}
            />

            {/* Scrolling Content Panels */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>

                {/* Section 1 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>「今」を超え、未来へ価値をつなぐ。</p>
                            <p style={lineStyle}>——あなたという存在が、<br />人・組織・社会の「未来」を育て始める。</p>
                        </div>
                    </div>
                </div>

                {/* Section 2 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>本当のリーダーシップとは、<br />自分が先頭に立ち続けることではありません。</p>
                            <p style={lineStyle}>自分がいなくても、人が育ち、<br />組織が成長し、理念が受け継がれていく。</p>
                        </div>
                    </div>
                </div>

                {/* Section 3 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>あなたという存在が、一人の成功者から、<br />未来を創る「設計者」へと進化する瞬間です。</p>
                        </div>
                    </div>
                </div>

                {/* Section 4 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontWeight: 'bold', fontSize: '1.2em' }}>マインドプロセス6：未来創造（Legacy Design）</p>
                            <br />
                            <p style={lineStyle}>目の前の成果だけではなく、<br />10年後、100年後へと続く価値を生み出し、</p>
                            <p style={lineStyle}>人・組織・社会へと循環する<br />「未来の設計図」を描いていきます。</p>
                        </div>
                    </div>
                </div>

                {/* Section 5 */}
                <div style={sectionStyle}>
                    <div style={textContainerStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontSize: '2em', fontWeight: 'bold', color: 'var(--floor-6)' }}>6F</p>
                            <p style={{ ...lineStyle, fontSize: '1.5em', fontWeight: 'bold' }}>時代を動かす</p>
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
                        6階のフロアへ進む <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
