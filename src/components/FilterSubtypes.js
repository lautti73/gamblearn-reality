import React from 'react';

export const FilterSubtypes = ({ subtype, open, getGambleBySubType, setGamblesFiltered }) => {

    if(!open) return null;

    const handleClick = () => {
        setGamblesFiltered(getGambleBySubType(subtype))
    }

    return (
        <li className='list-none ml-7 cursor-pointer mt-1' 
        // onClick={ handleClick }
        >
            { subtype }
        </li>
    )
};
