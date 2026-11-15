import React, { useState } from 'react';
import { buildings } from '../data/buildings';
import { useIsMobile, useIsPortrait } from '../hooks/useMediaQuery';
import bgCampus from '../assets/campus_bg.png';

// variant ごとのスタイル
const getLabelStyle = (variant, color, isHovered, compact) => {
    const base = {
        padding: compact ? '6px 12px' : '8px 18px',
        whiteSpace: 'nowrap', // 狭い画面でも名前を1文字ずつ縦に折り返さない
        borderRadius: '20px',
        fontWeight: 'bold',
        pointerEvents: 'none',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-8px) scale(1.08)' : 'translateY(0) scale(1)',
        fontSize: compact ? '0.8rem' : '0.9rem',
        // スマホでは名札が明るい空や建物に重なるので、文字に影を付けて読みやすくする
        ...(compact && { textShadow: '0 1px 4px rgba(0,0,0,0.65)' }),
    };

    switch (variant) {
        // すりガラス: 半透明白 + blur, ホバーで少し明るく
        case 'glass':
            return {
                ...base,
                background: isHovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${isHovered ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.2)'}`,
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                color: '#fff',
                boxShadow: isHovered ? '0 4px 20px rgba(255,255,255,0.15)' : 'none',
            };
        // 塗りつぶし: ホバーで建物カラーに染まる
        case 'fill':
            return {
                ...base,
                background: isHovered ? color : 'rgba(0,0,0,0.55)',
                border: `1px solid ${color}`,
                color: isHovered ? '#000' : '#fff',
                textShadow: isHovered ? 'none' : `0 0 8px ${color}88`,
                boxShadow: isHovered ? `0 4px 20px ${color}66` : 'none',
            };
        // アウトライン＋グロー: 枠線が光る
        case 'glow':
            return {
                ...base,
                background: isHovered ? `${color}18` : 'transparent',
                border: `1px solid ${isHovered ? color : color + '55'}`,
                color: isHovered ? color : '#ccc',
                textShadow: isHovered ? `0 0 10px ${color}` : 'none',
                boxShadow: isHovered ? `0 0 18px ${color}55, inset 0 0 12px ${color}18` : 'none',
            };
        default:
            return base;
    }
};

// 建物ごとのvariant割り当て
const variantMap = {
    main:      'glass',
    personal:  'glass',
    mirror:    'glass',
    collage:   'glass',
    mind:      'glass',
    yosei:     'glass',
    practical: 'glass',
};

// 縦長の画面（スマホを縦に持ったときなど）での名札の位置（画面に対する %）。
// 縦長だと背景の真ん中しか映らず、横長用の位置では左に固まって重なるので、時計台（本館）を中心に左右へ振り分ける
const MOBILE_POSITIONS = {
    personal: { top: '33%', left: '25%' },
    mind: { top: '33%', left: '75%' },
    mirror: { top: '41%', left: '21%' },
    collage: { top: '41%', left: '79%' },
    main: { top: '49%', left: '50%' },
    yosei: { top: '57%', left: '26%' },
    practical: { top: '57%', left: '74%' },
};

const BuildingZone = ({ id, label, color, position, onClick, compact }) => {
    const [isHovered, setIsHovered] = useState(false);
    const variant = variantMap[id] || 'fill';

    return (
        <div
            style={{
                position: 'absolute',
                ...position,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onClick(id)}
        >
            {/* ホバー時の背景グロー */}
            <div style={{
                position: 'absolute', inset: 0,
                background: isHovered ? `radial-gradient(circle, ${color}33 0%, transparent 70%)` : 'transparent',
                borderRadius: '50%', filter: 'blur(20px)',
                transition: 'background 0.3s ease',
            }} />
            <div style={getLabelStyle(variant, color, isHovered, compact)}>
                {label}
            </div>
        </div>
    );
};

export function CampusMap({ onSelectBuilding }) {
    const isMobile = useIsMobile(); // 文字・名札を小さくする
    const isPortrait = useIsPortrait(); // 名札の位置を縦長用にする（縦長だと背景の真ん中しか映らない）
    return (
        <div style={{ position: 'absolute', inset: 0, background: '#fff', overflow: 'hidden' }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${bgCampus})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }} />

            {/* タイトル */}
            <div style={{ position: 'absolute', top: 40, width: '100%', textAlign: 'center', zIndex: 20, pointerEvents: 'none' }}>
                <h1 style={{
                    margin: 0, fontSize: isMobile ? '1.45rem' : '2rem', letterSpacing: isMobile ? '0.18em' : '0.3em',
                    color: 'white', textShadow: '0 0 20px rgba(100,200,255,0.5), 0 2px 8px rgba(0,0,0,0.45)',
                    fontFamily: 'serif', whiteSpace: 'nowrap',
                }}>
                    MIND UNIVERSITY
                </h1>
                <p style={{
                    margin: '8px 0 0', fontSize: isMobile ? '0.8rem' : '0.9rem', color: '#fff',
                    opacity: isMobile ? 0.85 : 0.6, textShadow: isMobile ? '0 1px 6px rgba(0,0,0,0.6)' : 'none',
                }}>
                    Select a building to enter
                </p>
            </div>

            {buildings.map(b => (
                <BuildingZone
                    key={b.id}
                    id={b.id}
                    label={b.name}
                    color={b.color}
                    position={isPortrait && MOBILE_POSITIONS[b.id] ? {
                        ...MOBILE_POSITIONS[b.id],
                        transform: `translate(-50%, -50%) scale(${b.id === 'main' ? 1.15 : 1})`,
                        padding: '10px', // 押しやすいよう、名札のまわりも押せるようにする
                    } : {
                        top: b.mapPosition.top,
                        left: b.mapPosition.left,
                        transform: `translate(-50%, -50%) scale(${b.mapPosition.scale || 1})`,
                        width: '18%',
                        height: '18%',
                    }}
                    compact={isMobile}
                    onClick={onSelectBuilding}
                />
            ))}
        </div>
    );
}
