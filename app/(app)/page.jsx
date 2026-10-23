'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePosts } from '@/hooks/usePost';
import Loading from '@/components/shared/Loading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';



const HomePage = () => {



  const { data, isLoading, isError } = usePosts();

  let posts = data?.data?.posts || data?.posts || [];
  posts = posts.filter(arr => arr.published)
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (!isLoading) {
        gsap.fromTo(
          '.post-card, .reveal-item',
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
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20 overflow-hidden"
    >
      {/* Hero / Introduction */}
      {/* Added opacity-0 to prevent FOUC */}
      <header className="reveal-item opacity-0 mb-14 md:mb-20 border-b-2 border-dashed border-[#9b8e84] pb-10 md:pb-14 relative">
        <div className="inline-flex items-center gap-2 mb-6 rounded-full border-2 border-[#29221f] bg-[#ffe5d5] px-4 py-2 shadow-[2px_3px_0_#29221f] -rotate-2">
          <span aria-hidden="true" className="text-rose-500 text-sm">✿</span>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#29221f]">
            A little space on the internet
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10">
          <h1 className="relative font-title text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-[#29221f] leading-[1.08] tracking-tight max-w-3xl">
            Thoughts, things I&apos;m learning, and a bit of code.
            {/* Decorative Sparkle */}
            <span aria-hidden="true" className="absolute -top-6 -right-8 text-4xl text-[#d8eee3] drop-shadow-sm rotate-12">
              ✳
            </span>
          </h1>

          <p className="text-base text-[#62564e] leading-relaxed max-w-sm md:pb-2 font-medium">
            A place for things I&apos;m figuring out, projects I&apos;m
            working on, and thoughts I feel like putting into words.
          </p>
        </div>
      </header>

      {/* Posts Section */}
      <section aria-label="Blog posts">
        {/* Added opacity-0 */}
        <div className="reveal-item opacity-0 flex items-end justify-between gap-4 mb-10">
          <div className="relative">
            <span aria-hidden="true" className="absolute -left-6 top-1 text-2xl text-[#e9ddff] -rotate-12">
              ♡
            </span>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-600 mb-2 pl-2">
              From my notebook
            </p>

            <h2 className="font-title text-3xl sm:text-4xl font-semibold text-[#29221f]">
              Things I&apos;ve written
            </h2>
          </div>

          {!isLoading && !isError && (
            <span className="hidden sm:inline-flex items-center justify-center rounded-full border-2 border-[#29221f] bg-white px-4 py-1.5 text-sm font-bold text-[#29221f] shadow-[2px_2px_0_#29221f]">
              {posts.length} {posts.length === 1 ? 'entry' : 'entries'}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loading />
          </div>
        ) : isError ? (
          <div className="reveal-item opacity-0 rounded-[1.4rem] border-2 border-[#29221f] bg-[#fffaf0] shadow-[4px_5px_0_#29221f] p-8 md:p-12 text-center max-w-2xl mx-auto my-12">
            <span aria-hidden="true" className="block text-4xl mb-4 text-rose-500">☁️</span>
            <h3 className="font-title text-2xl sm:text-3xl text-[#29221f] mb-3">
              Something went wrong.
            </h3>
            <p className="text-base text-[#62564e] leading-relaxed">
              I couldn&apos;t load the posts right now. Please try again in a little while.
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="reveal-item opacity-0 rounded-[1.4rem] border-2 border-[#29221f] bg-[#f1fbf7] shadow-[4px_5px_0_#29221f] p-8 md:p-12 text-center max-w-2xl mx-auto my-12 relative overflow-hidden">
            <span aria-hidden="true" className="absolute -right-4 -bottom-4 text-8xl text-[#d8f3e8] opacity-50 rotate-12">✿</span>
            <p className="inline-block rounded-full border-2 border-[#29221f] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-600 mb-4 shadow-[2px_2px_0_#29221f] -rotate-2">
              Just getting started
            </p>
            <h3 className="font-title text-2xl sm:text-3xl text-[#29221f] mb-3 relative z-10">
              Nothing here just yet.
            </h3>
            <p className="text-base text-[#62564e] leading-relaxed max-w-lg mx-auto relative z-10">
              Every little corner of the internet starts somewhere. Check
              back soon; there&apos;s more to come.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {posts.map((post, index) => {
              const cardThemes = [
                { paper: 'bg-[#fffaf0]', badge: 'bg-[#ffe5d5]', doodle: 'text-rose-500' },
                { paper: 'bg-[#f1fbf7]', badge: 'bg-[#d8f3e8]', doodle: 'text-teal-600' },
                { paper: 'bg-[#f7f2ff]', badge: 'bg-[#e9ddff]', doodle: 'text-violet-600' },
              ];
              const theme = cardThemes[index % cardThemes.length];

              return (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  /* Added opacity-0 */
                  className={`post-card opacity-0 group relative flex flex-col min-w-0 overflow-hidden rounded-[1.4rem] border-2 border-[#29221f] ${theme.paper} shadow-[4px_5px_0_#29221f] transition-all duration-300 ease-out hover:-translate-y-2 hover:rotate-[0.5deg] hover:shadow-[8px_10px_0_rgba(244,114,182,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-4`}
                >
                  {/* Cover Image */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden border-b-2 border-[#29221f] bg-[#f3e9df]">
                    {post.imgLink ? (
                      <Image
                        src={post.imgLink}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="post-image object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_30%_25%,#fff_0_8%,transparent_9%),linear-gradient(135deg,#fbd9ca,#f7e9b9_55%,#d8eee3)] text-[#51453f]">
                        <span aria-hidden="true" className="font-title text-5xl leading-none">✿</span>
                        <span className="text-xs font-semibold">A little story is tucked inside</span>
                      </div>
                    )}

                    <span className={`absolute top-4 left-4 z-10 rounded-full border border-[#29221f] ${theme.badge} px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] shadow-[2px_2px_0_#29221f] -rotate-2 transition-transform duration-300 group-hover:rotate-2 group-hover:scale-105`}>
                      little note
                    </span>
                    <span aria-hidden="true" className={`absolute bottom-3 right-4 z-10 text-3xl drop-shadow-sm transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125 ${theme.doodle}`}>
                      ✳
                    </span>
                  </div>

                  {/* Post Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <time
                        dateTime={post.createdAt}
                        className="inline-flex rounded-full bg-white/75 border border-[#29221f]/10 px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#62564e]"
                      >
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                      <span aria-hidden="true" className={`text-lg leading-none ${theme.doodle}`}>♡</span>
                    </div>

                    <h3 className="font-title text-xl sm:text-2xl font-semibold text-[#29221f] leading-snug mb-3 transition-colors duration-200 group-hover:text-rose-700">
                      {post.title}
                    </h3>

                    <p className="text-sm sm:text-base text-[#514943] font-medium leading-relaxed line-clamp-3 mb-7">
                      {post.content}
                    </p>

                    {/* Read More */}
                    <div className="mt-auto pt-4 border-t-2 border-dashed border-[#9b8e84]/60 flex items-center justify-between gap-3">
                      <span className="text-xs sm:text-sm font-bold text-[#29221f] group-hover:text-rose-700 transition-colors duration-200">
                        Come have a read
                      </span>

                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#29221f] bg-white text-[#29221f] transition-all duration-300 group-hover:-rotate-45 group-hover:bg-[#29221f] group-hover:text-white"
                      >
                        ↗
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Closing Note */}
      {/* Removed the 'posts.length > 0' condition so it smoothly fades in alongside errors or empty states too */}
      {!isLoading && !isError && (
        <footer className="reveal-item opacity-0 mt-16 md:mt-24 border-t-2 border-dashed border-[#9b8e84] pt-10 flex flex-col items-center justify-center text-center">
          <span aria-hidden="true" className="text-2xl text-rose-400 mb-3 rotate-6">〰️</span>
          <p className="text-sm sm:text-base font-medium text-[#62564e] leading-relaxed">
            Thanks for being here. Feel free to look around and stay a while.
          </p>
        </footer>
      )}
    </main>
  );
};

export default HomePage;