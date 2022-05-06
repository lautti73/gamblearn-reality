import React from 'react';
import StoreProvider from '../store/storeProvider';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export const Layout = ({ children }) => {
    return (
        <StoreProvider>
            <div className='min-h-screen flex flex-col'>
                <Navbar />
                {children}
                <Footer />
            </div>
        </StoreProvider>
    )
};