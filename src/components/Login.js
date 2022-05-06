import React, { useContext, useState } from 'react'
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { StoreContext } from '../store/storeProvider';

const Connect = dynamic(
	() => import('./Connect'),
	{ ssr: false }
  )

export const Login = ({ lg }) => {
    const [, setOpenConnect] = useContext(StoreContext);

    const [{ data: accountData}] = useAccount()
    let style;
    if(lg) {
        style = 'hidden lg:list-item'
    }
    return (
        <>
        <li className={style}>
            { !accountData &&
                <button 
                    className='px-5 py-1.5 rounded font-medium bg-orange text-white hover:brightness-110 active:brightness-95'
                    onClick={()=> setOpenConnect(true)}>
                    Login
                </button>
            }
            { accountData &&
                <p className='lg:list-item'>
                    {`${accountData.address.slice(0, 4)}...${accountData.address.slice(-5)}`}
                </p>
            }
        </li>
        <Connect/>
        </>
    )
}
