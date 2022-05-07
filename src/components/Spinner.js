import React from 'react';

export const Spinner = ({ size, borderSize }) => {

    const style = {
        width: size,
        height: size,
        borderWidth: borderSize
    }

    return (
        <div className='animate-spin w-14 h-14 border-8 rounded-full border-l-emerald-500' style={ style }>

        </div>
    )
};
