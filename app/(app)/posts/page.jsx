'use client'
import { useLogout } from '@/hooks/useAuth';
import React from 'react';

const Posts = () => {
    const logout = useLogout();

    return (
        <div>
            hello from posts

            <button className='cursor-pointer' onClick={logout}>logout</button>

        </div>
    );
};

export default Posts;