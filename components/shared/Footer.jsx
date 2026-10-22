'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Footer = () => {
    const footerRef = useRef(null);

    const { contextSafe } = useGSAP({ scope: footerRef });

    const handleLinkEnter = contextSafe((event) => {
        const text = event.currentTarget.querySelector('.link-text');
        const dot = event.currentTarget.querySelector('.link-dot');

        gsap.to(text, { x: 4, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3, ease: 'power2.out' });
    });

    const handleLinkLeave = contextSafe((event) => {
        const text = event.currentTarget.querySelector('.link-text');
        const dot = event.currentTarget.querySelector('.link-dot');

        gsap.to(text, { x: 0, duration: 0.3, ease: 'power2.out' });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.3, ease: 'power2.out' });
    });

    const footerLinks = [
        { name: 'Archive', href: '/' },
        { name: 'GitHub', href: 'https://github.com/sayeed-dev-07' },
        { name: 'Portfolio', href: 'https://sayeed-shorif-01.vercel.app/' },
        { name: 'Contact', href: 'mailto:expsayeedshorif@gmail.com' },
    ];

    return (
        <footer ref={footerRef} className="w-full border-t-2 border-dashed border-[#9b8e84]/60 bg-[#fffaf0] mt-auto">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">

                <div className="flex flex-col md:flex-row justify-between gap-12 border-b-2 border-dashed border-[#9b8e84]/40 pb-12">

                    {/* Brand Section */}
                    <div className="flex flex-col gap-4 max-w-sm">
                        <div className="flex items-center gap-3">
                            <span aria-hidden="true" className="text-2xl text-rose-500 -rotate-12">✿</span>
                            <span className="font-title text-2xl font-semibold text-[#29221f]">
                                Sayeed Shorif
                            </span>
                        </div>
                        <p className="inline-flex items-center self-start rounded-full border-2 border-[#29221f] bg-[#ffe5d5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29221f] shadow-[2px_2px_0_#29221f] -rotate-1">
                            Digital Archive • デジタルアーカイブ
                        </p>
                        <p className="text-sm text-[#514943] mt-2 font-medium leading-relaxed">
                            A collection of observations, thoughts, and minimalist web development.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col gap-4 min-w-[200px]">
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#9b8e84] mb-2">
                            Navigation
                        </span>
                        <ul className="flex flex-col gap-3">
                            {footerLinks.map((link, index) => (
                                <li key={index}>
                                    <Link
                                        href={link.href}
                                        target={link.name === 'Archive' ? '_self' : '_blank'}
                                        onMouseEnter={handleLinkEnter}
                                        onMouseLeave={handleLinkLeave}
                                        className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#29221f] hover:text-rose-600 transition-colors"
                                    >
                                        <span className="link-dot flex items-center justify-center opacity-0 scale-0 origin-center text-rose-500">
                                            ♡
                                        </span>
                                        <span className="link-text origin-left">
                                            {link.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-[11px] text-[#62564e] font-bold tracking-widest uppercase">
                    <p>© {new Date().getFullYear()} Sayeed Shorif. All rights reserved.</p>

                    <div className="flex items-center gap-4">
                        <span>Built with Next.js</span>
                        <span aria-hidden="true" className="text-rose-400">✳</span>
                        <span>GSAP</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;