import React, { useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import dynamic from 'next/dynamic';
import { useRouter } from "next/router";
import { ModalMenu } from './ModalMenu';
import discordWhite from '../../public/discord-white.svg';
import discordBlack from '../../public/discord-black.svg';

const Connect = dynamic(
	() => import('./Connect'),
	{ ssr: false }
  )

export const Navbar = () => {
    
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();

    return (
        <nav className='h-16 border-b border-neutral-200 border-solid shadow bg-blackbg'>
            <ul className='flex items-center h-full sm:container sm:mx-auto mx-5  text-whitefont'>
            
                <li className='lg:mr-16 font-extrabold text-2xl'>GamblEarn</li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/" ? "active" : ""}`}>
                    <Link href={'/'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Home</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/how-to-play" ? "active" : ""}`}>
                    <Link href={'/how-to-play'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>How To Play</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/gambles" ? "active" : ""}`}>
                    <Link href={'/gambles'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Gambles</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/create-gamble" ? "active" : ""}`}>
                    <Link href={'/create-gamble'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Create gambles</a>
                    </Link>
                </li >
                <li className='mr-8 2xl:mr-16 mt-2 hidden lg:list-item hover:text-orange ml-auto'>
                    <a href='https://discord.gg/rtnFwG96rX' target='_blank' rel='noreferrer'><Image src={ discordWhite } alt="discord-icon" width={25}/></a>
                </li >
                <li className='ml-auto lg:hidden cursor-pointer' onClick={ () => { setOpenMenu(true) }}>
                    <span className='block w-7 h-1 bg-whitefont mb-1'></span>
                    <span className='block w-7 h-1 bg-whitefont mb-1' ></span>
                    <span className='block w-7 h-1 bg-whitefont'></span>
                </li>
                <Connect />
                { openMenu && 
                    <ModalMenu
                        setOpenMenu={ setOpenMenu  }   
                    >
                        <ul className='text-2xl font-medium flex flex-col items-center h-full'>
                            <li className={`mt-16 md:mt-8 mb-14  hover:text-orange ${router.pathname == "/" ? "active" : ""}`}>
                                <Link href={'/'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Home</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/how-to-play" ? "active" : ""}`}>
                                <Link href={'/how-to-play'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>How To Play</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/gambles" ? "active" : ""}`}>
                                <Link href={'/gambles'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Gambles</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/create-gamble" ? "active" : ""}`}>
                                <Link href={'/create-gamble'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Create gambles</a>
                                </Link>
                            </li >
                            <li className='hover:text-orange'>
                                <a href='https://discord.gg/rtnFwG96rX' target='_blank' rel='noreferrer'><Image src={ discordBlack } alt="discord-icon" width={40}/></a>
                            </li >
                        </ul>
                    </ModalMenu>
                }
            </ul>
        </nav>
    )
}
