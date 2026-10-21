
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/shared/Loading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePosts } from '@/hooks/usePost';
import { useParams } from 'next/navigation';

const PostDetailPage = () => {
    const params = useParams();
    const postId = parseInt(params.id, 10);

    const { data, isLoading, isError } = usePosts();

    const posts = data?.data?.posts || data?.posts || [];
    const post = posts.find((p) => p.id === postId);

    const containerRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(
        () => {
            if (post) {
                gsap.fromTo(
                    '.reveal-item',
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.15,
                        ease: 'power3.out',
                    }
                );
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
            <div className="w-full max-w-3xl mx-auto px-3 sm:px-6 py-20 text-center">
                <div className="border border-black p-8 md:p-12 bg-[#fafafa]">
                    <h1 className="font-title text-3xl mb-4 text-black">
                        {isError ? 'Something went wrong' : 'Post not found'}
                    </h1>

                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                        {isError
                            ? "We couldn't load this post right now. Please try again later."
                            : "Looks like this post isn't here anymore, or the link might be incorrect."}
                    </p>

                    <Link
                        href="/"
                        className="inline-block border border-black bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
                    >
                        ← Back to all posts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <article
            ref={containerRef}
            className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-12 md:py-20"
        >
            {/* Top Navigation */}
            <div className="reveal-item flex flex-wrap items-center justify-between border-b border-black pb-6 gap-x-6 gap-y-3 mb-4 sm:mb-10">
                <Link
                    href="/"
                    className="text-xs font-semibold   text-black hover:text-red-600 transition-colors flex items-center gap-2"
                >
                    <span className="-translate-y-px">←</span>
                    Back to posts
                </Link>

                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full shrink-0" />

                    <span className="text-[12px] text-gray-500  font-semibold">
                        A note from the blog
                    </span>
                </div>
            </div>

            {/* Post Header */}
            <header className="reveal-item mb-6 sm:mb-12">
                <h1 className="font-title text-4xl md:text-6xl text-black leading-tight mb-6">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-[14px]   font-semibold text-gray-500">
                    <time dateTime={post.createdAt}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>

                    <span className="w-1 h-1 bg-black rounded-full" />

                    <span>A personal note</span>
                </div>
            </header>

            {/* Hero Image */}
            {post.imgLink && (
                <div className="reveal-item relative w-full h-[40vh] md:h-[60vh] border border-black mb-6 sm:mb-12  max-w-[600px] overflow-hidden bg-[#fafafa]">
                    <Image
                        src={post.imgLink}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="object-cover"
                    />
                </div>
            )}

            {/* Post Content */}
            <div
                ref={contentRef}
                className="reveal-item prose max-w-none prose-p:text-base prose-p:leading-loose prose-p:text-gray-800 prose-p:mb-8"
            >
                <p>{post.content}</p>
            </div>

            {/* Footer */}
            <footer className="reveal-item mt-20 border-t border-black pt-10">
                <p className="text-center text-sm text-gray-500 leading-relaxed">
                    Thanks for stopping by and taking the time to read.
                </p>

                <div className="mt-8 flex items-center justify-center gap-4">
                    <div className="w-8 h-px bg-black" />
                    <div className="w-3 h-3 border border-red-600 rotate-45" />
                    <div className="w-8 h-px bg-black" />
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-black hover:text-red-600 transition-colors"
                    >
                        ← Read something else
                    </Link>
                </div>
            </footer>
        </article>
    );
};

export default PostDetailPage;
