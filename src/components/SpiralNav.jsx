import React from 'react';
import { motion } from 'framer-motion';

import thumbB1 from '../assets/floor_thumb_B1.png';
import thumb1F from '../assets/floor_thumb_1F.png';
import thumb2F from '../assets/floor_thumb_2F.png';
import thumb3F from '../assets/floor_thumb_3F.png';
import thumb4F from '../assets/floor_thumb_4F.png';
import thumb5F from '../assets/floor_thumb_5F.png';
import thumb6F from '../assets/floor_thumb_6F.png';
import thumb7F from '../assets/floor_thumb_7F.png';

const rowBgMap = {
    '7F': 'rgba(248, 240, 200, 0.55)',
    '6F': 'rgba(240, 220, 140, 0.55)',
    '5F': 'rgba(230, 195, 70,  0.55)',
    '4F': 'rgba(215, 160, 30,  0.55)',
    '3F': 'rgba(195, 120, 15,  0.55)',
    '2F': 'rgba(170,  85, 10,  0.55)',
    '1F': 'rgba(140,  55,  8,  0.55)',
    'B1': 'rgba(100,  30,  5,  0.55)',
};

const thumbMap = {
    '7F': thumb7F,
    '6F': thumb6F,
    '5F': thumb5F,
    '4F': thumb4F,
    '3F': thumb3F,
    '2F': thumb2F,
    '1F': thumb1F,
    'B1': thumbB1,
};

const processMap = {
    '7F': { num: 7, viewpoint: '地球視点', action: '地球を動かす' },
    '6F': { num: 6, viewpoint: '空視点',   action: '時代を動かす' },
    '5F': { num: 5, viewpoint: '鳥視点',   action: '社会を動かす' },
    '4F': { num: 4, viewpoint: '高層階',   action: '潜在意識を動かす' },
    '3F': { num: 3, viewpoint: '中層階',   action: '他者を動かす' },
    '2F': { num: 2, viewpoint: '低層階',   action: '自分を動かす' },
    '1F': { num: 1, viewpoint: '地上層',   action: '自分を知る' },
    'B1': { num: 0, viewpoint: '地下層',   action: '自分を知らない' },
};

export function SpiralNav({ floors, onSelectFloor }) {
    return (
        <div style={{ padding: '0 0 24px' }}>
            <h3 style={{
                textAlign: 'center',
                fontFamily: 'var(--font-en)',
                letterSpacing: '0.3em',
                fontSize: '0.95rem',
                color: 'rgba(255,255,255,0.85)',
                margin: '0 0 12px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
            }}>
                FLOOR GUIDE
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                {floors.map((floor) => {
                    const proc = processMap[floor.id];
                    if (!proc) return null;

                    return (
                        <motion.button
                            key={floor.id}
                            whileHover={{ x: 3 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectFloor(floor.id)}
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '42px 80px 58px 1fr',
                                alignItems: 'center',
                                gap: '8px',
                                background: rowBgMap[floor.id] ?? 'rgba(255,255,255,0.06)',
                                border: 'none',
                                borderLeft: `4px solid ${floor.color}`,
                                padding: '8px 12px 8px 10px',
                                cursor: 'pointer',
                                textAlign: 'left',
                                width: '100%',
                                minHeight: '52px',
                            }}
                        >
                            {/* 階数 */}
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    color: floor.color,
                                    fontFamily: 'var(--font-en)',
                                    lineHeight: 1,
                                    filter: 'brightness(1.4)',
                                }}>
                                    {floor.id}
                                </div>
                            </div>

                            {/* プロセス情報 */}
                            <div>
                                <div style={{
                                    fontSize: '0.68rem',
                                    color: 'rgba(255,255,255,0.6)',
                                    lineHeight: 1.4,
                                    fontFamily: 'var(--font-jp)',
                                }}>
                                    プロセス{proc.num}
                                </div>
                                <div style={{
                                    fontSize: '0.68rem',
                                    color: 'rgba(255,255,255,0.45)',
                                    fontFamily: 'var(--font-jp)',
                                }}>
                                    {proc.viewpoint}
                                </div>
                            </div>

                            {/* サムネイル */}
                            <div style={{
                                width: '58px',
                                height: '46px',
                                overflow: 'hidden',
                                borderRadius: '3px',
                                background: 'rgba(255,255,255,0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                {thumbMap[floor.id] && (
                                    <img
                                        src={thumbMap[floor.id]}
                                        alt={floor.id}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                )}
                            </div>

                            {/* アクション */}
                            <div style={{
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                color: floor.color,
                                fontFamily: 'var(--font-jp)',
                                filter: 'brightness(1.4)',
                                lineHeight: 1.3,
                            }}>
                                {proc.action}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
