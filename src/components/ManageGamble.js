import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount, useContract, useSigner } from 'wagmi'
import betjson from '../../artifacts/contracts/GambleGame.sol/Bet.json'
import { StoreContext } from '../store/storeProvider'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';

export const  ManageGamble = ({betAddress, betState, matchTimestamp, questionId, realityAddress}) => {
    const router = useRouter();
    // console.log(realityAddress)
    
    const [, setOpenConnect] = useContext(StoreContext);
    const [loadingGamble, setLoadingGamble] = useState(false)
    
    const [transactionStatus, setTransactionStatus] = useState({
        status: 0,
        errorMessage: ''
    })
    
    const [{ data: signer}] = useSigner();
    const [{data: account}] = useAccount();
    
    const betInstance = useContract({
        addressOrName: betAddress,
        contractInterface: betjson.abi,
        signerOrProvider: signer,
    })
    const handleSubmit = async(e) => {
        e.preventDefault();
        const { name } = e.target;
        if( account ) {
            try {
                setLoadingGamble(true)
                await betInstance[name]();
                setTransactionStatus({
                    status: 200,
                    errorMessage: ''
                })
                router.replace(`/gambles/${gambleAddress}`)
            } catch (err) {
                console.log(err)
                let error = JSON.parse(err.message.slice(err.message.indexOf("{"), err.message.indexOf("}") + 1) + "}}");
                let sendError = err.message.length > 400 ? error.message : err.message
                let url = `https://reality.eth.link/app/#!/question/${realityAddress}-${questionId}`
                if (sendError == "execution reverted: question must be finalized") {
                    window.open(url, '_blank').focus();
                }
                setTransactionStatus({
                    status: 400,
                    errorMessage: sendError
                })
            }
            setLoadingGamble(false)
        } else {
            setOpenConnect(true)
        }
    
    }
      
    return (
        <div>
            <div className={`flex items-center bg-white shadow-sm shadow-gray-300 rounded p-10 container sm:container justify-center`}>
                <button 
                    className={`h-9 text-white font-medium bg-green hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2 sm:mr-20 
                                disabled:cursor-not-allowed disabled:bg-gray-400 disabled:brightness-100`}
                    disabled={betState != 1}
                    name='setTimestamp'
                    onClick={handleSubmit}>
                    Check timestamp
                    
                </button>
                <button 
                    className={`h-9 text-white font-medium bg-green hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2 sm:mr-20
                                disabled:cursor-not-allowed disabled:bg-gray-400 disabled:brightness-100`}
                    disabled={betState != 2}
                    name='setWinner'
                    onClick={handleSubmit}>
                    Check winner
                </button>
                <button 
                    className={`h-9 text-white font-medium bg-green hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2
                                disabled:cursor-not-allowed disabled:bg-gray-400 disabled:brightness-100`}
                    disabled={betState != 0 || matchTimestamp - 3600 > parseInt(Date.now() / 1000)}
                    name='setCheckingWinner'
                    onClick={handleSubmit}>
                    Close bet
                </button>
            </div>
            {
            transactionStatus.status == 200 && 
            <div className='flex sm:justify-center items-center mt-6'>
                <CheckCircleIcon className='w-6 h-6 mr-1 text-green'/>
            <p className='text-green font-medium text-sm sm:text-base text-center'>  {`Your transaction has succeed `}
            </p>
            </div>
            
            } 
            {
                transactionStatus.status == 400 && 
                <div className='flex sm:justify-center sm:items-center mt-6'>
                    <XCircleIcon className='w-6 h-6 mr-1 text-red'/>
                    <p className='text-red font-medium text-sm sm:text-base text-center'>{ transactionStatus.errorMessage }</p>
                </div>
            }
        </div>
    )
}
