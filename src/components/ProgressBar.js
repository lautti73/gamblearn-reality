import React from 'react';

export const ProgressBar = ({ total, firstTeamCount, secondTeamCount, width, height }) => {

    const percentageFirst = `${(firstTeamCount / total * 100).toFixed(1)}%`
    const percentageSecond = `${(secondTeamCount / total * 100).toFixed(1)}%`

    const styleBar = {
        width,
        height
    }

    const styleCompleted = {
        width: percentageSecond
    }

    return (
        <div className='h-5 w-10/12 bg-sky-400 rounded mt-3 relative' style={ styleBar }>
            
            <div className='h-full bg-indigo-400 rounded-r ml-auto' style={ styleCompleted }>
                <span className='absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium'>{ percentageFirst }</span>
                <span className='absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white font-medium'>{ percentageSecond }</span>
            </div>
        </div>
    )
};
