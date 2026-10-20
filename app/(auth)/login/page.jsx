'use client';

import { useState } from 'react';
import { useLogin } from '@/hooks/useAuth';
import { AlertCircle, Circle } from 'lucide-react';
import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';

const LoginForm = () => {
    const isChecking = useRedirectIfAuthenticated();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { mutate, isError, isPending, error } = useLogin();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const name = username.trim();
        const pass = password.trim();

        if (!name || !pass) {
            return;
        }

        mutate({ username: name, password: pass });
    };

    const displayError = isError ? error?.message : null;

    if (isChecking) return null;

    return (
        <div className="w-full max-w-sm mx-auto my-12">
            <form
                onSubmit={handleFormSubmit}
                className="p-8 border border-black bg-white flex flex-col gap-y-6"
            >
                <div className="text-center mb-2">
                    <h2 className="text-xl tracking-wide text-black uppercase">
                        Sign In
                    </h2>
                </div>

                {/* Server Error Display */}
                {displayError && (
                    <div className="flex items-start gap-3 border border-black p-4 text-black bg-gray-50">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="text-xs tracking-wide">
                            <p className="uppercase mb-1">Login Error</p>
                            <p className="text-gray-600">{displayError}</p>
                        </div>
                    </div>
                )}

                <div className="w-full space-y-2">
                    <label
                        htmlFor="username"
                        className="block text-xs uppercase tracking-widest text-black"
                    >
                        Username
                    </label>
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full border border-black px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-black transition-shadow"
                        type="text"
                        id="username"
                        name="username"
                    />
                </div>

                <div className="w-full space-y-2">
                    <label
                        htmlFor="password"
                        className="block text-xs uppercase tracking-widest text-black"
                    >
                        Password
                    </label>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full border border-black px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-black transition-shadow"
                        type="password"
                        id="password"
                        name="password"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending || !username.trim() || !password.trim()}
                    className="mt-4 w-full flex justify-center items-center bg-black text-white px-4 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Circle className="w-5 h-5 animate-spin" /> : 'Sign In'}
                </button>
            </form>
        </div>
    );
};

export default LoginForm;