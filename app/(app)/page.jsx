/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePost';
import Loading from '@/components/shared/Loading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HomePage = () => {
  const { data, isLoading, isError } = usePosts();
  const posts = data?.posts || [];
  const containerRef = useRef(null);

  // 1. Initial Card Reveal
  const { contextSafe } = useGSAP(() => {
    if (!isLoading && !isError && posts.length > 0) {
      gsap.fromTo(
        '.post-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, {
    scope: containerRef,
    dependencies: [isLoading, isError, posts.length],
  });



  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-12 md:py-20"
    >
      <header className="mb-16 md:mb-24 flex flex-col md:flex-row gap-6 md:items-end justify-between border-b border-black pb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-red-600 rounded-full shrink-0" />

            <span className="text-sm text-gray-500">
              A little space on the internet
            </span>
          </div>

          <h1 className="font-title text-4xl md:text-6xl text-black ">
            Thoughts, things I’m learning, and a bit of code.
          </h1>
        </div>

        <p className="text-sm text-gray-600 max-w-xs leading-relaxed">
          Notes from my journey as a developer, along with a few thoughts on
          life.
        </p>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loading />
        </div>
      ) : isError ? (
        <div className="border border-black p-8 text-center bg-[#fafafa]">
          <p className="text-sm text-red-600">
            Couldn&apos;t load the posts. Give it another try.
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-black p-8 text-center bg-[#fafafa]">
          <p className="text-sm text-gray-500">
            Nothing here just yet. Check back soon.
          </p>
        </div>
      ) : (
        <div className="flex justify-center flex-wrap gap-8">
          {posts.map((post) => (
            <article
              key={post.id}

              className="post-card flex flex-col max-w-[450px] bg-white border border-black"
            >
              <div className="w-full h-56 border-b border-black overflow-hidden relative bg-[#fafafa]">
                {post.imgLink ? (
                  <img
                    src={post.imgLink}
                    alt={post.title}
                    className="post-image w-full h-full object-cover "
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                    No image available
                  </div>
                )}
              </div>

              <div className="px-3  sm:px-6 py-6 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <time
                    dateTime={post.createdAt}
                    className="text-[10px] text-gray-500 uppercase tracking-widest font-bold"
                  >
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                <h2 className="font-title text-xl text-black mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-sm text-gray-600 mb-8 line-clamp-3">
                  {post.content}
                </p>

                <div className="mt-auto border-t border-gray-200 pt-4">
                  <Link
                    href={`/posts/${post.id}`}
                    className="inline-flex hover:text-[crimson] duration-200 transition-all  items-center text-xs font-bold uppercase tracking-[0.2em] text-black"
                  >
                    Read more
                    <span className="ml-2 inline-block">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;