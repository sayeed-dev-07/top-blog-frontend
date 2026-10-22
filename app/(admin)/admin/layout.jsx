'use client'

import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

import React from 'react';

const Layout = ({ children }) => {


    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;