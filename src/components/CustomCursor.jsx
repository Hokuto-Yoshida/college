import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            // Check if the hovered element is clickable
            const target = e.target;
            const isClickable = 
                window.getComputedStyle(target).cursor === 'pointer' ||
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.closest('a') ||
                target.closest('button');

            setIsHovering(!!isClickable);
        };

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <motion.div
            animate={{
                x: mousePosition.x - 18,
                y: mousePosition.y - 18,
                backgroundColor: isHovering ? 'rgba(255, 255, 150, 0.8)' : 'rgba(255, 255, 180, 0.5)',
            }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 28,
                mass: 0.5
            }}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 36,
                height: 36,
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 999999,
                border: '1px solid rgba(200, 200, 100, 0.4)', // うっすらとしたフチ
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 10px rgba(255, 255, 150, 0.5)' // 暗い背景用の発光と、明るい背景用の影を両立
            }}
        />
    );
};
