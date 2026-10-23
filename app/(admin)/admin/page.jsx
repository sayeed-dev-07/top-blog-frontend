'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/shared/Loading';
import Image from 'next/image';
import { useIsAdmin } from '@/hooks/useAdmin';
import {
    useCreatePost,
    usePosts,
    usePublishPost,
    useUnpublishPost,
    useDeletePost
} from '@/hooks/usePost';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Circle } from 'lucide-react';

const AdminDashboard = () => {
    const { isAdmin, isLoading: isAdminLoading } = useIsAdmin();
    const { data, isLoading: isPostsLoading } = usePosts();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imgLink, setImgLink] = useState('');
    const [formError, setFormError] = useState('');

    // TanStack Query Mutations - Destructured to capture specific errors
    const { mutate: createPost, isPending: isCreating, isError: isCreateError, error: createError } = useCreatePost();
    const { mutate: publishPost, isPending: isPublishing, variables: publishingPostId, isError: isPubError, error: pubError } = usePublishPost();
    const { mutate: unpublishPost, isPending: isUnpublishing, variables: unpublishingPostId, isError: isUnpubError, error: unpubError } = useUnpublishPost();
    const { mutate: deletePost, isPending: isDeleting, variables: deletingPostId, isError: isDelError, error: delError } = useDeletePost();

    // Combine list action errors into one variable for easy rendering
    const listErrorMsg =
        (isPubError && (pubError?.message || "Failed to publish post.")) ||
        (isUnpubError && (unpubError?.message || "Failed to unpublish post.")) ||
        (isDelError && (delError?.message || "Failed to delete post."));

    const posts = data?.data?.posts || data?.posts || [];
    const sortedPosts = [...posts].sort((a, b) => Number(b.published) - Number(a.published));
    const publishedPostsCount = sortedPosts.filter((post) => post.published).length;
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
        setFormError('');

        if (!title.trim() || !content.trim() || !imgLink.trim()) {
            setFormError('All fields must contain valid text, not just spaces.');
            return;
        }

        createPost(
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

    if (isAdminLoading || (isAdmin && isPostsLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <main className="flex min-h-[60vh] items-center justify-center px-4 py-16">
                <section className="w-full max-w-xl rounded-[1.5rem] border-2 border-[#29221f] bg-[#fffaf0] p-8 text-center shadow-[6px_7px_0_#29221f] sm:p-12">
                    <span aria-hidden="true" className="mb-4 inline-block text-5xl text-rose-400">✿</span>
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-rose-600">Admin area</p>
                    <h1 className="mb-4 font-title text-3xl text-[#29221f] sm:text-4xl">You can’t access this page.</h1>
                    <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-[#62564e] sm:text-base">
                        This page is for blog administrators. Your account doesn’t have admin access, so the post controls aren’t available here. You can head back to the blog and keep reading.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center rounded-full border-2 border-[#29221f] bg-[#29221f] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_4px_0_#29221f] transition hover:-translate-y-0.5 hover:shadow-[4px_5px_0_#29221f]"
                    >
                        Back to the blog
                    </Link>
                </section>
            </main>
        );
    }

    // Check if any list action is running to prevent double-clicks
    const isListActionPending = isPublishing || isUnpublishing || isDeleting;

    return (
        <div ref={containerRef} className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 relative">

            {/* Background Decor */}
            <span aria-hidden="true" className="absolute top-10 right-10 text-6xl text-rose-500/10 -rotate-12 pointer-events-none">✿</span>
            <span aria-hidden="true" className="absolute bottom-40 left-0 text-8xl text-teal-600/10 rotate-12 pointer-events-none">✳</span>

            {/* Header */}
            <header className="reveal-item mb-14 border-b-2 border-dashed border-[#9b8e84]/60 pb-8 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#29221f] bg-[#d8f3e8] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29221f] shadow-[2px_2px_0_#29221f] -rotate-1 mb-4">
                    <span className="text-teal-600">✳</span>
                    Control Panel
                </div>

                <h1 className="font-title text-4xl md:text-5xl lg:text-6xl text-[#29221f] leading-tight mb-4">
                    Your corner of the internet.
                </h1>

                <p className="text-base md:text-lg text-[#62564e] font-medium max-w-xl leading-relaxed">
                    A place to share what you&apos;re learning, put your thoughts into
                    words, and keep your stories growing.
                </p>
            </header>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10">
                {/* LEFT COLUMN: Create Post Form */}
                <section className="reveal-item w-full lg:w-[35%]">
                    <div className="bg-[#fffaf0] rounded-[1.4rem] border-2 border-[#29221f] shadow-[6px_8px_0_#29221f] p-6 md:p-8 lg:sticky lg:top-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span aria-hidden="true" className="text-2xl text-rose-500">✿</span>
                            <h2 className="font-title text-2xl text-[#29221f]">
                                Write something new
                            </h2>
                        </div>

                        {/* Local Validation Error */}
                        {formError && (
                            <div className="mb-6 rounded-xl border-2 border-rose-500 bg-rose-50 p-3 text-xs font-bold text-rose-700 shadow-[2px_2px_0_#f43f5e]">
                                {formError}
                            </div>
                        )}

                        {/* Create Post API Error */}
                        {isCreateError && (
                            <div className="mb-6 rounded-xl border-2 border-rose-500 bg-rose-50 p-3 text-xs font-bold text-rose-700 shadow-[2px_2px_0_#f43f5e]">
                                {createError?.message || 'Failed to create post. Try again.'}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-[#514943]">
                                    Title <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full rounded-xl border-2 border-[#29221f] bg-white px-4 py-3 text-sm text-[#29221f] placeholder:text-[#9b8e84] shadow-[2px_2px_0_#29221f] focus:outline-none focus:shadow-[4px_4px_0_#29221f] focus:-translate-y-0.5 transition-all"
                                    placeholder="Give your post a title"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="imglink" className="text-xs font-bold uppercase tracking-widest text-[#514943]">
                                    Cover image <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    name="imglink"
                                    id="imglink"
                                    value={imgLink}
                                    onChange={(e) => setImgLink(e.target.value)}
                                    className="w-full rounded-xl border-2 border-[#29221f] bg-white px-4 py-3 text-sm text-[#29221f] placeholder:text-[#9b8e84] shadow-[2px_2px_0_#29221f] focus:outline-none focus:shadow-[4px_4px_0_#29221f] focus:-translate-y-0.5 transition-all"
                                    placeholder="Paste an image URL"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="content" className="text-xs font-bold uppercase tracking-widest text-[#514943]">
                                    Content <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    name="content"
                                    id="content"
                                    rows={8}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full rounded-xl border-2 border-[#29221f] bg-white px-4 py-3 text-sm text-[#29221f] placeholder:text-[#9b8e84] shadow-[2px_2px_0_#29221f] focus:outline-none focus:shadow-[4px_4px_0_#29221f] focus:-translate-y-0.5 transition-all resize-y leading-relaxed"
                                    placeholder="Start writing here..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="mt-2 w-full flex items-center justify-center gap-3 rounded-xl border-2 border-[#29221f] bg-[#29221f] text-white px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-[3px_4px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[4px_6px_0_#29221f] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {isCreating ? <Circle className="w-4 h-4 animate-spin" /> : 'Publish thought'}
                            </button>
                        </form>
                    </div>
                </section>

                {/* RIGHT COLUMN: Posts */}
                <section className="w-full lg:w-[65%] min-w-0">
                    <div className="reveal-item flex items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="font-title text-3xl text-[#29221f] mb-2">
                                Your posts
                            </h2>
                            <p className="text-sm font-medium text-[#62564e]">
                                Everything you&apos;ve written, all in one place.
                            </p>
                        </div>

                        <span className="hidden sm:inline-flex items-center justify-center rounded-full border-2 border-[#29221f] bg-white px-4 py-1.5 text-sm font-bold text-[#29221f] shadow-[2px_2px_0_#29221f]">
                            {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                        </span>
                    </div>

                    {/* Action Error Banner (Publish/Unpublish/Delete) */}
                    {listErrorMsg && (
                        <div className="reveal-item mb-6 flex items-start gap-3 rounded-xl border-2 border-rose-500 bg-rose-50 p-4 text-[#29221f] shadow-[2px_2px_0_#f43f5e]">
                            <div className="text-sm">
                                <p className="font-bold mb-1 text-rose-700">Action Failed</p>
                                <p className="text-[#62564e] font-medium">{listErrorMsg}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-6">
                        {posts.length === 0 ? (
                            <div className="reveal-item rounded-[1.4rem] border-2 border-[#29221f] bg-[#f1fbf7] shadow-[4px_5px_0_#29221f] p-8 md:p-12 text-center">
                                <h3 className="font-title text-2xl text-[#29221f] mb-3">
                                    Nothing here just yet.
                                </h3>
                                <p className="text-base text-[#62564e] font-medium leading-relaxed max-w-md mx-auto">
                                    Every good blog starts somewhere. Write your first post and
                                    give your little corner of the internet a beginning.
                                </p>
                            </div>
                        ) : (
                            sortedPosts.map((post, index) => (
                                <React.Fragment key={post.id}>
                                    {index === 0 && (
                                        <div className="flex items-center gap-3 pt-2">
                                            <span className="text-xs font-bold uppercase tracking-widest text-[#62564e]">
                                                {post.published ? 'Published Posts' : 'Unpublished Posts'}
                                            </span>
                                            <div className="h-px flex-1 bg-[#9b8e84]/50" />
                                        </div>
                                    )}
                                    {!post.published && index === publishedPostsCount && publishedPostsCount > 0 && (
                                        <div className="flex items-center gap-3 pt-4">
                                            <div className="h-px flex-1 bg-[#9b8e84]/70" />
                                            <span className="text-xs font-bold uppercase tracking-widest text-[#62564e]">
                                                Unpublished Posts
                                            </span>
                                            <div className="h-px flex-1 bg-[#9b8e84]/70" />
                                        </div>
                                    )}
                                    <article
                                    className="reveal-item flex flex-col sm:flex-row bg-[#fdfcfb] rounded-[1.4rem] border-2 border-[#29221f] shadow-[4px_5px_0_#29221f] overflow-hidden"
                                >
                                    {/* Thumbnail */}
                                    <div className="relative w-full sm:w-48 h-48 sm:h-auto border-b-2 sm:border-b-0 sm:border-r-2 border-[#29221f] bg-[#f3e9df] shrink-0 overflow-hidden">
                                        {post.imgLink ? (
                                            <Image
                                                src={post.imgLink}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 640px) 100vw, 192px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full min-h-[12rem] flex flex-col items-center justify-center gap-1 text-[#62564e]">
                                                <span aria-hidden="true" className="font-title text-4xl">✿</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content and Actions */}
                                    <div className="p-5 md:p-7 flex flex-col flex-1 min-w-0 gap-5">
                                        <div>
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <span className="text-xs font-bold uppercase tracking-widest text-[#9b8e84]">
                                                    ID #{post.id}
                                                </span>

                                                <span
                                                    className={`inline-flex items-center gap-2 rounded-full border-2 border-[#29221f] px-3 py-1 text-[10px] font-bold uppercase tracking-widest shadow-[2px_2px_0_#29221f] ${post.published
                                                        ? 'bg-[#d8f3e8] text-[#29221f]'
                                                        : 'bg-[#ffe5d5] text-[#29221f]'
                                                        }`}
                                                >
                                                    <span
                                                        className={`w-2 h-2 rounded-full ${post.published ? 'bg-teal-500' : 'bg-rose-500'
                                                            }`}
                                                    />
                                                    {post.published ? 'Published' : 'Draft'}
                                                </span>
                                            </div>

                                            <h3 className="font-title text-xl md:text-2xl font-semibold text-[#29221f] leading-snug mb-3">
                                                {post.title}
                                            </h3>

                                            <p className="text-sm text-[#62564e] font-medium leading-relaxed line-clamp-2">
                                                {post.content}
                                            </p>
                                        </div>

                                        {/* Actions */}
                                        <div className="mt-auto pt-5 border-t-2 border-dashed border-[#9b8e84]/40 flex flex-wrap items-center gap-3">
                                            <Link
                                                href={`/posts/${post.id}`}
                                                className="inline-flex items-center justify-center rounded-xl border-2 border-[#29221f] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#29221f] shadow-[2px_2px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#29221f] transition-all"
                                            >
                                                View
                                                <span aria-hidden="true" className="ml-2 text-sm leading-none">↗</span>
                                            </Link>

                                            {post.published ? (
                                                <button
                                                    type="button"
                                                    onClick={() => unpublishPost(post.id)}
                                                    disabled={isListActionPending}
                                                    className="inline-flex items-center justify-center rounded-xl border-2 border-[#29221f] bg-[#ffe5d5] px-4 py-2 text-[10px] font-bold uppercase tracking-widest cursor-pointer text-[#29221f] shadow-[2px_2px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#29221f] transition-all disabled:opacity-50"
                                                >
                                                    {isUnpublishing && unpublishingPostId === post.id ? 'Unpublishing' : 'Unpublish'}
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => publishPost(post.id)}
                                                    disabled={isListActionPending}
                                                    className="inline-flex items-center justify-center cursor-pointer rounded-xl border-2 border-[#29221f] bg-[#d8f3e8] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#29221f]  shadow-[2px_2px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#29221f] transition-all disabled:opacity-50"
                                                >
                                                    {isPublishing && publishingPostId === post.id ? 'Publishing' : 'Publish'}
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => deletePost(post.id)}
                                                disabled={isListActionPending}
                                                className="inline-flex items-center justify-center cursor-pointer rounded-xl border-2 border-rose-500 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-rose-600 shadow-[2px_2px_0_#f43f5e] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_#f43f5e] transition-all ml-auto disabled:opacity-50"
                                            >
                                                {isDeleting && deletingPostId === post.id ? 'Deleting' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                    </article>
                                </React.Fragment>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
