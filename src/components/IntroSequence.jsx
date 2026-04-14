import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

const sections = [
    {
        title: "時代を揺り動かす心",
        text: "これからもそしてこの先も、時代を揺り動かし変革を起こせるのは人の心です。\nその心の可能性をいかに拡げていけるか――\nこれは人類の未来における最も重要な課題です。"
    },
    {
        title: "潜在意識ともう一人の自分",
        text: "自らを俯瞰し、潜在的な「もう一人の自分」を創り出すことで、現実から新たな可能性が見出されます。\n感性の領域へ引き上げることで希望が溢れ出します。"
    },
    {
        title: "マインドプロセスデザイン",
        text: "〈プロセス-1〉から〈プロセス7〉まで、9段階で構成される心の階層。\n10万人の心で実証されたこの透明な設計図が、【マインドプロセスデザイン】です。"
    },
    {
        title: "社会実装と真のWell-being",
        text: "個の潜在能力を引き出す設計図を社会に実装することは、地球規模の課題を解決に導き、真のWell-beingを実現させます。\n一人ひとりの変化が、組織を変え、社会を変革するのです。"
    },
    {
        title: "希望が溢れ出す未来へ",
        text: "心の視点が引き上がる時、個は自ずと社会へと繋がり、想像を超えた力が生まれます。\nさあ、自らの潜在能力を引き出す場所へ――"
    }
];

export const IntroSequence = ({ onEnter, images }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });

    const numSections = sections.length;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange((latest) => {
            // Map 0 - 1 to 0 - 4 safely
            const index = Math.min(Math.floor(latest * numSections), numSections - 1);
            setActiveIndex(index);
        });
        return () => unsubscribe();
    }, [scrollYProgress, numSections]);

    const scrollToNext = (idx) => {
        if (containerRef.current) {
            const nextIndex = idx + 1;
            if (nextIndex < numSections) {
                containerRef.current.scrollTo({
                    top: containerRef.current.clientHeight * nextIndex,
                    behavior: 'smooth'
                });
            }
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                height: '100vh',
                overflowY: 'auto',
                scrollSnapType: 'y mandatory',
                background: '#000',
                scrollBehavior: 'smooth'
            }}
        >

            {/* Fixed Sticky Background Container */}
            <div style={{ position: 'sticky', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.6, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${images[Math.min(activeIndex, images.length - 1)]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                </AnimatePresence>

                {/* Dark Gradient Overlay for Readability */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.85))'
                }} />
            </div>

            {/* Scrolling Content Panels */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }}>
                {sections.map((section, idx) => (
                    <div key={idx} style={{
                        height: '100vh',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        scrollSnapAlign: 'start'
                    }}>
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ root: containerRef, once: false, amount: 0.5 }}
                            transition={{ duration: 0.8 }}
                            className="glass-panel"
                            style={{
                                maxWidth: '640px',
                                width: '100%',
                                padding: '40px',
                                borderRadius: '24px',
                                textAlign: 'center',
                                background: 'rgba(11, 16, 36, 0.7)',
                                border: '1px solid rgba(129, 230, 217, 0.2)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(12px)'
                            }}
                        >
                            <h2 style={{
                                fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
                                marginBottom: '24px',
                                background: 'linear-gradient(135deg, #fff, #81e6d9)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                fontWeight: 'bold',
                                letterSpacing: '0.05em'
                            }}>
                                {section.title}
                            </h2>
                            <p style={{
                                fontSize: 'clamp(1rem, 3vw, 1.15rem)',
                                lineHeight: 2.0,
                                color: 'rgba(255,255,255,0.9)',
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'var(--font-jp)'
                            }}>
                                {section.text}
                            </p>

                            {idx === numSections - 1 ? (
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--floor-4)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onEnter}
                                    style={{
                                        marginTop: '48px',
                                        padding: '16px 36px',
                                        borderRadius: '40px',
                                        background: 'var(--floor-4)',
                                        color: '#000',
                                        border: 'none',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px',
                                        margin: '48px auto 0',
                                        transition: 'box-shadow 0.3s ease'
                                    }}
                                >
                                    大学ルームに入る <ArrowRight />
                                </motion.button>
                            ) : (
                                <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
                                    <motion.button
                                        onClick={() => scrollToNext(idx)}
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'rgba(129, 230, 217, 0.8)',
                                            cursor: 'pointer',
                                            padding: '10px'
                                        }}
                                        title="次のパートへすすむ"
                                    >
                                        <ChevronDown size={36} />
                                    </motion.button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                ))}
            </div>
        </div>
    );
};
