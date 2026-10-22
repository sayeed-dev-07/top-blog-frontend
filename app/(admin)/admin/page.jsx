'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/shared/Loading';
import Image from 'next/image';
import { useIsAdmin } from '@/hooks/useAdmin';
import { useCreatePost, usePosts } from '@/hooks/usePost';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AdminDashboard = () => {
    const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
    const { data, isLoading: isPostsLoading } = usePosts();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [formError, setFormError] = useState('');

    const { mutate, isPending, isError, error } = useCreatePost();

    const posts = data?.data?.posts || data?.posts || [];
    const containerRef = useRef(null);

    const { contextSafe } = useGSAP(
        () => {
            if (!isAdminLoading && isAdmin && !isPostsLoading) {
                gsap.fromTo(
                    '.reveal-item',
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.65,
                        stagger: 0.08,
                        ease: 'power3.out',
                    }
                );
            }
        },
        {
            scope: containerRef,
            dependencies: [isAdminLoading, isPostsLoading, isAdmin, posts.length],
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(''); // Reset errors on new attempt

        // Validate that no field is purely empty or spaces
        if (!title.trim() || !content.trim() || !imgLink.trim()) {
            setFormError('All fields must contain valid text, not just spaces.');
            return;
        }

        // Trigger TanStack mutation
        mutate(
            {
                title: title.trim(),
                content: content.trim(),
                imgLink: imgLink.trim(),
            },
            {
                onSuccess: () => {
                    setTitle('');
                    setContent('');
                    setImgLink('');
                },
            }
        );
    };

    if (isAdminLoading || isPostsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <div
            ref={containerRef}
            className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-12 md:py-20"
        >
            {/* Header */}
            <header className="reveal-item mb-14 border-b border-black pb-8">
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-3 h-3 bg-red-600 rounded-full shrink-0" />

                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">
                        Your writing space
                    </span>
                </div>

                <h1 className="font-title text-4xl md:text-6xl text-black leading-tight mb-4">
                    Your corner of the internet.
                </h1>

                <p className="text-base md:text-lg text-gray-700 max-w-xl leading-relaxed">
                    A place to share what you&apos;re learning, put your thoughts into
                    words, and keep your stories growing.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                {/* LEFT COLUMN: Create Post Form */}
                <section className="reveal-item w-full lg:w-1/3">
                    <div className="bg-[#fafafa] border border-black p-4 sm:p-6 md:p-8 lg:sticky lg:top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="w-2 h-2 bg-red-600 rounded-full" />

                            <h2 className="text-base font-bold text-black">
                                Write something new
                            </h2>
                        </div>

                        <p className="text-sm text-gray-700 leading-relaxed mb-6">
                            Got an idea on your mind? Start here and turn it into a post.
                        </p>

                        {/* Local Validation Error */}
                        {formError && (
                            <div className="mb-6 border border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-widest text-red-600">
                                {formError}
                            </div>
                        )}

                        {/* API Error from TanStack */}
                        {isError && (
                            <div className="mb-6 border border-red-600 bg-red-50 p-4 text-xs font-bold uppercase tracking-widest text-red-600">
                                {error?.message || 'Failed to create post. Try again.'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="title"
                                    className="text-xs font-bold text-gray-800"
                                >
                                    What&apos;s the post about?
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full border border-gray-400 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                    placeholder="Give your post a title"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="imglink"
                                    className="text-xs font-bold text-gray-800"
                                >
                                    Cover image
                                </label>

                                <input
                                    type="url"
                                    name="imglink"
                                    id="imglink"
                                    value={imgLink}
                                    onChange={(e) => setImgLink(e.target.value)}
                                    className="w-full border border-gray-400 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                    placeholder="Paste an image URL"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="content"
                                    className="text-xs font-bold text-gray-800"
                                >
                                    Your thoughts
                                </label>

                                <textarea
                                    name="content"
                                    id="content"
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full border border-gray-400 bg-white px-4 py-3 text-sm text-black placeholder:text-gray-500 focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-y leading-relaxed"
                                    placeholder="Start writing here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className={`mt-2 w-full flex items-center justify-center gap-3 border border-black px-6 py-4 text-sm font-bold transition-colors duration-200 ${isPending
                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    : 'bg-black text-white cursor-pointer hover:bg-red-600 hover:border-red-600'
                                    }`}
                            >
                                {isPending ? 'Publishing...' : 'Publish your thoughts'}
                                {!isPending && <span aria-hidden="true">→</span>}
                            </button>
                        </form>
                    </div>
                </section>

                {/* RIGHT COLUMN: Posts */}
                <section className="w-full lg:w-2/3 min-w-0">
                    <div className="reveal-item flex items-end justify-between gap-4 mb-8 border-b border-black pb-5">
                        <div>
                            <h2 className="font-title text-2xl md:text-3xl text-black mb-2">
                                Your posts
                            </h2>

                            <p className="text-sm text-gray-700">
                                Everything you&apos;ve written, all in one place.
                            </p>
                        </div>

                        <span className="shrink-0 text-sm font-bold text-black border border-black px-3 py-2">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                        </span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {posts.length === 0 ? (
                            <div className="reveal-item border border-black p-8 md:p-12 bg-[#fafafa]">
                                <h3 className="font-title text-2xl text-black mb-3">
                                    Nothing here just yet.
                                </h3>

                                <p className="text-base text-gray-700 leading-relaxed max-w-md">
                                    Every good blog starts somewhere. Write your first post and
                                    give your little corner of the internet a beginning.
                                </p>
                            </div>
                        ) : (
                            posts.map((post) => (
                                <article
                                    key={post.id}
                                    className="reveal-item flex flex-col sm:flex-row bg-white border border-black overflow-hidden"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-full sm:w-52 h-48 sm:h-auto sm:min-h-56 border-b sm:border-b-0 sm:border-r border-black bg-[#f5f5f5] shrink-0 overflow-hidden">
                                        {post.imgLink ? (
                                            <Image
                                                src={post.imgLink}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 208px"
                                                className="post-thumbnail object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full min-h-40 flex items-center justify-center text-sm text-gray-500">
                                                No cover image
                                            </div>
                                        )}
                                    </div>

                                    {/* Content and Actions */}
                                    <div className="p-5 md:p-7 flex flex-col flex-1 min-w-0 gap-5">
                                        <div>
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <span className="text-xs font-medium text-gray-600">
                                                    Post #{post.id}
                                                </span>

                                                <span
                                                    className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 border ${post.published
                                                        ? 'border-green-700 text-green-800 bg-green-50'
                                                        : 'border-amber-700 text-amber-900 bg-amber-50'
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${post.published
                                                            ? 'bg-green-600'
                                                            : 'bg-amber-500'
                                                            }`}
                                                    />

                                                    {post.published ? 'Published' : 'Still a draft'}
                                                </span>
                                            </div>

                                            <h3 className="font-title text-xl md:text-2xl font-semibold text-black leading-snug mb-3">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm md:text-base text-gray-800 leading-relaxed line-clamp-3">
                                                {post.content}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto pt-5 border-t border-gray-300 flex flex-wrap items-center gap-3">
                                            <Link
                                                href={`/posts/${post.id}`}
                                                className="inline-flex items-center justify-center gap-2 bg-black text-white px-4 py-3 text-xs font-bold cursor-pointer hover:bg-red-600 transition-colors duration-200"
                                            >
                                                Read post
                                                <span aria-hidden="true">↗</span>
                                            </Link>

                                            {post.published ? (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center border border-gray-400 text-gray-900 px-4 py-3 text-xs font-bold cursor-pointer hover:border-black hover:bg-gray-100 transition-colors duration-200"
                                                >
                                                    Move to drafts
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center justify-center border border-black text-black px-4 py-3 text-xs font-bold cursor-pointer hover:bg-black hover:text-white transition-colors duration-200"
                                                >
                                                    Publish post
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(post.id)}
                                                className="inline-flex items-center justify-center border border-red-600 text-red-600 px-4 py-3 text-xs font-bold cursor-pointer hover:bg-red-600 hover:text-white transition-colors duration-200"
                                            >
                                                Delete post
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;