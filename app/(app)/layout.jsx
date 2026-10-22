import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import React from 'react';

const layout = ({ children }) => {
    return (
        <div className='bg-[#87cfeb45] z-10'>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default layout;