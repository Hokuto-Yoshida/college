import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildings } from '../data/buildings';
import bgCampus from '../assets/exterior.png'; // Fallback or generated image

// Building Click Zone Component
const BuildingZone = ({ id, label, color, position, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            style={{
                position: 'absolute',
                ...position,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10
            }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => onClick(id)}
        >
            {/* Hit Area Visual (Debug or Glow) */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: isHovered ? `radial-gradient(circle, ${color}33 0%, transparent 70%)` : 'transparent',
                borderRadius: '50%',
                filter: 'blur(20px)',
                transition: 'background 0.3s ease'
            }} />

            {/* Label */}
            <motion.div
                initial={{ opacity: 0.7, y: 0 }}
                animate={{
                    opacity: isHovered ? 1 : 0.7,
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.1 : 1
                }}
                style={{
                    padding: '8px 16px',
                    background: 'rgba(0, 0, 0, 0.7)',
                    border: `1px solid ${color}`,
                    borderRadius: '20px',
                    color: '#fff',
                    fontWeight: 'bold',
                    textShadow: `0 0 10px ${color}`,
                    backdropFilter: 'blur(4px)',
                    pointerEvents: 'none' // Let clicks pass to container
                }}
            >
                {label}
            </motion.div>
        </motion.div>
    );
};

export function CampusMap({ onSelectBuilding }) {
    // Helper to get building data
    const getBuilding = (id) => buildings.find(b => b.id === id) || { name: id, color: '#fff' };

    return (
        <div style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            overflow: 'hidden'
        }}>
            {/* Background Image - Ground View */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${bgCampus})`, // Use the ground view image
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom', // Anchor to bottom for ground view
                transition: 'transform 10s ease-out' // Subtle zoom effect could go here
            }}>
                {/* Dark Overlay for Atmosphere */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(10,10,30,0.4) 100%)' }} />
            </div>

            {/* Title / HUD */}
            <div style={{ position: 'absolute', top: 40, width: '100%', textAlign: 'center', zIndex: 20, pointerEvents: 'none' }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    style={{
                        margin: 0, fontSize: '2rem', letterSpacing: '0.3em',
                        color: 'white', textShadow: '0 0 20px rgba(100,200,255,0.5)',
                        fontFamily: 'serif'
                    }}
                >
                    MIND UNIVERSITY
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ delay: 1, duration: 1 }}
                    style={{ margin: '8px 0 0', fontSize: '0.9rem', color: '#ccc' }}
                >
                    Select a building to enter
                </motion.p>
            </div>

            {/* Interactive Zones - Manually Positioned for Ground View */}

            {/* North (Back/Top) */}
            <BuildingZone
                id="north"
                label={getBuilding('north').name}
                color={getBuilding('north').color}
                position={{ top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '15%' }}
                onClick={onSelectBuilding}
            />

            {/* West (Left) */}
            <BuildingZone
                id="west"
                label={getBuilding('west').name}
                color={getBuilding('west').color}
                position={{ top: '55%', left: '20%', transform: 'translate(-50%, -50%)', width: '25%', height: '30%' }}
                onClick={onSelectBuilding}
            />

            {/* East (Right) */}
            <BuildingZone
                id="east"
                label={getBuilding('east').name}
                color={getBuilding('east').color}
                position={{ top: '55%', left: '80%', transform: 'translate(-50%, -50%)', width: '25%', height: '30%' }}
                onClick={onSelectBuilding}
            />

            {/* Main (Center) */}
            <BuildingZone
                id="main"
                label={getBuilding('main').name}
                color={getBuilding('main').color}
                position={{ top: '65%', left: '50%', transform: 'translate(-50%, -50%)', width: '30%', height: '40%' }}
                onClick={onSelectBuilding}
            />

        </div>
    );
}
