import React, { useContext, useState } from 'react';
import types from '../bet-types/types';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { FilterSubtypes } from './FilterSubtypes';
import { StoreContext } from '../store/storeProvider';

export const FilterTypes = ({ type, setGamblesFiltered, getGambleByType, getGambleBySubType }) => {

    const [,, {filterBets}] = useContext(StoreContext)
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        filterBets(type, 'filterTypes');
    }


    return (
        <div className='type mb-3'>
            <li className='flex items-center' onClick={ () => { setOpen(!open)} }>
                <div onClick={handleClick}>
                    {!open && <PlusIcon className='w-5 h-6 inline-block cursor-pointer mr-1.5' />}
                    { open && <MinusIcon className='w-5 h-6 inline-block cursor-pointer mr-1.5' />}
                    <span className='cursor-pointer'>{ type }</span>
                </div>
            </li>
            <ul>
            {
                Object.keys(types[type]).map( (el, i) => {
                    return <FilterSubtypes 
                        key={ i }
                        subtype={ el }
                        open={ open }
                        setGamblesFiltered={ setGamblesFiltered }
                        getGambleBySubType={ getGambleBySubType }

                    />
                })
            }
            </ul>
        </div>
    )
};
