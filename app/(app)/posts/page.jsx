'use client'
import React from 'react';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Page = () => {
    const { user, isLoading } = useCurrentUser();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Please log in to view posts.</div>;
    }

    return (
        <div>
            from posts {user.username}
        </div>
    );
};

export default Page;