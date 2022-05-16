import React, { useContext, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import { ModalMenu } from './ModalMenu';
import discordWhite from '../../public/discord-white.svg';
import discordBlack from '../../public/discord-black.svg';
import { Login } from './Login';
import { StoreContext } from '../store/storeProvider';

export const Navbar = () => {
    
    const [openMenu, setOpenMenu] = useState(false);
    const router = useRouter();
    const [{logged}] = useContext(StoreContext);

    return (
        <nav className='h-16 border-b border-neutral-200 border-solid shadow bg-blackbg'>
            <ul className='flex items-center h-full sm:container sm:mx-auto mx-5  text-whitefont'>
            
                <li className='lg:mr-16 font-extrabold text-2xl'>GamblEarn</li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/" && "active"}`}>
                    <Link href={'/'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Home</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/how-to-play" && "active"}`}>
                    <Link href={'/how-to-play'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>How To Play</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/bets" && "active"}`}>
                    <Link href={'/bets'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Bets</a>
                    </Link>
                </li>
                <li className={`mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/create-bet" && "active"}`}>
                    <Link href={'/create-bet'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Create bet</a>
                    </Link>
                </li >
                <li className={`ml-auto mr-12 hidden lg:list-item hover:text-orange ${router.pathname == "/my-bets" && "active"} ${!logged && 'lg:hidden'}`}>
                    <Link href={'/my-bets'}>
                        <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>My bets</a>
                    </Link>
                </li >
                <li className={`mr-8 2xl:mr-16 mt-2 hidden lg:list-item hover:text-orange ${!logged && 'ml-auto'}`}>
                    <a href='https://discord.gg/rtnFwG96rX' target='_blank' rel='noreferrer'><Image src={ discordWhite } alt="discord-icon" width={25}/></a>
                </li >
                <li className='ml-auto lg:hidden cursor-pointer' onClick={ () => { setOpenMenu(true) }}>
                    <span className='block w-7 h-1 bg-whitefont mb-1'></span>
                    <span className='block w-7 h-1 bg-whitefont mb-1' ></span>
                    <span className='block w-7 h-1 bg-whitefont'></span>
                </li>
                <Login lg/>
                
                { openMenu && 
                    <ModalMenu
                        setOpenMenu={ setOpenMenu  }   
                    >
                        <ul className='text-2xl font-medium flex flex-col items-center h-full'>
                            <li className={`mt-8 md:mt-8 mb-14  hover:text-orange ${router.pathname == "/" && "active"}`}>
                                <Link href={'/'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Home</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/how-to-play" && "active"}`}>
                                <Link href={'/how-to-play'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>How To Play</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/bets" && "active"}`}>
                                <Link href={'/bets'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Bets</a>
                                </Link>
                            </li>
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/create-bet" && "active"}`}>
                                <Link href={'/create-bet'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>Create bet</a>
                                </Link>
                            </li >
                            <li className={`mb-14 hover:text-orange ${router.pathname == "/my-bets" && "active"} ${!logged && 'hidden'}`}>
                                <Link href={'/my-bets'}>
                                    <a className='lg:pb-5 pb-1 sm:px-2 px-0.5'>My bets</a>
                                </Link>
                            </li >
                            <li className='hover:text-orange'>
                                <a href='https://discord.gg/rtnFwG96rX' target='_blank' rel='noreferrer'><Image src={ discordBlack } alt="discord-icon" width={40}/></a>
                            </li >
                            <Login/>
                        </ul>
                    </ModalMenu>
                }
            </ul>
        </nav>
    )
}
