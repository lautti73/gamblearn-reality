import React, { useContext, useRef } from 'react'
import { AdjustmentsIcon } from '@heroicons/react/solid';
import types from '../bet-types/types';
import { FilterTypes } from './FilterTypes';
import { StoreContext } from '../store/storeProvider';
import { useAccount } from 'wagmi';
// import { ModalFilters } from './ModalFilters';

export const FilterOwner = () => {
    const [{data: account}] = useAccount();
    const [,, {filterBets}] = useContext(StoreContext);
    const filterOwner = useRef();

    const handleClick = () => {
        filterBets(account.address, 'filterOwner');
        console.log(filterOwner.current?.checked)
    }
    return (<>
                    <div className='types mt-3'>
                        <div className='type mb-9'>
                            <li className='flex items-center'>
                                <div>
                                    <label className='flex items-center'>
                                        <input className='inline-block mr-2 ml-1' type='checkbox' ref={filterOwner} onChange={handleClick}/>
                                        <span className='inline-block cursor-pointer text'>I'm owner</span>
                                    </label>
                                    
                                </div>
                            </li>
                        </div>
                    </div>
            {/* { openFilters && <ModalFilters setOpenFilters={ setOpenFilters }>

                    <div className='official mt-4 text-xl'>
                        <div className='mb-2'>
                            <input type='radio' name='filter2' className='mr-2' checked={ official.current } value='official' onChange={ handleChangeRadio }/>
                            <label>Official</label>
                        </div>
                        <div>
                            <input type='radio' name='filter2' className='mr-2' value='notOfficial' checked={ !official.current } onChange={ handleChangeRadio }/>
                            <label>No-official</label>
                        </div>  
                    </div>
                    <div className='types mt-12 text-xl'>
                    {
                        Object.keys(types).map( (el, i)  => {
                            return <FilterTypes
                                key={ i }
                                type={ el }
                                getGambleBySubType= { getGambleBySubType }
                                getGambleByType={ getGambleByType }
                                setGamblesFiltered={ setGamblesFiltered }
                            />
                        })
                    }
                    </div>
            </ModalFilters> } */}
            </>
            )
}
