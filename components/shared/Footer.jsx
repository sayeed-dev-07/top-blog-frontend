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
        <footer ref={footerRef} className="w-full border-t flex justify-center items-center border-black bg-[#fafafa] mt-auto">
            <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-12 md:py-16">

                <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-black pb-12">

                    {/* Brand Section */}
                    <div className="flex flex-col gap-4 max-w-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-4 h-4 bg-red-600 rounded-full shrink-0" />
                            <span className="font-sans text-2xl font-bold text-black">
                                Sayeed Shorif
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-[0.2em] leading-relaxed font-bold">
                            Digital Archive • デジタルアーカイブ
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            A collection of observations, thoughts, and minimalist web development.
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex  flex-col gap-4 min-w-[200px]">
                        <span className="text-[14px] text-gray-400 uppercase  mb-2">
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
                                        className="group inline-flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black hover:text-red-600 transition-colors"
                                    >
                                        <span className="link-dot w-1.5 h-1.5 bg-red-600 rounded-full opacity-0 scale-0 origin-center" />
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
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                    <p>© {new Date().getFullYear()} Sayeed Shorif. All rights reserved.</p>

                    <div className="flex items-center gap-4">
                        <span>Built with Next.js</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span>GSAP</span>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;