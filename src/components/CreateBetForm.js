import Link from 'next/link';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ModalLoading } from './ModalLoading';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/solid';
import types from '../bet-types/types';
import { BetType } from './BetType';
import { ethers } from 'ethers';


export const CreateBetForm = () => {

    const subtypeValueRef = useRef();

    const [formData, setFormData] = useState({
        firstTeam: '',
        secondTeam: '',
        description: '',
        type: Object.keys(types)[0],
        subtype: ''
    });

    const [isValidated, setIsValidated] = useState(false);

    const [formErrors, setFormErrors] = useState({});

    const [loadingGamble, setLoadingGamble] = useState(false)

    const [newBetStatus, setNewBetStatus] = useState({
        status: 0,
        newBet: '',
        errorMessage: ''
    })

    useEffect(() => {
        
        const validate = ( values ) => {
            const errors = {}
            
            if (!values.firstTeam) {
                errors.firstTeam = 'Team 1 is required'
            }
            if (!values.secondTeam) {
                errors.secondTeam = 'Team 2 is required'
            }
            if ( values.firstTeam == values.secondTeam ) {
                errors.distinctTeam = 'The name of the teams can\'t be the same'
            }
            if (!values.description) {
                errors.description = 'Description is required'
            }
            if (!values.type) {
                errors.type = 'Type is required'
            }
            if (!values.subtype) {
                errors.subtype = 'Subtype is required'
            }
            if (values.firstTeam.length > 30 || values.secondTeam.length > 30  ) {
                errors.teamLength = 'The name of the team can\'t be longer than 30 characters'
            }
            if (values.description.length > 300  ) {
                errors.descLength = 'The description can\'t be longer than 300 characters'
            }
            if (values.type.length > 30 || values.subtype.length > 30  ) {
                errors.typesLength = 'The types and sub-types can\'t be longer than 30 characters'
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

    useEffect(() => {
        setFormData({
            ...formData,
            subtype: subtypeValueRef.current.value
        }) ;
    
    }, [formData.type]);

    useLayoutEffect(() => {
        if (loadingGamble) {
          document.body.style.overflow = "hidden";
          document.body.style.height = "100%";
        }
        if (!loadingGamble) {
          document.body.style.overflow = "auto";
          document.body.style.height = "auto";
        }
      }, [loadingGamble]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async(e) => {
        e.preventDefault()
            const accounts = await web3.eth.getAccounts()
            if( accounts.length > 0 && ethereum.isConnected() ) {
                if(isValidated) {

                    try {
                        setLoadingGamble(true)
                        const newBet = await factory.methods.createGambleGame( formData.firstTeam, formData.secondTeam, formData.description, formData.type, formData.subtype ).send({
                             from: accounts[0], 
                        })
                        setNewBetStatus({
                            status: 200,
                            newBet: newBet.events.eCreateGamble.returnValues.newBet,
                            errorMessage: ''
                        }  )
                    } catch (err) {
                        console.log(err)
                        setNewBetStatus({
                            status: 400,
                            newBet: '',
                            errorMessage: err.message
                        }  )
                    }
                    setLoadingGamble(false)
                }

            } else {
                if (typeof window.ethereum !== 'undefined' ) {
                    await window.ethereum.request({ method: 'eth_requestAccounts' })

                } else {
                    setInstallMetamask( true )
                }
            }
    }


    return (
        <form className='sm:container md:w-3/4 xl:w-1/2  flex flex-col items-center sm:mx-auto mx-5 bg-white shadow-sm shadow-gray-300 rounded sm:p-10 p-6' autoComplete='off' onSubmit={ handleSubmit } >
            <h1 className='font-bold text-3xl text-center text-blackfont mb-8'>Create Gamble</h1>
            <div className='sm:mx-auto w-full sm:w-auto'>
                <div className='flex flex-col sm:flex-row sm:justify-between items-center sm:items-stretch'>

                    <label className='w-full sm:w-auto sm:mb-6 mb-8 text-center sm:text-left '>
                        <span className='block mb-1.5 sm:mb-1 '>Team 1</span>
                        <input type='text' className='block sm:w-44 w-full px-2 py-1 border border-solid border-gray-300 rounded text-sm' name='firstTeam' onChange={ handleChange }/>
                    </label>
                    <label className='w-full sm:w-auto sm:mb-6 mb-8 text-center sm:text-left'>
                        <span className='block mb-1.5 sm:mb-1'>Team 2</span>
                        <input type='text' className='block sm:w-44 w-full px-2 py-1 border border-solid border-gray-300 rounded text-sm' name='secondTeam' onChange={ handleChange }/>
                    </label>
                </div>
                <label className='block sm:mb-6 mb-8 text-center sm:text-left'>
                    <span className='block mb-1.5 sm:mb-1'>Description</span>
                    <textarea className='block sm:w-96 w-full h-40 px-2 py-1 border border-solid border-gray-300 rounded text-sm' name='description' onChange={ handleChange }/>
                </label>
                <div className='flex flex-col sm:flex-row sm:justify-between items-center sm:items-start'>
                    <label className='w-full sm:w-auto block sm:mb-6 mb-8 text-center sm:text-left'>
                        <span className='block mb-1.5 sm:mb-1'>Type:</span>
                        <select className='sm:w-44 w-full px-2 py-1 border border-solid border-gray-300 rounded text-sm block ' name='type' onChange={ handleChange }>
                            {Object.keys(types).map( (e, i) => {
                                return <BetType 
                                            key={ i }
                                            type={ e }
                                        /> 
                            }) 
                            }
                        </select>
                    </label>
                    <label className='w-full sm:w-auto block sm:mb-6 mb-8 text-center sm:text-left'>
                        <span className='block mb-1.5 sm:mb-1'>Sub-type:</span>
                        <select className='sm:w-44 w-full px-2 py-1 border border-solid border-gray-300 rounded text-sm block' ref={subtypeValueRef} size={ 1 } name='subtype' onChange={ handleChange }>
                            {Object.keys(types[formData.type]).map( (e, i) => {
                                return <BetType 
                                            key={ i }
                                            type={ e }
                                        /> 
                            }) 
                            }    
                        </select>
                    </label>
                </div>
                { formErrors.firstTeam && <p className='text-red text-sm font-medium text-center mt-4 mb-1 '> * { formErrors.firstTeam } </p>}
                { formErrors.secondTeam && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.secondTeam } </p>}
                { formErrors.description && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.description } </p>}
                { formErrors.type && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.type } </p>}
                { formErrors.subtype && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.subtype } </p>}
                { formErrors.distinctTeam && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.distinctTeam } </p>}
                { formErrors.teamLength && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.teamLength } </p>}
                { formErrors.descLength && <p className='text-red text-sm font-medium text-center my-1 '> * { formErrors.descLength } </p>}
                { formErrors.typesLength && <p className='text-red text-sm font-medium text-center mb-4 mt-1 '> * { formErrors.typesLength } </p>}
                <button className='block mx-auto h-9 text-white font-medium bg-green hover:brightness-110 active:brightness-95 px-5 py-1 rounded mt-10'>Create gamble</button>
               
            </div>
            {
            newBetStatus.status == 200 && 
            <div className='flex sm:justify-center sm:items-center mt-6'>
                <CheckCircleIcon className='w-6 h-6 mr-1 text-green'/>
            <p className='text-green font-medium text-sm sm:text-base text-center'>  {`Your gamble has been created succesfully, save the `} 
                <Link href={`gambles/${ newBetStatus.newBet }`}><a className='underline' target='_blank'>link</a></Link>!
            </p>
            </div>
            
            } 
            {
            newBetStatus.status == 400 && 
            <div className='flex sm:justify-center sm:items-center mt-6'>
                <XCircleIcon className=' w-6 h-6 mr-1 text-red'/>
                <p className='text-red font-medium text-sm sm:text-base text-center'>{ newBetStatus.errorMessage }</p>
            </div>
            }
        </form>
        
    )
};
