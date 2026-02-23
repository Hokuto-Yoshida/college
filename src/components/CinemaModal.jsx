import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import cinemaBg from '../assets/cinema_room.png';

export function CinemaModal({ isOpen, onClose, videoUrl, title }) {
    const [embedUrl, setEmbedUrl] = useState('');
    const [mediaType, setMediaType] = useState(null); // 'iframe' or 'video'

    useEffect(() => {
        if (isOpen && videoUrl) {
            let type = null;
            let finalUrl = '';

            try {
                const urlObj = new URL(videoUrl);

                // YouTube
                if (urlObj.hostname.includes('youtube.com')) {
                    const videoId = urlObj.searchParams.get('v');
                    if (videoId) {
                        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                        type = 'iframe';
                    }
                } else if (urlObj.hostname.includes('youtu.be')) {
                    const videoId = urlObj.pathname.slice(1);
                    if (videoId) {
                        finalUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
                        type = 'iframe';
                    }
                }
                // Vimeo
                else if (urlObj.hostname.includes('vimeo.com')) {
                    const videoId = urlObj.pathname.split('/').pop();
                    if (videoId) {
                        finalUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1`;
                        type = 'iframe';
                    }
                }
                // MP4 Direct Link
                else if (urlObj.pathname.endsWith('.mp4')) {
                    finalUrl = videoUrl;
                    type = 'video';
                }
            } catch (e) {
                console.warn('Could not parse video URL', videoUrl);
            }

            setEmbedUrl(finalUrl);
            setMediaType(type);
        } else {
            setEmbedUrl('');
            setMediaType(null);
        }
    }, [isOpen, videoUrl]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999, // High above everything
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                }}
            >
                {/* Cinema Background */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${cinemaBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.9,
                    pointerEvents: 'none'
                }} />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="glass-panel"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        padding: '12px',
                        borderRadius: '50%',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: 'rgba(0,0,0,0.5)',
                        color: 'white',
                        cursor: 'pointer',
                        zIndex: 10
                    }}
                >
                    <X size={24} />
                </button>

                {/* Title (Optional, subtle) */}
                <div style={{
                    position: 'absolute',
                    top: '30px',
                    left: '40px',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '1.2rem',
                    pointerEvents: 'none',
                    letterSpacing: '0.1em'
                }}>
                    NOW PLAYING: {title}
                </div>

                {/* The "Screen" area where iframe lives. 
                    These coordinates/percentages are rough estimates to align with the center screen in the image.
                    May need fine-tuning based on the actual asset. */}
                {embedUrl ? (
                    <div style={{
                        position: 'absolute',
                        top: '20%',    // Distance from top
                        left: '12%',   // Distance from left
                        width: '76%',  // Width of the screen area
                        height: '56%', // Height of the screen area
                        background: '#0a0a0a', // Dark screen background
                        boxShadow: '0 0 80px rgba(100,200,255,0.1), inset 0 0 20px rgba(0,0,0,0.8)', // Glow and inner shadow
                        borderRadius: '2px', // Very slight curve like a real screen
                        border: '8px solid #111', // Physical frame of the screen
                        borderBottom: '12px solid #0a0a0a', // Thicker bottom lip
                        overflow: 'hidden',
                        transform: 'perspective(1000px) rotateX(2deg)', // Slight 3D tilt
                        transformOrigin: 'bottom center'
                    }}>
                        {mediaType === 'video' ? (
                            <video
                                src={embedUrl}
                                controls
                                autoPlay
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'block',
                                    objectFit: 'contain',
                                    backgroundColor: '#000'
                                }}
                            />
                        ) : (
                            <iframe
                                src={embedUrl}
                                title="Cinema Video Player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'block'
                                }}
                            />
                        )}
                    </div>
                ) : (
                    <div style={{
                        position: 'absolute',
                        top: '30%',
                        left: '20%',
                        width: '60%',
                        height: '40%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        background: 'rgba(0,0,0,0.8)',
                        borderRadius: '8px',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>このURL形式はシネマビューに対応していません</p>
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#8fd3f4', textDecoration: 'none', border: '1px solid #8fd3f4', padding: '10px 20px', borderRadius: '20px' }}
                        >
                            外部サイトで開く
                        </a>
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
