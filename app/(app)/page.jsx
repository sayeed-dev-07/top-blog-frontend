
'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePost';
import Loading from '@/components/shared/Loading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const HomePage = () => {
  const { data, isLoading, isError } = usePosts();

  const posts = data?.data?.posts || data?.posts || [];
  const containerRef = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      if (!isLoading && !isError && posts.length > 0) {
        gsap.fromTo(
          '.post-card',
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    },
    {
      scope: containerRef,
      dependencies: [isLoading, isError, posts.length],
    }
  );



  return (
    <main
      ref={containerRef}
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20"
    >
      {/* Hero / Introduction */}
      <header className="mb-14 md:mb-20 border-b border-black pb-8 md:pb-10">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-3 h-3 bg-red-600 rounded-full shrink-0" />

          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            A little space on the internet
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
          <h1 className="font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-black leading-[1.08] tracking-tight max-w-3xl">
            Thoughts, things I&apos;m learning, and a bit of code.
          </h1>

          <p className="text-base text-gray-800 leading-relaxed max-w-sm md:pb-1">
            A place for things I&apos;m figuring out, projects I&apos;m
            working on, and thoughts I feel like putting into words.
          </p>
        </div>
      </header>

      {/* Posts Section */}
      <section aria-label="Blog posts">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-2">
              From my notebook
            </p>

            <h2 className="font-title text-2xl sm:text-3xl font-semibold text-black">
              Things I&apos;ve written
            </h2>
          </div>

          {!isLoading && !isError && (
            <span className="text-sm font-semibold text-gray-800 shrink-0">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : isError ? (
          <div className="border border-black bg-[#fafafa] p-8 md:p-12">
            <h3 className="font-title text-2xl text-black mb-3">
              Something went wrong.
            </h3>

            <p className="text-base text-gray-800 leading-relaxed">
              I couldn&apos;t load the posts right now. Please try again in a
              little while.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-black bg-[#fafafa] p-8 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600 mb-4">
              Just getting started
            </p>

            <h3 className="font-title text-2xl sm:text-3xl text-black mb-3">
              Nothing here just yet.
            </h3>

            <p className="text-base text-gray-800 leading-relaxed max-w-lg">
              Every little corner of the internet starts somewhere. Check
              back soon; there&apos;s more to come.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}

                className="post-card group flex flex-col min-w-0 bg-white border border-black cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-4"
              >
                {/* Cover Image */}
                <div className="relative w-full aspect-[4/3] overflow-hidden border-b border-black bg-[#f3f3f3]">
                  {post.imgLink ? (
                    <Image
                      src={post.imgLink}
                      alt={post.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="post-image object-cover "
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-600">
                      No cover image
                    </div>
                  )}

                  <span className="absolute top-3 left-3 z-10 bg-white text-black border border-black px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider">
                    A personal note
                  </span>
                </div>

                {/* Post Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <time
                    dateTime={post.createdAt}
                    className="text-xs font-semibold text-gray-700 mb-4"
                  >
                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>

                  <h3 className="font-title text-xl sm:text-2xl font-semibold text-black leading-snug mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-800 leading-relaxed line-clamp-3 mb-7">
                    {post.content}
                  </p>

                  {/* Read More */}
                  <div className="mt-auto pt-4 border-t border-gray-300 flex items-center justify-between gap-3">
                    <span className="text-xs sm:text-sm font-bold text-black group-hover:text-red-600 transition-colors duration-200">
                      Read the story
                    </span>

                    <span
                      aria-hidden="true"
                      className="flex items-center justify-center w-9 h-9 border border-black text-black group-hover:bg-black group-hover:text-white transition-colors duration-200"
                    >
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Closing Note */}
      {!isLoading && !isError && posts.length > 0 && (
        <footer className="mt-16 md:mt-24 border-t border-black pt-8">
          <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
            Thanks for being here. Feel free to look around and stay a while.
          </p>
        </footer>
      )}
    </main>
  );
};

export default HomePage;
