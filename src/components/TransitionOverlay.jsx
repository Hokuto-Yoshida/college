import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TransitionOverlay({ isVisible, type = 'door', images = {}, onComplete }) {
    // Default fallback visuals (CSS) if no image provided
    const getVisual = () => {
        const imgSrc = images[type];

        if (imgSrc) {
            if (type === 'door') {
                return (
                    <motion.div
                        initial={{ backgroundColor: 'rgba(0,0,0,1)' }}
                        animate={{ backgroundColor: ['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'] }}
                        transition={{ duration: 4, times: [0, 0.4, 0.5, 1] }}
                        style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                            perspective: '1200px'
                        }}
                    >
                        {/* Background Building Image */}
                        <motion.img
                            src={imgSrc}
                            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: -2 }}
                            animate={{ scale: [1, 1.5, 2, 2], opacity: [0.5, 0.5, 0, 0] }}
                            transition={{ duration: 4, times: [0, 0.4, 0.5, 1], ease: "easeInOut" }}
                        />



                        {/* Door Container */}
                        <motion.div
                            animate={{ scale: [1, 2, 15, 20] }}
                            transition={{ duration: 4, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
                            style={{
                                width: '280px', height: '420px',
                                position: 'relative',
                                display: 'flex',
                                transformStyle: 'preserve-3d',
                                zIndex: 1
                            }}
                        >
                            {/* Left Door */}
                            <motion.div
                                animate={{ rotateY: [0, 0, -110, -110] }}
                                transition={{ duration: 4, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
                                style={{
                                    width: '50%', height: '100%',
                                    background: 'linear-gradient(135deg, #1a1a24 0%, #0d0d14 100%)',
                                    border: '3px solid #333', borderRight: '1px solid #000',
                                    transformOrigin: 'left',
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                                    paddingRight: '12px',
                                    boxShadow: 'inset 0 0 20px rgba(129,230,217,0.1), 10px 0 20px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '5%', bottom: '5%', left: '10%', right: '20%', border: '2px solid rgba(129,230,217,0.3)', borderRadius: '4px' }} />
                                <div style={{ width: '10px', height: '60px', background: '#333', borderRadius: '4px', border: '1px solid #111', boxShadow: '-1px 0 5px rgba(0,0,0,0.5)', zIndex: 2 }} />
                            </motion.div>

                            {/* Right Door */}
                            <motion.div
                                animate={{ rotateY: [0, 0, 110, 110] }}
                                transition={{ duration: 4, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
                                style={{
                                    width: '50%', height: '100%',
                                    background: 'linear-gradient(225deg, #1a1a24 0%, #0d0d14 100%)',
                                    border: '3px solid #333', borderLeft: '1px solid #000',
                                    transformOrigin: 'right',
                                    display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                                    paddingLeft: '12px',
                                    boxShadow: 'inset 0 0 20px rgba(129,230,217,0.1), -10px 0 20px rgba(0,0,0,0.5)'
                                }}
                            >
                                <div style={{ position: 'absolute', top: '5%', bottom: '5%', right: '10%', left: '20%', border: '2px solid rgba(129,230,217,0.3)', borderRadius: '4px' }} />
                                <div style={{ width: '10px', height: '60px', background: '#333', borderRadius: '4px', border: '1px solid #111', boxShadow: '1px 0 5px rgba(0,0,0,0.5)', zIndex: 2 }} />
                            </motion.div>
                        </motion.div>


                    </motion.div>
                );
            } else {
                let initial = type === 'stairs-up' ? { y: '-100%', opacity: 1 } : { y: '100%', opacity: 1 };
                let animate = { y: 0, opacity: 1 };
                let exit = type === 'stairs-up' ? { y: '100%', opacity: 1 } : { y: '-100%', opacity: 1 };

                return (
                    <motion.div
                        initial={initial}
                        animate={animate}
                        exit={exit}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#000',
                            overflow: 'hidden',
                            position: 'relative'
                        }}
                    >
                        {/* Background Spiral Image */}
                        <motion.img
                            src={imgSrc}
                            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.2)' }}
                            animate={{ scale: [1, 1.2], rotate: type === 'stairs-up' ? [0, 45] : [0, -45] }}
                            transition={{ duration: 6.5, ease: "linear" }}
                        />

                        {/* Text Overlay Sequence */}
                        <div style={{ position: 'relative', zIndex: 10, width: '80%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center', textAlign: 'center' }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                transition={{ duration: 3, times: [0, 0.2, 0.8, 1], delay: 0.5 }}
                                style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                            >
                                問いを立て、構造を描く。
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                transition={{ duration: 3, times: [0, 0.2, 0.8, 1], delay: 2 }}
                                style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                            >
                                マインドプロセスデザインで思考を整える。
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                transition={{ duration: 3.5, times: [0, 0.2, 0.9, 1], delay: 3.5 }}
                                style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                            >
                                この階層では、その瞬間のマインドに応じたワークが即興で生まれます。<br />
                                答えを見つけるのではなく、向き合うことで階層が引き上がります。
                            </motion.div>

                            {/* Enter Floor Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: 6.5 }}
                                style={{ pointerEvents: 'auto' }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onComplete) onComplete();
                                    }}
                                    className="glass-panel"
                                    style={{
                                        padding: '16px 40px',
                                        borderRadius: '40px',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid white',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                        boxShadow: `0 0 20px rgba(255,255,255,0.2)`
                                    }}
                                >
                                    フロアに入る
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                );
            }
        }

        // Fallback CSS shapes
        switch (type) {
            case 'door':
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', perspective: '1200px' }}>
                        {/* Door Container */}
                        <motion.div
                            animate={{ scale: [1, 2, 15] }}
                            transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
                            style={{
                                width: '280px', height: '420px',
                                position: 'relative',
                                display: 'flex',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.div
                                animate={{ rotateY: [0, 0, -110] }}
                                transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
                                style={{ width: '50%', height: '100%', background: '#1a1a24', border: '2px solid #333', transformOrigin: 'left' }}
                            />
                            <motion.div
                                animate={{ rotateY: [0, 0, 110] }}
                                transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
                                style={{ width: '50%', height: '100%', background: '#1a1a24', border: '2px solid #333', transformOrigin: 'right' }}
                            />
                        </motion.div>
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
