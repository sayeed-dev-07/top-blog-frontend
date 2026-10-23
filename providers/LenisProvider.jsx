// providers/LenisProvider.jsx
'use client';

import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Suspense, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    // Prevent native scroll memory from fighting GSAP pin-spacers
    ScrollTrigger.clearScrollMemory('manual');
}

const LENIS_OPTIONS = {
    lerp: 0.1,
    autoRaf: false,
    autoResize: true,
    smoothWheel: true,
    syncTouch: false,
};

function LenisRouteReset() {
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        // Let Next.js finish its route scroll handling before applying Lenis' reset.
        let secondFrameId = 0;
        const firstFrameId = requestAnimationFrame(() => {
            secondFrameId = requestAnimationFrame(() => {
                lenis.resize();
                ScrollTrigger.refresh();

                // Clear any momentum and make both native and Lenis scroll positions agree.
                lenis.stop();
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                lenis.scrollTo(0, { immediate: true, force: true });
                lenis.start();
            });
        });

        return () => {
            cancelAnimationFrame(firstFrameId);
            cancelAnimationFrame(secondFrameId);
        };
    }, [pathname, lenis]);

    return null;
}

export default function SmoothScroll({ children }) {
    const lenisRef = useRef(null);

    useEffect(() => {
        // Disable browser back/forward scroll restoration so '/' always starts at 0
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        function update(time) {
            lenisRef.current?.lenis?.raf(time * 1000);
        }

        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(update);
        };
    }, []);

    useEffect(() => {
        const lenis = lenisRef.current?.lenis;
        if (lenis) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        let debounceTimer = null;
        let lastHeight = document.documentElement.scrollHeight;

        const refreshScroll = () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                lenisRef.current?.lenis?.resize();
                // safe=true waits for any active momentum to settle before recalculating
                ScrollTrigger.refresh(true);
            }, 200);
        };

        const resizeObserver = new ResizeObserver(() => {
            const currentHeight = document.documentElement.scrollHeight;
            if (Math.abs(currentHeight - lastHeight) > 5) {
                lastHeight = currentHeight;
                refreshScroll();
            }
        });

        resizeObserver.observe(document.body);
        document.fonts?.ready.then(refreshScroll);

        return () => {
            clearTimeout(debounceTimer);
            resizeObserver.disconnect();
            if (lenis) {
                lenis.off('scroll', ScrollTrigger.update);
            }
        };
    }, []);

    return (
        <ReactLenis root ref={lenisRef} options={LENIS_OPTIONS}>
            <Suspense fallback={null}>
                <LenisRouteReset />
            </Suspense>
            {children}
        </ReactLenis>
    );
}
