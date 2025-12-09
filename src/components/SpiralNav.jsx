import React from 'react';
import { motion } from 'framer-motion';
import { floors } from '../data/floors';
import { ArrowUpCircle } from 'lucide-react';

export function SpiralNav({ onSelectFloor }) {
    return (
        <div className="spiral-nav-container" style={{ position: 'relative', padding: '20px 0' }}>
            <h3 className="en-title" style={{ textAlign: 'center', marginBottom: '24px', opacity: 0.8 }}>
                Floor Guide
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
                {floors.map((floor, index) => {
                    // Apply a slight scaling to simulate the "Reverse Trapezoid" (wider at top)
                    // 7 floors (0 to 7). Top (0) should be widest.
                    // B1 is last.
                    const isBasement = floor.id === 'B1';
                    const scale = isBasement ? 0.9 : 1 + (0.05 * (6 - index));
                    // Warning: index in map depends on order in floors.js. 
                    // floors.js is ordered 7F down to B1.
                    // 7F (index 0) -> scale 1.3
                    // 1F (index 6) -> scale 1.0

                    return (
                        <motion.button
                            key={floor.id}
                            whileHover={{ scale: 1.05 * (isBasement ? 1 : scale), x: 10 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => onSelectFloor(floor.id)}
                            style={{
                                background: `linear-gradient(90deg, rgba(255,255,255,0.03), ${floor.color}22)`,
                                border: '1px solid var(--glass-border)',
                                borderLeft: `4px solid ${floor.color}`,
                                borderRadius: '8px',
                                padding: '12px 16px',
                                textAlign: 'left',
                                color: 'white',
                                cursor: 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                // transform: `scaleX(${isBasement ? 1 : 1 + ((floors.length - index) * 0.05)})`, 
                                // CSS transform scaleX might distort text. Better to use width % or just keep it simple list but styled nicely.
                                // Let's rely on the visual "Tower" shape in the 3D view if we implement it, 
                                // for this Nav, clean list is better.
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem', marginRight: '8px', color: floor.color }}>
                                        {floor.id}
                                    </span>
                                    <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>{floor.domain}</span>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{floor.title}</span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <div style={{ textAlign: 'center', marginTop: '24px', opacity: 0.6 }}>
                <ArrowUpCircle size={24} className="animate-float" />
                <p style={{ fontSize: '0.8rem' }}>Select a Floor</p>
            </div>
        </div>
    );
}
