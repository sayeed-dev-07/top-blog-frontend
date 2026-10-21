/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useCurrentUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const syncUser = () => {
            const token = localStorage.getItem('token');

            if (!token) {
                localStorage.removeItem('user');
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const decodedPayload = jwtDecode(token);
                localStorage.setItem('user', JSON.stringify(decodedPayload));
                setUser(decodedPayload);
            } catch (error) {
                console.error('Invalid token provided', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }

            setIsLoading(false);
        };

        syncUser();
        window.addEventListener('auth-change', syncUser);

        return () => window.removeEventListener('auth-change', syncUser);
    }, []);

    return { user, isLoading };
}
