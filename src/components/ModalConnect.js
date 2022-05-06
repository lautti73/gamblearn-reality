import React, { useContext } from 'react';
import { XIcon } from '@heroicons/react/solid'
import { StoreContext } from '../store/storeProvider';

export const ModalConnect = ({children }) => {
    const [store, setOpenConnect] = useContext(StoreContext);
    const {setConnect} = store;
    if (setConnect)
    return (
        <>  
            <div className='w-11/12 sm:w-2/3 md:w-7/12 h-3/4 md:h-4/6 fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 z-20 bg-white rounded text-black overflow-auto'>
                <div className='w-full h-full relative py-6 px-6'>
                    <XIcon className='w-6 h-6 absolute top-2 right-2 cursor-pointer' onClick={ () => setOpenConnect(false) }/>
                    <div className='w-full h-full flex flex-col'>
                        { children }
                    </div>
                </div>
            </div>
            <div className='bg-black/50 fixed top-0 left-0 right-0 min-h-screen z-10' onClick={ () => setOpenConnect(false) }></div>
        </>
    )
};