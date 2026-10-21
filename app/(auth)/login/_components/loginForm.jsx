'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useLogin } from '@/hooks/useAuth';
import { AlertCircle, Circle, Eye, EyeOff } from 'lucide-react';
import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';
import gsap from 'gsap';

const LoginForm = () => {
    const isChecking = useRedirectIfAuthenticated();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // 1. Destructure 'reset'
    const { mutate, isError, isPending, error, reset } = useLogin();

    const usernameBorderRef = useRef(null);
    const passwordBorderRef = useRef(null);

    const animateBorder = (ref, isFocused) => {
        gsap.to(ref.current, {
            scaleX: isFocused ? 1 : 0,
            duration: 0.35,
            ease: 'power3.out',
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const name = username.trim();
        const pass = password.trim();

        if (!name || !pass) return;

        // 2. Add onSuccess and onError actions
        mutate(
            { username: name, password: pass },
            {
                onSuccess: () => {
                    setUsername('');
                    setPassword('');
                },
                onError: () => {
                    setPassword(''); // Clear password on wrong credentials so they can try again instantly
                }
            }
        );
    };

    const displayError = isError ? error?.message : null;

    if (isChecking) return null;

    return (
        <div className="w-full max-w-2xl mx-auto md:my-24 min-h-[100dvh] md:min-h-0 bg-white flex flex-col justify-center">
            <div className="md:hidden flex items-center justify-between p-8 pb-0">
                <h2 className="font-title text-3xl text-black">Login</h2>
                <div className="w-3 h-3 bg-red-600 rounded-full"></div>
            </div>

            <div className="flex flex-col md:flex-row md:border md:border-black bg-white flex-1 md:flex-none">
                <div className="hidden md:flex flex-col items-center justify-between w-20 border-r border-black bg-[#fafafa] py-8">
                    <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                    <h2 className="font-title text-2xl text-black [writing-mode:vertical-rl] rotate-180">
                        Login
                    </h2>
                    <div className="w-px h-12 bg-black"></div>
                </div>

                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                    <form onSubmit={handleFormSubmit} className="flex flex-col gap-y-8">
                        {displayError && (
                            <div className="flex items-start gap-3 border border-black p-4 text-black bg-[#fafafa]">
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-bold mb-1">Login Error</p>
                                    <p className="text-gray-700">{displayError}</p>
                                </div>
                            </div>
                        )}

                        <div className="w-full space-y-2">
                            <label htmlFor="username" className="block text-sm text-black font-medium">
                                Username <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (isError) reset(); // Clear server error instantly when typing
                                    }}
                                    onFocus={() => animateBorder(usernameBorderRef, true)}
                                    onBlur={() => animateBorder(usernameBorderRef, false)}
                                    required
                                    className="w-full border-b border-black px-0 py-2 text-base bg-transparent focus:outline-none cursor-text"
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Enter username"
                                    autoComplete="off"
                                />
                                <div 
                                    ref={usernameBorderRef} 
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black scale-x-0 origin-left pointer-events-none"
                                />
                            </div>
                        </div>

                        <div className="w-full space-y-2">
                            <label htmlFor="password" className="block text-sm text-black font-medium">
                                Password <span className="text-red-600">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (isError) reset(); // Clear server error instantly when typing
                                    }}
                                    onFocus={() => animateBorder(passwordBorderRef, true)}
                                    onBlur={() => animateBorder(passwordBorderRef, false)}
                                    required
                                    className="w-full border-b border-black pl-0 pr-10 py-2 text-base bg-transparent focus:outline-none cursor-text"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors cursor-pointer p-2 z-10"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                                <div 
                                    ref={passwordBorderRef} 
                                    className="absolute bottom-0 left-0 w-full h-[2px] bg-black scale-x-0 origin-left pointer-events-none"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || !username.trim() || !password.trim()}
                            className="mt-4 w-full cursor-pointer flex justify-center items-center bg-black text-white px-4 py-4 text-base hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? <Circle className="w-5 h-5 animate-spin" /> : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-black flex justify-between items-center">
                        <span className="text-sm text-gray-500">Don&apos;t have an account?</span>
                        <Link 
                            href="/register" 
                            className="text-sm font-bold cursor-pointer hover:text-red-600 transition-colors"
                        >
                            Register Here →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;