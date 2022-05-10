import React, { useContext } from 'react';
import { StoreContext } from '../store/storeProvider';

export const FilterSubtypes = ({ subtype, open, getGambleBySubType, setGamblesFiltered }) => {

    if(!open) return null;

    const [,, {filterBets}] = useContext(StoreContext)

    const handleClick = () => {
        filterBets(subtype, 'filterSubtypes');
    }

    return (
        <li className='list-none ml-7 cursor-pointer mt-1' 
        onClick={ handleClick }
        >
            { subtype }
        </li>
    )
};
