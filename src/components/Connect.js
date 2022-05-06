import React from 'react';
import Image from 'next/image';
import { useConnect } from 'wagmi';
import { ModalConnect } from './ModalConnect';
import walletConnect from '../../public/WalletConnect.svg';
import metamask from '../../public/metamask-icon.png';

export default () => {
    const [{data, error}, connect] = useConnect();

        return (
            <>
                <ModalConnect>
                    <p className='text-2xl font-semibold text-center'>Select an option to connect:</p>
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
                </ModalConnect>
            </>
        )
    
}
