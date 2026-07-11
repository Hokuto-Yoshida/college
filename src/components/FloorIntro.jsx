import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgBg from '../assets/floor_bg.png';

const processMap = {
    '7F': { num: 7, viewpoint: '地球視点', action: '地球を動かす' },
    '6F': { num: 6, viewpoint: '空視点',   action: '時代を動かす' },
    '5F': { num: 5, viewpoint: '鳥視点',   action: '社会を動かす' },
    '4F': { num: 4, viewpoint: '高層階',   action: '潜在意識を動かす' },
    '3F': { num: 3, viewpoint: '中層階',   action: '他者を動かす' },
    '2F': { num: 2, viewpoint: '低層階',   action: '自分を動かす' },
    '1F': { num: 1, viewpoint: '地上層',   action: '自分を知る' },
    '0F': { num: 0, viewpoint: '地下層',   action: '自分を知らない' },
    'B1': { num: -1, viewpoint: '地中階',  action: '自分を見失う' },
};

export const FloorIntro = ({ floor, onEnter }) => {
    const { scrollYProgress } = useScroll();
    const proc = processMap[floor.id] ?? { num: '?', viewpoint: '', action: '' };

    const whiteLayerOpacity = useTransform(scrollYProgress,
        [0, 0.08, 0.18, 0.26, 0.35, 0.45, 0.54, 0.62, 0.72, 0.81, 1.0],
        [0, 1,    1,    0,    1,    1,    0,    1,    1,    0,    0  ]
    );

    const textStyle = {
        maxWidth: '800px',
        width: '100%',
        padding: '50px 20px',
        textAlign: 'center',
        fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
        color: '#ffffff',
        fontFamily: 'var(--font-jp)',
        textShadow: '0 2px 12px rgba(0,0,0,0.8)',
        letterSpacing: '0.1em',
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

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* 背景 */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${imgBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5,10,20,0.4))',
                    zIndex: 2,
                }} />
            </div>

            {/* 白フラッシュレイヤー */}
            <motion.div style={{
                position: 'fixed', inset: 0,
                background: 'rgba(255,255,255,0.3)',
                pointerEvents: 'none',
                opacity: whiteLayerOpacity,
                zIndex: 20,
            }} />

            {/* スクロールコンテンツ */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>

                {/* Section 1: フロアテーマ */}
                <motion.div style={sectionStyle}>
                    <div style={textStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>{floor.description}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 2: subtitle */}
                <motion.div style={sectionStyle}>
                    <div style={textStyle}>
                        <div style={blockStyle}>
                            <p style={lineStyle}>{floor.subtitle}</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 3: プロセス */}
                <motion.div style={sectionStyle}>
                    <div style={textStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontWeight: 'bold', fontSize: '1.2em' }}>
                                マインドプロセス{proc.num}：{proc.viewpoint}
                            </p>
                            <br />
                            <p style={lineStyle}>{proc.action}——</p>
                            <p style={lineStyle}>{floor.domain}の力を最大限に引き出す場所。</p>
                        </div>
                    </div>
                </motion.div>

                {/* Section 4: フロア番号 */}
                <motion.div style={sectionStyle}>
                    <div style={textStyle}>
                        <div style={blockStyle}>
                            <p style={{ ...lineStyle, fontSize: '2em', fontWeight: 'bold', color: floor.color }}>
                                {floor.id}
                            </p>
                            <p style={{ ...lineStyle, fontSize: '1.5em', fontWeight: 'bold' }}>
                                {floor.title}
                            </p>
                        </div>
                    </div>
                </motion.div>

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
                            gap: '12px',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        {floor.id}のフロアへ進む <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
