import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import { useAccount, useContract, useSigner } from 'wagmi';
import betjson from '../../artifacts/contracts/GambleGame.sol/Bet.json';
import { StoreContext } from '../store/storeProvider';
import { ethers } from 'ethers';
import { ModalLoading } from './ModalLoading';
import { submitRel } from '../functions/relEoaBet';

export const EnterGambleForm = ({ betAddress, firstTeam, secondTeam, betState, State, acceptTie, manager }) => {

    const [, setOpenConnect] = useContext(StoreContext);

    const router = useRouter();

    const [{ data: signer, isError, isLoading }] = useSigner();
    const [{ data: account, isError: isErrorAcc, isLoading: isLoadingAcc }] = useAccount()

    const betInstance = useContract({
        addressOrName: betAddress,
        contractInterface: betjson.abi,
        signerOrProvider: signer,
      })

    const [formData, setFormData] = useState({
        team: firstTeam,
        amount: 0.002
    });

    const [formErrors, setFormErrors] = useState({});

    const [isValidated, setIsValidated] = useState(false);

    const [loadingGamble, setLoadingGamble] = useState(false)

    const [transactionStatus, setTransactionStatus] = useState({
        status: 0,
        errorMessage: ''
    })

    useEffect(() => {
        
        const validate = ( values ) => {
            const errors = {}
    
            if ( values.team != firstTeam && values.team != secondTeam && values.team != "Tie" ) {
                errors.team = 'Please choose a valid team'
            }
            if ( values.amount < 0.002 ) {
                errors.amount = 'The minimum amount is 0.002 ETH'
            }
            return errors
        }
        
        setFormErrors( validate(formData) )
    }, [formData]);

    useEffect(() => {
        if(Object.keys(formErrors).length === 0){
            setIsValidated(true)
        } else {
            setIsValidated(false)
        }
    }, [formErrors]);
    
    if (betState != State.Open) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })     
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(isValidated) {
            if( account ) {
                const value = formData.amount.toString()
                try {
                    setLoadingGamble(true)
                    const tx = await betInstance.enterGamble( formData.team, {value: ethers.utils.parseEther(value), from: account.address})
                    await tx.wait()
                    const isowner = manager == account.address ? 1 : 0
                    const body = {account: account.address, bet: betAddress, isowner}
                    submitRel(body)
                    setTransactionStatus({
                        status: 200,
                        errorMessage: ''
                    })
                    router.replace(`/gambles/${betAddress}`)
                } catch (err) {
                    console.log(err)
                    setTransactionStatus({
                        status: 400,
                        errorMessage: err.message
                    })
                }
                setLoadingGamble(false)
            } else {
                setOpenConnect(true)
            }
        }
    }

    
    return (
        <>
        
        <form className='my-6 flex flex-col items-center' onSubmit={ handleSubmit } >
            <label className='flex flex-col items-center sm:block sm:mb-3 mb-8'>
                <span className=''><span className='font-bold'>Team</span> you want to gamble for:</span>
                <select className='px-3 py-1 sm:ml-3 border border-solid border-gray-300 rounded text-sm mt-3 sm:mt-0' value={ formData.team } name={ 'team' } onChange={ handleChange } >
                    <option value={ firstTeam }>{ firstTeam }</option>
                    <option value={ secondTeam }>{ secondTeam }</option>
                    {acceptTie && <option value={ 'Tie' }>Tie</option>}
                </select>

            </label>
            <label className='flex flex-col items-center sm:block sm:mb-3 mb-8 '>
                <span><span className='font-bold'>Amount</span> (in ETH):</span>
                <input className='w-24 px-2 py-1 sm:ml-3 border border-solid border-gray-300 rounded text-sm mt-3 sm:mt-0' type={ 'number' } value={formData.amount} name={ 'amount' } onChange={ handleChange }/>
            </label>
            { formErrors.team && <p className='text-red text-sm font-medium mb-3'>{ formErrors.team }</p> }
            { formErrors.amount && <p className='text-red text-sm font-medium mb-3'>{ formErrors.amount }</p> }
            <button className='h-9 text-white font-medium bg-green hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-2'>Enter gamble</button>
        </form>
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
        {
            loadingGamble &&
            <ModalLoading 
                setLoadingGamble={setLoadingGamble}
            />
        }
        </>
    )
};
