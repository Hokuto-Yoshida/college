import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TransitionOverlay({ isVisible, type = 'door', images = {} }) {
    // Default fallback visuals (CSS) if no image provided
    const getVisual = () => {
        const imgSrc = images[type];

        if (imgSrc) {
            let initial, animate, exit;

            if (type === 'stairs-up') {
                initial = { y: '-100%', opacity: 1 };
                animate = { y: 0, opacity: 1 };
                exit = { y: '100%', opacity: 1 };
            } else if (type === 'stairs-down') {
                initial = { y: '100%', opacity: 1 };
                animate = { y: 0, opacity: 1 };
                exit = { y: '-100%', opacity: 1 };
            } else {
                // door
                initial = { opacity: 0, scale: 1.1 };
                animate = { opacity: 1, scale: 1 };
                exit = { opacity: 0, scale: 1.1 };
            }

            return (
                <motion.div
                    initial={initial}
                    animate={animate}
                    exit={exit}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#000',
                        overflow: 'hidden'
                    }}
                >
                    <motion.img
                        src={imgSrc}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }}
                        animate={{ scale: [1, 1.05] }}
                        transition={{ duration: 3, ease: "linear" }}
                    />
                    <div style={{ position: 'absolute', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.2em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                        {type === 'stairs-up' && "ASCENDING..."}
                        {type === 'stairs-down' && "DESCENDING..."}
                        {type === 'door' && "ENTERING..."}
                    </div>
                </motion.div>
            );
        }

        // Fallback CSS shapes
        switch (type) {
            case 'door':
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            style={{ position: 'absolute', left: 0, width: '50%', height: '100%', background: '#1a1a1a', borderRight: '1px solid #333', transformOrigin: 'left' }}
                        />
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            style={{ position: 'absolute', right: 0, width: '50%', height: '100%', background: '#1a1a1a', borderLeft: '1px solid #333', transformOrigin: 'right' }}
                        />
                    </div>
                );
            case 'stairs-up':
            case 'stairs-down':
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                        <motion.div
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: type === 'stairs-up' ? 90 : -90, opacity: 1 }}
                            transition={{ duration: 2 }}
                            style={{ width: '200px', height: '200px', border: '2px dashed white', borderRadius: '50%' }}
                        />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
                >
                    {getVisual()}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
