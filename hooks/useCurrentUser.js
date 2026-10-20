/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export function useCurrentUser() {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decodedPayload = jwtDecode(token);
                setUser(decodedPayload);

                // Automatically set the decoded data in localStorage.user
                localStorage.setItem('user', JSON.stringify(decodedPayload));
            } catch (error) {
                console.error("Invalid token provided", error);
                // Clean up invalid data
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } else {
            // Clean up if no token exists
            localStorage.removeItem('user');
            setUser(null);
        }

        setIsLoading(false);
    }, []);

    return { user, isLoading };
}