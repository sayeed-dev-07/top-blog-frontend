'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Loading = () => {
    const linesRef = useRef([]);
    const stampRef = useRef(null);
    const containerRef = useRef(null);

    const addToRefs = (el) => {
        if (el && !linesRef.current.includes(el)) {
            linesRef.current.push(el);
        }
    };

    useGSAP(() => {
        // Start lines small and faded
        gsap.set(linesRef.current, { scaleY: 0.3, opacity: 0.3 });

        // Wave animation for the lines
        gsap.to(linesRef.current, {
            scaleY: 1,
            opacity: 1,
            duration: 0.4,
            yoyo: true,
            repeat: -1,
            stagger: 0.1,
            ease: 'power1.inOut',
        });

        // Subtle pulse for the red dot
        gsap.to(stampRef.current, {
            scale: 0.7,
            opacity: 0.5,
            duration: 0.6,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
        });
    }, { scope: containerRef });

    return (
        // Removed 'fixed inset-0'. Now it only takes up the space it needs.
        <div ref={containerRef} className="flex items-center gap-2 h-6">
            {/* Tiny Hanko Dot */}
            <div
                ref={stampRef}
                className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"
            />

            {/* 3 Mini Cascading Lines */}
            <div className="flex items-center gap-1 h-3">
                {[...Array(3)].map((_, i) => (
                    <div
                        key={i}
                        ref={addToRefs}
                        className="h-full w-[2px] bg-black origin-center"
                    />
                ))}
            </div>
        </div>
    );
};

export default Loading;