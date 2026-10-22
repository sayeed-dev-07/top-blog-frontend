/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRegister } from '@/hooks/useAuth';
import { AlertCircle, Circle, Eye, EyeOff } from 'lucide-react';
import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const RegisterForm = () => {
    const isChecking = useRedirectIfAuthenticated();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isError, isPending, error, reset } = useRegister();
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            '.reveal-item',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
        );
    }, { scope: containerRef });

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        reset();
        setUsername('');
        setPassword('');
        setErrors({ username: '', password: '' });
    }, [reset]);

    const cleanUsername = username.trim();
    const cleanPassword = password.trim();
    const usernameRegex = /^[a-zA-Z0-9]+$/;

    const isUsernameValid =
        cleanUsername.length >= 5 &&
        cleanUsername.length <= 20 &&
        usernameRegex.test(cleanUsername);

    const isPasswordValid =
        cleanPassword.length >= 5 &&
        cleanPassword.length <= 20;

    const isFormValid = isUsernameValid && isPasswordValid;

    const handleFormUpdate = (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        mutate(
            { username: cleanUsername, password: cleanPassword },
            {
                onSuccess: () => {
                    setUsername('');
                    setPassword('');
                },
                onError: () => {
                    setPassword('');
                }
            }
        );
    };

    const displayError = isError ? error?.message : null;

    if (isChecking) return null;

    return (
        <div ref={containerRef} className="w-full md:max-w-lg mx-auto md:my-20 min-h-[100dvh] md:min-h-0 flex flex-col justify-center md:px-4 relative z-10">

            <div className="reveal-item flex flex-col flex-1 md:flex-none bg-[#fffaf0] md:rounded-[1.4rem] md:border-2 md:border-[#29221f] md:shadow-[6px_8px_0_#29221f] overflow-hidden">

                {/* Header */}
                <div className="px-4 sm:px-8 pt-16 pb-8 md:pt-8 md:px-10 border-b-2 border-dashed border-[#9b8e84]/40 bg-[#f3e9df] relative">
                    <Link
                        href="/"
                        className="absolute right-3 bottom-6 z-50 inline-flex md:hidden items-center gap-2 rounded-full border-2 border-[#29221f] bg-[#ffe5d5] px-5 py-3 text-xs font-bold uppercase tracking-widest text-[#29221f]  hover:-translate-y-1  active:translate-y-0.5  transition-all group"
                    >
                        <span className="text-lg leading-none transition-transform group-hover:-translate-x-1" aria-hidden="true">←</span>
                    </Link>
                    <span aria-hidden="true" className="absolute right-6 top-6 text-4xl text-rose-400 rotate-12 drop-shadow-sm">✿</span>
                    <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#29221f] bg-[#ffe5d5] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#29221f] shadow-[2px_2px_0_#29221f] -rotate-2 mb-4">
                        Hello there
                    </div>
                    <h2 className="font-title text-3xl md:text-4xl text-[#29221f]">Register</h2>
                    <p className="text-sm text-[#62564e] font-medium mt-2">a account</p>
                </div>

                {/* Form Body */}
                <div className="p-4 sm:p-8 md:p-10 flex flex-col flex-1 justify-center">
                    <form onSubmit={handleFormUpdate} className="flex flex-col gap-y-7">
                        {displayError && (
                            <div className="flex items-start gap-3 rounded-xl border-2 border-rose-500 bg-rose-50 p-4 text-[#29221f] shadow-[2px_2px_0_#f43f5e]">
                                <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-bold mb-1 text-rose-700">Oops, something broke</p>
                                    <p className="text-[#62564e] font-medium">{displayError}</p>
                                </div>
                            </div>
                        )}

                        <div className="w-full space-y-2">
                            <label htmlFor="username" className="block text-xs font-bold uppercase tracking-widest text-[#514943]">
                                Username <span className="text-rose-500">*</span>
                            </label>
                            <input
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    setErrors((prev) => ({ ...prev, username: '' }));
                                    if (isError) reset();
                                }}
                                required
                                className="w-full rounded-xl border-2 border-[#29221f] bg-white px-4 py-3.5 text-base text-[#29221f] placeholder:text-[#9b8e84] shadow-[2px_2px_0_#29221f] focus:outline-none focus:shadow-[4px_4px_0_#29221f] focus:-translate-y-0.5 transition-all"
                                type="text"
                                id="username"
                                name="username"
                                placeholder="e.g. sayeed07"
                                autoComplete="off"
                            />
                            <p className="text-[11px] font-bold text-[#9b8e84] mt-2 tracking-wide">
                                5-20 characters, letters & numbers only.
                            </p>
                        </div>

                        <div className="w-full space-y-2">
                            <label htmlFor="password" className="block text-xs font-bold uppercase tracking-widest text-[#514943]">
                                Password <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors((prev) => ({ ...prev, password: '' }));
                                        if (isError) reset();
                                    }}
                                    required
                                    className="w-full rounded-xl border-2 border-[#29221f] bg-white pl-4 pr-12 py-3.5 text-base text-[#29221f] placeholder:text-[#9b8e84] shadow-[2px_2px_0_#29221f] focus:outline-none focus:shadow-[4px_4px_0_#29221f] focus:-translate-y-0.5 transition-all"
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Make it a good one"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8e84] hover:text-[#29221f] transition-colors cursor-pointer p-2 z-10"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-[11px] font-bold text-[#9b8e84] mt-2 tracking-wide">
                                5-20 characters long.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending || !isFormValid}
                            className="mt-4 w-full cursor-pointer flex justify-center items-center rounded-xl border-2 border-[#29221f] bg-[#29221f] text-white px-4 py-4 text-sm font-bold uppercase tracking-widest shadow-[3px_4px_0_#29221f] hover:-translate-y-0.5 hover:shadow-[4px_6px_0_#29221f] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[3px_4px_0_#29221f]"
                        >
                            {isPending ? <Circle className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t-2 border-dashed border-[#9b8e84]/40 flex justify-between items-center flex-wrap gap-x-4 gap-y-2">
                        <span className="text-xs font-bold text-[#62564e]">Already have an account?</span>
                        <Link
                            href="/login"
                            className="text-xs font-bold uppercase tracking-widest text-[#29221f] hover:text-rose-600 transition-colors group flex items-center gap-1"
                        >
                            Login Here <span className="text-lg leading-none group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;