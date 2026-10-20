'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/useAuth';
import { AlertCircle, Circle } from 'lucide-react';
import { useRedirectIfAuthenticated } from '@/hooks/useAuthRedirect';

const RegisterForm = () => {
    const isChecking = useRedirectIfAuthenticated();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { mutate, isError, isPending, error } = useRegister();

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    const handleFormUpdate = (e) => {
        e.preventDefault();

        const usernameRegex = /^[a-zA-Z0-9]+$/;

        const name = username.trim();
        const pass = password.trim();

        const newErrors = {
            username: '',
            password: '',
        };

        if (!name) {
            newErrors.username = 'Username is required.';
        } else if (name.length < 5 || name.length > 20) {
            newErrors.username =
                'Username must be between 5 and 20 characters.';
        } else if (!usernameRegex.test(name)) {
            newErrors.username =
                'Username can only contain letters and numbers.';
        }

        if (!pass) {
            newErrors.password =
                'Password cannot be empty or spaces only.';
        } else if (password.length < 4 || password.length > 20) {
            newErrors.password =
                'Password must be between 5 and 20 characters.';
        }

        setErrors(newErrors);

        if (newErrors.username || newErrors.password) {
            return;
        }

        mutate({ username: name, password: pass });

        setUsername('');
        setPassword('');
    };

    const displayError = isError ? error?.message : null;

    if (isChecking) return null;

    return (
        <div className="w-full max-w-sm mx-auto my-12">
            <form
                onSubmit={handleFormUpdate}
                className="p-8 border border-black bg-white flex flex-col gap-y-6"
            >
                <div className="text-center mb-2">
                    <h2 className="text-xl tracking-wide text-black uppercase">
                        Register
                    </h2>
                </div>

                {/* Server Error Display */}
                {displayError && (
                    <div className="flex items-start gap-3 border border-black p-4 text-black bg-gray-50">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="text-xs tracking-wide">
                            <p className="uppercase mb-1">Registration Error</p>
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
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                username: '',
                            }));
                        }}
                        required
                        className="w-full border border-black px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-black transition-shadow"
                        type="text"
                        id="username"
                        name="username"
                    />
                    {errors.username && (
                        <p className="text-red-500 text-xs tracking-wide mt-1">
                            {errors.username}
                        </p>
                    )}
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
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setErrors((prev) => ({
                                ...prev,
                                password: '',
                            }));
                        }}
                        required
                        className="w-full border border-black px-4 py-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-black transition-shadow"
                        type="password"
                        id="password"
                        name="password"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-xs tracking-wide mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isPending}
                    className="mt-4 w-full cursor-pointer flex justify-center items-center bg-black text-white px-4 py-3 text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Circle className="w-5 h-5 animate-spin" /> : 'Create Account'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;