import React, { useState } from 'react';
import types from '../bet-types/types';
import { MinusIcon, PlusIcon } from '@heroicons/react/solid';
import { FilterSubtypes } from './FilterSubtypes';

export const FilterTypes = ({ type, setGamblesFiltered, getGambleByType, getGambleBySubType }) => {

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setGamblesFiltered(getGambleByType(type))
    }


    return (
        <div className='type mb-3'>
            <li className='flex items-center' onClick={ () => { setOpen(!open) } }>
                {!open && <PlusIcon className='w-5 h-6 inline-block cursor-pointer mr-1.5' />}
                { open && <MinusIcon className='w-5 h-6 inline-block cursor-pointer mr-1.5' />}
                <span className='cursor-pointer' 
                // onClick={ handleClick }
                >{ type }</span>
                
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
