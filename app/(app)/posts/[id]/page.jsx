'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/shared/Loading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePosts } from '@/hooks/usePost';
import { useParams } from 'next/navigation';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const diaryAccents = [
    {
        color: '#dc2626',
        marker: '#fecaca',
        markerPath: 'M 5,19 C 12,4 35,5 59,8 C 82,10 104,4 115,15 C 121,26 101,31 77,29 C 49,27 17,34 6,25 C 2,23 2,21 5,19 Z',
        underline: 'M 0,8 Q 45,12 100,5',
    },
    {
        color: '#0f766e',
        marker: '#99f6e4',
        markerPath: 'M 4,13 C 17,7 36,12 52,7 C 73,2 100,9 116,13 L 112,27 C 88,24 74,31 52,27 C 31,23 15,31 5,24 Z',
        underline: 'M 0,5 C 24,12 55,1 77,7 S 94,11 100,4',
    },
    {
        color: '#7c3aed',
        marker: '#ddd6fe',
        markerPath: 'M 8,12 C 18,3 38,9 55,6 C 79,2 101,8 114,13 L 108,25 C 87,31 67,24 48,29 C 31,33 13,27 7,23 Z',
        underline: 'M 0,7 Q 28,2 48,8 T 100,6',
    },
    {
        color: '#c2410c',
        marker: '#fed7aa',
        markerPath: 'M 6,15 C 15,7 31,11 42,8 C 60,3 75,11 91,7 C 105,4 116,13 112,22 C 108,31 87,26 72,29 C 48,34 22,27 9,26 C 2,25 1,19 6,15 Z',
        underline: 'M 0,6 C 16,11 31,4 48,8 S 78,12 100,5',
    },
];

const renderDiaryText = (text) => {
    if (!text) return null;
    const parts = text.split(/(\s+)/);
    let wordIndex = 0;

    return parts.map((part, index) => {
        if (/^\s+$/.test(part)) return part;

        const currentWordIndex = wordIndex++;

        if (currentWordIndex > 0 && currentWordIndex % 13 === 5 && part.length >= 4) {
            const accent = diaryAccents[Math.floor(currentWordIndex / 13) % diaryAccents.length];
            return (
                <span key={index} className="highlight-wrapper relative inline-block mx-[0.08em] px-[0.04em]">
                    <span className="relative z-10 font-bold">{part}</span>
                    <svg
                        aria-hidden="true"
                        className="absolute left-[-8%] top-[-8%] w-[116%] h-[116%] overflow-visible pointer-events-none z-0"
                        preserveAspectRatio="none"
                        viewBox="0 0 120 36"
                    >
                        <path
                            className="highlight-shape"
                            d={accent.markerPath}
                            fill={accent.marker}
                            opacity="0.68"
                            transform="rotate(-2 60 18)"
                        />
                    </svg>
                    <svg
                        aria-hidden="true"
                        className="absolute left-[-5%] bottom-[-0.18em] w-[110%] h-[0.34em] overflow-visible pointer-events-none z-0"
                        preserveAspectRatio="none"
                        viewBox="0 0 100 12"
                    >
                        <path
                            className="highlight-path"
                            d={accent.underline}
                            stroke={accent.color}
                            strokeWidth="2.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            );
        }
        return part;
    });
};

const PostDetailPage = () => {
    const params = useParams();
    const postId = parseInt(params.id, 10);

    const { data, isLoading, isError } = usePosts();

    const posts = data?.data?.posts || data?.posts || [];
    const post = posts.find((p) => p.id === postId);

    const containerRef = useRef(null);

    useGSAP(
        () => {
            if (post) {
                // 1. Initial page reveal animation
                gsap.fromTo(
                    '.reveal-item',
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.75,
                        stagger: 0.12,
                        ease: 'power3.out',
                    }
                );


                gsap.utils.toArray('.scroll-sticker').forEach((sticker) => {
                    gsap.fromTo(
                        sticker,
                        { scale: 0, opacity: 0 },
                        {
                            scale: 1,
                            opacity: 1,
                            duration: 0.7,
                            ease: 'back.out(2)',
                            scrollTrigger: {
                                trigger: sticker,
                                start: 'top 85%',

                            },
                        }
                    );
                });


                gsap.utils.toArray('.highlight-path').forEach((path) => {

                    const length = path.getTotalLength();


                    gsap.set(path, {
                        strokeDasharray: length,
                        strokeDashoffset: length
                    });


                    gsap.to(path, {
                        strokeDashoffset: 0,
                        duration: 0.6,
                        ease: 'power2.out',
                        scrollTrigger: {
                            trigger: path.closest('.highlight-wrapper'),
                            start: 'top 85%',

                        },
                    });
                });

                gsap.utils.toArray('.highlight-shape').forEach((shape) => {
                    gsap.fromTo(
                        shape,
                        { opacity: 0, scale: 0.88 },
                        {
                            opacity: 0.68,
                            scale: 1,
                            duration: 0.45,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: shape.closest('.highlight-wrapper'),
                                start: 'top 85%',
                            },
                        }
                    );
                });
            }
        },
        {
            scope: containerRef,
            dependencies: [post],
        }
    );

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (isError || !post) {
        return (
            <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-20">
                <div className="border border-black bg-[#fafafa] p-8 md:p-12">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">
                        A little detour
                    </span>

                    <h1 className="font-title text-3xl md:text-4xl text-black mt-4 mb-4">
                        {isError ? 'We hit a small snag.' : 'This post is missing.'}
                    </h1>

                    <p className="text-base text-gray-800 leading-relaxed mb-8 max-w-lg">
                        {isError
                            ? "Something went wrong while loading this post. Give it another try in a little while."
                            : "Looks like this post isn't here. It may have moved, or the link might not be right."}
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 bg-black text-white px-6 py-4 text-sm font-bold cursor-pointer hover:bg-red-600 transition-colors duration-200"
                    >
                        <span aria-hidden="true">←</span>
                        Back to all posts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article
            ref={containerRef}
            className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 overflow-visible"
        >
            {/* Navigation */}
            <nav className="reveal-item flex flex-wrap items-center justify-between gap-4 border-b border-black pb-5 mb-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-black cursor-pointer hover:text-red-600 transition-colors"
                >
                    <span className="text-lg" aria-hidden="true">←</span>
                    All posts
                </Link>

                <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    A little space on the internet
                </span>
            </nav>

            {/* Article Header */}
            <header className="reveal-item mb-8 md:mb-12">
                <p className="text-xs sm:text-sm font-bold text-red-600 mb-5">
                    A thought worth sharing
                </p>

                <h1 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black leading-[1.08] tracking-tight mb-7 break-words">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium text-gray-700">
                    <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>

                    <span className="w-1 h-1 bg-black rounded-full" />

                    <span>From my notebook</span>
                </div>
            </header>

            {/* Cover Image */}
            {post.imgLink && (
                <div className="reveal-item relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[620px] border border-black mb-10 md:mb-14 overflow-hidden bg-[#f2f2f2]">
                    <Image
                        src={post.imgLink}
                        alt={post.title}
                        fill
                        priority
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 976px"
                        className="object-cover"
                    />
                </div>
            )}

            {/* Article Content with Absolute Floating Stickers */}
            <div className="relative w-full max-w-3xl mx-auto">

                {/* Left Floating Image (Slightly higher) */}
                <div className="scroll-sticker hidden lg:block absolute -left-32 xl:-left-48 top-80 w-28 h-28 opacity-0 pointer-events-none select-none z-[-1]">
                    <Image
                        src="/img1.png"
                        alt="Decorative element"
                        fill
                        className="object-contain drop-shadow-sm"
                    />
                </div>

                {/* Right Floating Image (Slightly lower) */}
                <div className="scroll-sticker hidden lg:block absolute -right-32 xl:-right-48 top-190 w-32 h-32 opacity-0 pointer-events-none select-none z-[-1]">
                    <Image
                        src="/img2.png"
                        alt="Decorative element"
                        fill
                        className="object-contain drop-shadow-sm"
                    />
                </div>

                {/* Text Content */}
                <div className="reveal-item">
                    <div className="border-l-2 border-red-600 pl-5 sm:pl-7 mb-10">
                        <p className="text-base sm:text-lg text-gray-800 leading-relaxed">
                            A few thoughts, a few things I&apos;ve learned, and a moment to
                            slow down and put them into words.
                        </p>
                    </div>

                    <div className="text-[17px] md:text-lg text-gray-900 leading-[1.95] whitespace-pre-line break-words">
                        {/* Decorate selected words with animated SVG marker strokes. */}
                        {renderDiaryText(post.content)}
                    </div>
                </div>
            </div>

            {/* Article Footer */}
            <footer className="reveal-item mt-16 md:mt-24 border-t border-black pt-8 md:pt-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                    <div className="max-w-md">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-3">
                            That&apos;s all for now
                        </p>

                        <h2 className="font-title text-2xl md:text-3xl text-black leading-tight mb-3">
                            Thanks for reading.
                        </h2>

                        <p className="text-sm md:text-base text-gray-800 leading-relaxed">
                            Hope you found something here worth thinking about. There&apos;s
                            always another story around the corner.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-3 bg-black text-white px-6 py-4 text-sm font-bold cursor-pointer hover:bg-red-600 transition-colors duration-200 shrink-0"
                    >
                        Read another post
                        <span aria-hidden="true">→</span>
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="w-10 h-px bg-black" />
                    <div className="w-3 h-3 border border-red-600 rotate-45" />
                    <div className="w-10 h-px bg-black" />
                </div>
            </footer>
        </article>
    );
};

export default PostDetailPage;
