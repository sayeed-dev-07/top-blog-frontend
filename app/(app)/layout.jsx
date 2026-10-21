import Navbar from '@/components/shared/Navbar';
import React from 'react';

const layout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}

        </>
    );
};

export default layout;