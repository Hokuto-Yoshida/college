import React from 'react';
import { motion } from 'framer-motion';

import thumbB1 from '../assets/floor_thumb_B1.png';
import thumb0F from '../assets/floor_thumb_0F.png';
import thumb1F from '../assets/floor_thumb_1F.png';
import thumb2F from '../assets/floor_thumb_2F.png';
import thumb3F from '../assets/floor_thumb_3F.png';
import thumb4F from '../assets/floor_thumb_4F.png';
import thumb5F from '../assets/floor_thumb_5F.png';
import thumb6F from '../assets/floor_thumb_6F.png';
import thumb7F from '../assets/floor_thumb_7F.png';

const thumbMap = {
    '7F': thumb7F, '6F': thumb6F, '5F': thumb5F, '4F': thumb4F,
    '3F': thumb3F, '2F': thumb2F, '1F': thumb1F, '0F': thumb0F, 'B1': thumbB1,
};

const processMap = {
    '7F': { num: 7,  viewpoint: '地球視点', action: '地球を動かす' },
    '6F': { num: 6,  viewpoint: '空視点',   action: '時代を動かす' },
    '5F': { num: 5,  viewpoint: '鳥視点',   action: '社会を動かす' },
    '4F': { num: 4,  viewpoint: '高層階',   action: '潜在意識を動かす' },
    '3F': { num: 3,  viewpoint: '中層階',   action: '他者を動かす' },
    '2F': { num: 2,  viewpoint: '低層階',   action: '自分を動かす' },
    '1F': { num: 1,  viewpoint: '地上層',   action: '自分を知る' },
    '0F': { num: 0,  viewpoint: '地下層',   action: '自分を知らない' },
    'B1': { num: -1, viewpoint: '地中階',   action: '自分を見失う' },
};

export function SpiralNav({ floors, onSelectFloor, compact = false }) {
    const rowH = compact ? '52px' : 'calc(100vh / 9)';
    const thumbS = compact ? '40px' : 'calc(100vh / 9)';

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            {compact && (
                <div style={{
                    textAlign: 'center',
                    fontFamily: 'var(--font-en)',
                    letterSpacing: '0.3em',
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.4)',
                    padding: '6px 0 5px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                }}>
                    FLOOR GUIDE
                </div>
            )}
            {floors.map((floor) => {
                const proc = processMap[floor.id];
                if (!proc) return null;

                return (
                    <motion.button
                        key={floor.id}
                        whileHover={{ backgroundColor: 'rgba(255, 225, 0, 0.45)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectFloor(floor.id)}
                        style={{
                            height: rowH,
                            display: 'grid',
                            gridTemplateColumns: compact
                                ? `30px ${thumbS} 76px 1fr`
                                : `48px ${thumbS} 112px minmax(0, 1fr)`,
                            alignItems: 'center',
                            gap: compact ? '8px' : '12px',
                            backgroundColor: 'rgba(255,255,255,0.18)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            border: 'none',
                            borderBottom: '1px solid rgba(255,255,255,0.25)',
                            padding: compact ? '0 10px 0 8px' : '0 14px 0 10px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        {/* 階番号 */}
                        <div style={{
                            fontSize: compact ? '0.85rem' : '1.35rem',
                            fontWeight: '700',
                            color: '#333',
                            fontFamily: 'var(--font-en)',
                            textAlign: 'center',
                            lineHeight: 1,
                            letterSpacing: '0.03em',
                        }}>
                            {floor.id}
                        </div>

                        {/* サムネイル */}
                        <div style={{
                            width: thumbS,
                            height: thumbS,
                            overflow: 'hidden',
                            borderRadius: compact ? '4px' : '6px',
                            flexShrink: 0,
                            border: '1px solid rgba(255,255,255,0.14)',
                        }}>
                            {thumbMap[floor.id] && (
                                <img
                                    src={thumbMap[floor.id]}
                                    alt={floor.id}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </div>

                        {/* プロセス + 視点 */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden', minWidth: 0 }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: '6px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                marginBottom: '3px',
                            }}>
                                <span style={{
                                    fontSize: compact ? '0.62rem' : '0.8rem',
                                    color: '#1d4ed8',
                                    fontFamily: 'var(--font-jp)',
                                    letterSpacing: '0.04em',
                                }}>
                                    プロセス
                                </span>
                                <span style={{
                                    fontSize: compact ? '1rem' : '1.5rem',
                                    fontWeight: '700',
                                    color: '#1d4ed8',
                                    fontFamily: 'var(--font-en)',
                                    lineHeight: 1,
                                }}>
                                    {proc.num}
                                </span>
                            </div>
                            <div style={{
                                fontSize: compact ? '0.62rem' : '0.85rem',
                                color: '#555',
                                fontFamily: 'var(--font-jp)',
                                letterSpacing: '0.04em',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                textAlign: 'center',
                            }}>
                                {proc.viewpoint}
                            </div>
                        </div>

                        {/* アクション（右側） */}
                        <div style={{
                            fontSize: compact ? '0.78rem' : '1.25rem',
                            fontWeight: '700',
                            color: '#333',
                            fontFamily: 'var(--font-jp)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            letterSpacing: '0.06em',
                        }}>
                            {proc.action}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
