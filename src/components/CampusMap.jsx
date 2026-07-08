import React, { useState } from 'react';
import { buildings } from '../data/buildings';
import bgCampus from '../assets/campus_bg.png';

// variant ごとのスタイル
const getLabelStyle = (variant, color, isHovered) => {
    const base = {
        padding: '8px 18px',
        borderRadius: '20px',
        fontWeight: 'bold',
        pointerEvents: 'none',
        transition: 'all 0.25s ease',
        transform: isHovered ? 'translateY(-8px) scale(1.08)' : 'translateY(0) scale(1)',
        fontSize: '0.9rem',
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

const BuildingZone = ({ id, label, color, position, onClick }) => {
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
            <div style={getLabelStyle(variant, color, isHovered)}>
                {label}
            </div>
        </div>
    );
};

export function CampusMap({ onSelectBuilding }) {
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
                    margin: 0, fontSize: '2rem', letterSpacing: '0.3em',
                    color: 'white', textShadow: '0 0 20px rgba(100,200,255,0.5)',
                    fontFamily: 'serif'
                }}>
                    MIND UNIVERSITY
                </h1>
                <p style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#ccc', opacity: 0.6 }}>
                    Select a building to enter
                </p>
            </div>

            {buildings.map(b => (
                <BuildingZone
                    key={b.id}
                    id={b.id}
                    label={b.name}
                    color={b.color}
                    position={{
                        top: b.mapPosition.top,
                        left: b.mapPosition.left,
                        transform: `translate(-50%, -50%) scale(${b.mapPosition.scale || 1})`,
                        width: '18%',
                        height: '18%',
                    }}
                    onClick={onSelectBuilding}
                />
            ))}
        </div>
    );
}
