import React, { useState } from 'react'
import Image from 'next/image';
import { useAccount, useConnect } from 'wagmi';
import { ModalMenu } from './ModalMenu';
import walletConnect from '../../public/WalletConnect.svg';
import metamask from '../../public/metamask-icon.png';

export default () => {
    const [{ data: accountData }, disconnect] = useAccount({
        fetchEns: true,
        })
    const [{data, error}, connect] = useConnect();
    const [openMenu, setOpenMenu] = useState(false);
    return (

        <>
        { !accountData &&
            <button 
                className='my-auto px-5 py-1.5 rounded font-medium bg-orange text-white hover:brightness-110 active:brightness-95'
                onClick={()=> setOpenMenu(true)}>
                Login
            </button>
        }
        { accountData &&
            <li className='lg:list-item'>
                {`${accountData.address.slice(0, 4)}...${accountData.address.slice(-5)}`}
            </li>
        }
        { 
        openMenu &&
            <ModalMenu setOpenMenu={setOpenMenu}>
                <p className='text-2xl font-semibold text-center'>Select an option:</p>
                <div className='h-full flex flex-col justify-center'>
                    { data?.connectors?.map((connector) => (
                        <div 
                            className='flex justify-center p-10 mb-8 lg:mx-20 border rounded shadow-md border-slate-300 text-xl text-center font-semibold hover:bg-gray-200 active:brightness-95 cursor-pointer'
                            key={connector.id}
                            onClick={() => {
                                connect(connector)
                                // setOpenMenu(false)
                            }}
                            disabled={!connector.ready}>
                            { connector.name == 'WalletConnect' && <div className='flex items-center'><Image src={walletConnect} width={50} height={50}/></div>}
                            { connector.name == 'MetaMask' && <div className='mr-2.5 flex items-center'><Image src={metamask} width={32} height={32} /></div>}
                            <button>
                            {connector.name}
                            {!connector.ready && ' (unsupported, please install a wallet)'}
                            </button>
                        </div>
                        // console.log(connector)
                    ))}
                </div>
                {error && <div className='mt-auto text-center text-red'>{error?.message ?? 'Failed to connect'}</div>}

            </ModalMenu>
        }
        </>
    )
    
}
