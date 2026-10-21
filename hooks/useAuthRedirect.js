/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useRedirectIfAuthenticated() {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            router.replace('/');
        } else {
            setIsChecking(false);
        }
    }, [router]);

    return isChecking;
}