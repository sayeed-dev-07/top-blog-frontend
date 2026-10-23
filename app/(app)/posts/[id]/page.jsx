'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Loading from '@/components/shared/Loading';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { usePosts } from '@/hooks/usePost';
import { useComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/hooks/useComment';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useParams } from 'next/navigation';



// Register ScrollTrigger
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// --- PRESERVED: Your highlight data and parser logic ---
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
                    <span className="relative z-10 font-bold text-[#29221f]">{part}</span>
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
// --------------------------------------------------------

const PostDetailPage = () => {
    const params = useParams();
    const postId = parseInt(params.id, 10);
    

    const { data, isLoading, isError } = usePosts();
    const { data: commentsData, isLoading: isCommentsLoading, isError: isCommentsError } = useComments(postId);
    const { user, isLoading: isUserLoading } = useCurrentUser();
    const isAdmin = user?.admin === true;
    const { mutate: createComment, isPending: isCreatingComment, error: createCommentError } = useCreateComment();
    const { mutate: updateComment, isPending: isUpdatingComment, variables: updatingVariables, error: updateCommentError } = useUpdateComment();
    const { mutate: deleteComment, isPending: isDeletingComment, variables: deletingVariables, error: deleteCommentError } = useDeleteComment();
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingContent, setEditingContent] = useState('');

    const posts = data?.data?.posts || data?.posts || [];
    const post = posts.find((p) => p.id === postId);
    const comments = commentsData?.data?.comments || commentsData?.comments || commentsData?.data || commentsData;
    const commentList = Array.isArray(comments) ? comments : [];
    const currentUserId = user?.id;

    const getCommentAuthorId = (comment) => {
        const author = comment.author ?? comment.user;
        return comment.authorId ?? comment.userId ??
            (typeof author === 'object' && author !== null
                ? author.id ?? author._id ?? author.userId
                : author);
    };

    const canManageComment = (comment) => {
        const authorId = getCommentAuthorId(comment);
        return isAdmin || (
            currentUserId != null && authorId != null &&
            String(currentUserId) === String(authorId)
        );
    };

    const handleCreateComment = (event) => {
        event.preventDefault();
        const content = newComment.trim();
        if (!content) return;

        createComment({ postId, content, username: user?.username }, {
            onSuccess: () => setNewComment(''),
        });
    };

    const handleUpdateComment = (event, commentId) => {
        event.preventDefault();
        const content = editingContent.trim();
        if (!content) return;

        updateComment({ postId, commentId, content }, {
            onSuccess: () => {
                setEditingCommentId(null);
                setEditingContent('');
            },
        });
    };

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

                // 2. Sticker animation
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

                // 3. Highlight Underlines (Preserved)
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
                        delay: 0.2,
                        scrollTrigger: {
                            trigger: path.closest('.highlight-wrapper'),
                            start: 'top 85%',
                        },
                    });
                });

                // 4. Highlight Markers (Preserved)
                gsap.utils.toArray('.highlight-shape').forEach((shape) => {
                    gsap.fromTo(
                        shape,
                        { opacity: 0, scale: 0.88 },
                        {
                            opacity: 0.68,
                            scale: 1,
                            delay: 0.2,
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
                <div className="rounded-[1.4rem] border-2 border-[#29221f] bg-[#fffaf0] shadow-[4px_5px_0_#29221f] p-8 md:p-12 text-center my-12 relative overflow-hidden">
                    <span aria-hidden="true" className="absolute -right-4 -bottom-4 text-8xl text-[#ffe5d5] opacity-50 rotate-12">✿</span>

                    <p className="inline-block rounded-full border-2 border-[#29221f] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 mb-4 shadow-[2px_2px_0_#29221f] -rotate-2">
                        A little detour
                    </p>

                    <h1 className="font-title text-3xl md:text-4xl text-[#29221f] mb-4 relative z-10">
                        {isError ? 'We hit a small snag.' : 'This post is missing.'}
                    </h1>

                    <p className="text-base text-[#62564e] leading-relaxed mb-8 max-w-lg mx-auto relative z-10">
                        {isError
                            ? "Something went wrong while loading this post. Give it another try in a little while."
                            : "Looks like this post isn't here. It may have moved, or the link might not be right."}
                    </p>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-[#29221f] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[#29221f] shadow-[3px_4px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[4px_6px_0_#29221f] transition-all relative z-10"
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
            <nav className="reveal-item flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-[#9b8e84]/40 pb-6 mb-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#29221f] cursor-pointer hover:text-rose-600 transition-colors group"
                >
                    <span className="text-lg transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
                    All posts
                </Link>

                <span className="inline-flex items-center gap-2 rounded-full border-2 border-[#29221f] bg-[#f1fbf7] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#29221f] shadow-[2px_2px_0_#29221f] rotate-1">
                    <span className="text-teal-600">✳</span>
                    A little space on the internet
                </span>
            </nav>

            {/* Article Header */}
            <header className="reveal-item mb-8 md:mb-12">
                <p className="text-xs sm:text-sm font-bold text-rose-500 mb-5 tracking-wide">
                    A thought worth sharing
                </p>

                <h1 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#29221f] leading-[1.08] tracking-tight mb-7 break-words">
                    {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-[#62564e]">
                    <time dateTime={post.createdAt} className="bg-white/50 px-2 py-1 rounded-md">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>

                    <span aria-hidden="true" className="text-rose-400">♡</span>

                    <span>From my notebook</span>
                </div>
            </header>

            {/* Cover Image (Scrapbook style wrapper) */}
            {post.imgLink && (
                <div className="reveal-item relative w-full max-w-4xl mx-auto mb-12 md:mb-16">
                    <span aria-hidden="true" className="absolute -top-3 left-[14%] z-20 h-8 w-24 rotate-[-7deg] border-x border-white/40 bg-[#f2d89b]/85 shadow-sm" />
                    <span aria-hidden="true" className="absolute -top-3 right-[14%] z-20 h-8 w-24 rotate-[6deg] border-x border-white/40 bg-[#7c3aed]/90 shadow-sm" />

                    <div className="rounded-[1.8rem] border border-[#e4d1bd] bg-[#fffaf0] p-2.5 sm:p-3 ">
                        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[620px] overflow-hidden rounded-[1.25rem] border border-[#eadbca] bg-[#f3e9df]">
                            <Image
                                src={post.imgLink}
                                alt={post.title}
                                fill
                                priority
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 976px"
                                className="object-cover"
                            />
                            <span aria-hidden="true" className="pointer-events-none absolute inset-3 rounded-[0.9rem] border border-white/60" />
                        </div>
                        <div className="flex items-center justify-between gap-3 px-2 pt-3 sm:px-3 sm:pt-4">
                            <span className=" text-sm italic text-[#1d1b19] sm:text-base"><span className='text-[crimson] mt-1.5'>♡</span> a little moment, saved here</span>
                            <span aria-hidden="true" className="text-xl text-rose-400">✿</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Article Content with Absolute Floating Stickers */}
            <div className="relative w-full max-w-3xl mx-auto">

                {/* Left Floating Image (Slightly higher) */}
                <div className="scroll-sticker hidden lg:block absolute -left-32 xl:-left-48 top-80 w-28 h-28 rounded-2xl  opacity-0 pointer-events-none select-none z-[-1] rotate-3">

                    <Image
                        src="/img1.png"
                        alt="Decorative element"
                        fill
                        className="object-contain drop-shadow-sm p-2 rotate-6"
                    />
                </div>

                {/* Right Floating Image (Slightly lower) */}
                <div className="scroll-sticker hidden lg:block absolute -right-32 xl:-right-48 top-196 w-32 h-32  opacity-0 pointer-events-none select-none z-[-1] -rotate-3">

                    <Image
                        src="/img2.png"
                        alt="Decorative element"
                        fill
                        className="object-contain drop-shadow-sm p-2 -rotate-6"
                    />
                </div>

                {/* Text Content */}
                <div className="reveal-item">
                    <div className="border-l-4 border-rose-300 rounded-l-sm pl-5 sm:pl-7 mb-10 bg-gradient-to-r from-rose-50/50 to-transparent py-2">
                        <p className="text-base sm:text-lg text-[#62564e] font-medium leading-relaxed">
                            A few thoughts, a few things I&apos;ve learned, and a moment to
                            slow down and put them into words.
                        </p>
                    </div>

                    <div className="text-[17px] md:text-lg text-[#514943] leading-[1.95] whitespace-pre-line break-words">
                        {/* We use our custom parser here to inject the underlines */}
                        {renderDiaryText(post.content)}
                    </div>
                </div>
            </div>

            {/* Comments */}
            <section className="reveal-item mt-16 md:mt-20 max-w-3xl mx-auto border-t border-[#e7ddd2] pt-8" aria-labelledby="comments-heading">
                <div className="mb-7">
                    <h2 id="comments-heading" className="text-xl font-semibold text-[#29221f]">
                        Comments <span className="text-sm font-medium text-[#9b8e84]">({commentList.length})</span>
                    </h2>
                </div>

                {isCommentsError && (
                    <p role="alert" className="mb-5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                        Comments could not be loaded. Please refresh and try again.
                    </p>
                )}

                {isCommentsLoading ? (
                    <p className="mb-6 text-sm text-[#62564e]">Loading comments…</p>
                ) : commentList.length === 0 ? (
                    <p className="mb-6 text-sm text-[#62564e]">
                        No comments yet. Be the first to share a thought.
                    </p>
                ) : (
                    <div className="mb-8 flex flex-col gap-4">
                        {commentList.map((comment, index) => {
                            const commentId = comment.id ?? comment._id;
                            const author = comment.author ?? comment.user;
                            const commentAuthorId = getCommentAuthorId(comment);
                            const isOwnComment = currentUserId != null && commentAuthorId != null &&
                                String(currentUserId) === String(commentAuthorId);
                            const authorName = typeof author === 'object' && author !== null
                                ? author.username ?? author.name
                                : author;

                            const isEditing = editingCommentId === commentId;
                            const canManage = canManageComment(comment);

                            return (
                                <article key={commentId ?? index} className="rounded-xl border border-[#e7ddd2] bg-white p-4">
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <div className="text-xl flex font-semibold text-[#29221f] items-center justify-center">
                                            <Image src={'/profile.png'} alt='pp-img' height={40} width={40} />
                                            {authorName || comment.username || (isOwnComment ? user?.username : null) || 'Reader'}
                                        </div>
                                        {comment.createdAt && (
                                            <time dateTime={comment.createdAt} className="text-xs text-[#9b8e84]">
                                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'long', day: 'numeric',
                                                })}
                                            </time>
                                        )}
                                    </div>

                                    {isEditing ? (
                                        <form onSubmit={(event) => handleUpdateComment(event, commentId)} className="flex flex-col gap-3">
                                            <textarea
                                                value={editingContent}
                                                onChange={(event) => setEditingContent(event.target.value)}
                                                rows={3}
                                                maxLength={2000}
                                                required
                                                aria-label="Edit comment"
                                                className="w-full rounded-xl border-2 border-[#29221f] bg-white px-4 py-3 text-sm text-[#29221f] focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            />
                                            <div className="flex gap-2">
                                                <button type="submit" disabled={isUpdatingComment || !editingContent.trim()} className="rounded-lg border-2 border-[#29221f] bg-[#d8f3e8] px-4 py-2 text-xs cursor-pointer font-bold uppercase tracking-wide text-[#29221f] disabled:opacity-50">
                                                    {isUpdatingComment && updatingVariables?.commentId === commentId ? 'Saving…' : 'Save'}
                                                </button>
                                                <button type="button" onClick={() => { setEditingCommentId(null); setEditingContent(''); }} className="rounded-lg border-2 border-[#29221f] bg-white px-4 py-2 text-xs font-bold cursor-pointer uppercase tracking-wide text-[#29221f]">
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <p className="whitespace-pre-wrap wrap-break-word text-base leading-relaxed text-[#514943]">{comment.content}</p>
                                    )}

                                    {canManage && !isEditing && (
                                        <div className="mt-3 flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => { setEditingCommentId(commentId); setEditingContent(comment.content || ''); }}
                                                className="text-xs cursor-pointer font-medium text-[#62564e] hover:text-teal-700"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => deleteComment({ postId, commentId })}
                                                disabled={isDeletingComment}
                                                className="text-xs cursor-pointer font-medium text-rose-600 hover:text-rose-800 disabled:opacity-50"
                                            >
                                                {isDeletingComment && deletingVariables?.commentId === commentId ? 'Deleting…' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}

                {createCommentError && <p role="alert" className="mb-4 text-sm font-medium text-rose-700">{createCommentError.message || 'Comment could not be added.'}</p>}
                {updateCommentError && <p role="alert" className="mb-4 text-sm font-medium text-rose-700">{updateCommentError.message || 'Comment could not be updated.'}</p>}
                {deleteCommentError && <p role="alert" className="mb-4 text-sm font-medium text-rose-700">{deleteCommentError.message || 'Comment could not be deleted.'}</p>}

                {isUserLoading ? null : user ? (
                    <form onSubmit={handleCreateComment} className="rounded-xl border border-[#e7ddd2] bg-[#fffdf9] p-3">
                        <textarea
                            id="new-comment"
                            value={newComment}
                            onChange={(event) => setNewComment(event.target.value)}
                            rows={2}
                            maxLength={2000}
                            required
                            aria-label="Add a comment"
                            placeholder="Share a thoughtful response…"
                            className="w-full resize-y border-0 bg-transparent px-2 py-1 text-sm leading-relaxed text-[#29221f] placeholder:text-[#9b8e84] focus:outline-none"
                        />
                        <div className="mt-2 flex items-center justify-end gap-3 border-t border-[#eee6de] pt-2">
                            <span className="text-[11px] text-[#9b8e84]">{newComment.length}/2000</span>
                            <button type="submit" disabled={isCreatingComment || !newComment.trim()} className="rounded-lg bg-[#29221f] px-3 py-1.5 text-xs cursor-pointer font-semibold text-white hover:bg-teal-800 disabled:opacity-50">
                                {isCreatingComment ? 'Posting…' : 'Post comment'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-sm text-[#62564e]">
                        <Link href="/login" className="font-bold text-rose-600 underline underline-offset-2">Log in</Link> to leave a comment.
                    </p>
                )}
            </section>

            {/* Article Footer */}
            <footer className="reveal-item mt-16 md:mt-24 border-t-2 border-dashed border-[#9b8e84]/60 pt-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
                    <div className="max-w-md">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500 mb-3">
                            That&apos;s all for now
                        </p>

                        <h2 className="font-title text-2xl md:text-3xl text-[#29221f] leading-tight mb-3">
                            Thanks for reading.
                        </h2>

                        <p className="text-sm md:text-base text-[#62564e] font-medium leading-relaxed">
                            Hope you found something here worth thinking about. There&apos;s
                            always another story around the corner.
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-3 rounded-full border-2 border-[#29221f] bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-[#29221f] shadow-[3px_4px_0_#29221f]  hover:shadow-[3px_4px_0_#fefefe] hover:bg-black hover:text-white transition-all shrink-0"
                    >
                        Read another post
                        <span aria-hidden="true" className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="mt-12 flex flex-col items-center justify-center text-center">
                    <span aria-hidden="true" className="text-2xl text-rose-400 mb-3 rotate-6">〰️</span>
                </div>
            </footer>
        </article>
    );
};

export default PostDetailPage;
