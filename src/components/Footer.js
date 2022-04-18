import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import discordWhite from '../../public/discord-white.svg';


export const Footer = () => {
    return (
        <footer className='bg-blackbg text-grayfont p-8 flex flex-col items-center mt-auto'>
            <div className='flex items-center mb-12 sm:mb-6'>
                <a href="https://discord.gg/rtnFwG96rX" className='' target='_blank' rel='noreferrer'>
                    <Image src={discordWhite} className='mr-2' alt='discord icon' width={ 25 }/>
                </a>
                <a href="https://discord.gg/rtnFwG96rX" className='ml-2.5 hover:text-whitefont' target='_blank' rel='noreferrer'>
                    <p className='mb-1 '>Our discord</p>
                </a>
            </div>
            <ul className='flex flex-col sm:flex-row items-center sm:justify-center '>
                <li className='mb-8 sm:mb-0 sm:mr-8 hover:text-whitefont'>
                    <Link href={ '/' }><a>Home</a></Link>
                </li>
                <li className='mb-8 sm:mb-0 sm:mr-8 hover:text-whitefont'>
                    <Link href={ '/how-to-play' }><a>How to play</a></Link>
                </li>
                <li className='mb-8 sm:mb-0 sm:mr-8 hover:text-whitefont'>
                    <Link href={ '/gambles' }><a>Gambles</a></Link>
                </li>
                <li className='mb-8 sm:mb-0 hover:text-whitefont'>
                    <Link href={ '/create-gamble' }><a>Create gamble</a></Link>
                </li>
            </ul>
            <p className='text-center mt-12 text-sm'>GamblEarn © 2022</p>
        </footer>
    )
};