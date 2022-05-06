import React, { useLayoutEffect } from 'react';
import { XIcon } from '@heroicons/react/solid'
import { Spinner } from './Spinner';

export const ModalLoading = ({ setLoadingGamble }) => {

    return (
        <>  
            <div className='w-11/12 sm:w-2/3 md:w-7/12 xl:w-1/3 2xl:w-1/4 h-3/4 md:h-4/6 fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/3 z-20   bg-white rounded text-black overflow-auto'>
                <div className='w-full h-full relative py-6 px-6'>
                    <XIcon className='w-6 h-6 absolute top-2 right-2 cursor-pointer' onClick={ () => setLoadingGamble(false) }/>
                    <div className='w-full h-full flex flex-col items-center'>
                        
                        <p className='font-bold text-2xl mb-20'> Please wait </p>
                        <div className='justify-self-end mt-20'>
                            <Spinner size={ '8rem' } borderSize={ '10px' }/>
                        </div>
                        
                        <p className='font-bold text-xl mt-auto text-center'> Your transaction is being processed... </p>

                    </div>
                </div>
            </div>
            <div className='bg-black/50 top-0 right-0 left-0 bottom-0 z-10 fixed' onClick={ () => setLoadingGamble(false) }></div>
        </>
        )
};


