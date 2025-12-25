import React from 'react';
import { motion } from 'framer-motion';

import { ArrowUpCircle } from 'lucide-react';

export function SpiralNav({ floors, onSelectFloor }) {
    return (
        <div className="spiral-nav-container" style={{ position: 'relative', padding: '20px 0' }}>
            <h3 className="en-title" style={{ textAlign: 'center', marginBottom: '24px', opacity: 0.8 }}>
                Floor Guide
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '300px', margin: '0 auto' }}>
                {floors.map((floor, index) => {
                    // Apply a slight scaling to simulate the "Reverse Trapezoid" (wider at top)
                    // The numbering logic assumes standard top-down ordering.
                    const isBasement = floor.id === 'B1';
                    // Dynamic scaling based on list length might need adjustment if floor counts vary wildly,
                    // but for now, we'll keep a simple heuristic or remove the specific index math if it's too rigid.
                    // Let's keep it simple: just render freely.

                    return (
                        <motion.button
                            key={floor.id}
                            whileHover={{ scale: 1.05, x: 10 }}
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
