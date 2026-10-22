'use client'

import { useLogout } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Link from 'next/link';
import React, { useRef } from 'react';
import Loading from './Loading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { LogOut } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useAdmin';

const Navbar = () => {
    const { user, isLoading } = useCurrentUser();
    const logout = useLogout();
    const navRef = useRef(null);
    const borderRef = useRef(null);
    const { isAdmin } = useIsAdmin();

    useGSAP(() => {
        // Using clipPath allows us to animate a dashed border without stretching the dashes
        gsap.fromTo(
            borderRef.current,
            { clipPath: 'inset(0 100% 0 0)' },
            {
                clipPath: 'inset(0 0% 0 0)',
                duration: 1.2,
                ease: 'power3.inOut'
            }
        );
    }, { scope: navRef, dependencies: [isLoading] });

    return (
        <nav ref={navRef} className="relative w-full py-6 md:py-8 bg-transparent">
            {/* Animated Dashed Border */}
            <div
                ref={borderRef}
                className="absolute bottom-0 left-0 w-full h-[2px] border-b-2 border-dashed border-[#9b8e84]/60"
                style={{ clipPath: 'inset(0 100% 0 0)' }}
            />

            <div className="flex max-w-6xl px-4 sm:px-6 mx-auto items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 font-title text-2xl font-semibold text-[#29221f] transition-colors"
                    >
                        <span aria-hidden="true" className="text-xl text-rose-500 transition-transform duration-300 group-hover:rotate-45">✿</span>
                        <span className="tracking-wide group-hover:text-rose-600 transition-colors">blog</span>
                    </Link>
                </div>

                <div className="flex items-center gap-6 h-6">
                    {isLoading && (
                        <div className="nav-item flex items-center justify-center">
                            <Loading />
                        </div>
                    )}

                    {!isLoading && (
                        <div className="nav-item flex items-center gap-6 sm:gap-8">

                            {user?.admin && (
                                <Link
                                    href="/admin"
                                    className="hidden sm:inline-flex items-center justify-center rounded-full border-2 border-[#29221f] bg-[#d8f3e8] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#29221f] shadow-[2px_2px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#29221f] transition-all -rotate-2"
                                >
                                    Admin
                                </Link>
                            )}

                            <div className="hidden md:flex items-center gap-2 text-[#514943]">
                                <span aria-hidden="true" className="text-sm text-rose-500">♡</span>
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {user ? user.username : 'guest'}
                                </span>
                            </div>

                            {user ? (
                                <button
                                    onClick={logout}
                                    className="group flex items-center gap-2 cursor-pointer text-xs font-bold uppercase tracking-widest text-[#29221f] hover:text-rose-600 transition-colors"
                                >
                                    <span className="hidden sm:block">Logout</span>
                                    <div className="sm:hidden text-rose-500" aria-label="logout button">
                                        <LogOut size={18} strokeWidth={2.5} />
                                    </div>
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center rounded-full border-2 border-[#29221f] bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#29221f] shadow-[2px_2px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[3px_4px_0_#29221f] transition-all"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;