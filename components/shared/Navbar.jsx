'use client'

import { useLogout } from '@/hooks/useAuth';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Link from 'next/link';
import React, { useRef } from 'react';
import Loading from './Loading';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { usePathname } from 'next/navigation';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, isLoading } = useCurrentUser();
    const logout = useLogout();
    const navRef = useRef(null);
    const borderRef = useRef(null);
    const pathname = usePathname();

    useGSAP(() => {
        gsap.fromTo(
            borderRef.current,
            { scaleX: 0 },
            {
                scaleX: 1,
                duration: 1.2,
                transformOrigin: 'left',
                ease: 'power3.inOut'
            }
        );


    }, { scope: navRef, dependencies: [isLoading] });

    const isAuthRoute = pathname === '/login' || pathname === '/register';

    // if (isAuthRoute) return null;

    return (
        <nav ref={navRef} className="relative w-full px-3 sm:px-6 py-6 md:py-8">
            <div
                ref={borderRef}
                className="absolute bottom-0 left-0 w-full h-[1px] bg-black scale-x-0"
            />

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="font-title text-2xl uppercase tracking-widest text-black hover:text-red-600 transition-colors"
                    >
                        blog
                    </Link>

                </div>

                <div className="flex items-center gap-6 h-6">
                    {isLoading && (
                        <div className="nav-item flex items-center justify-center">
                            <Loading />
                        </div>
                    )}

                    {!isLoading && (

                        <div className="nav-item flex items-center gap-8">
                            <div className="hidden md:flex items-center gap-2">
                                <div className="w-1 h-1 bg-red-600 rounded-full" />
                                <span className="text-sm font-medium  uppercase ">
                                    {user ? user.username : 'guest'}
                                </span>
                            </div>
                            {
                                user ? <button
                                    onClick={logout}
                                    className="cursor-pointer text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
                                >
                                    <span className='hidden sm:block'>Logout</span> <div className='sm:hidden' aria-label='logout button'> <LogOut /> </div>
                                </button>
                                    : <Link
                                        href="/login"
                                        className=" cursor-pointer text-sm font-bold uppercase tracking-widest hover:text-red-600 transition-colors"
                                    >
                                        Login
                                    </Link>
                            }
                        </div>

                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
