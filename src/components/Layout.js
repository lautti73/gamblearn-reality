import React from 'react';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
};