import React, { useState } from 'react';
import { EnterGambleForm } from './EnterGambleForm';
// import { ManageGamble } from './ManageGamble';
import { ProgressBar } from './ProgressBar';
import { ClipboardCheckIcon, ClipboardCopyIcon } from '@heroicons/react/solid';
import { ethers } from 'ethers';
import { ManageGamble } from './ManageGamble';
import { format } from 'path';
import { formatEther } from 'ethers/lib/utils';

export const GambleBody = ({ bet }) => {
    const { betAddress, firstTeam, secondTeam, description, players, balance, manager, betState, winner, type, subtype, acceptTie, matchTimestamp, questionId, realityAddress } = bet;
    
    const [clipboard, setClipboard] = useState(false);
    console.log(matchTimestamp)
    const State = {
        Open: 0,
        "Checking timestamp": 1,
        "Checking winner": 2,
        Completed: 3,
        Cancelled: 4
    }
    
    let completedDateFormated;
    // if (isCompleted) {
        //     const date = new Date(completedDate * 1000)
        //     completedDateFormated = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes() < 10? '0' + date.getMinutes() : date.getMinutes()  }`
        // }
        
    let firstTeamCount = 0;
    
    players.forEach(element => { 
        if (element[1] === firstTeam) {
            firstTeamCount += 1
        }
    });
    
    let stateText;
    for (const s in State) {
        if (State[s] == betState) {
            stateText = s;
        }
    }
    // console.log(completedDateFormated)

    return (
        <main className='flex-col items-center sm:container mx-5 sm:mx-auto mt-8 mb-24'>
            <div className='relative flex flex-col items-center bg-white shadow-sm shadow-gray-300 rounded p-10 container sm:container'>
                <p className='font-bold sm:text-5xl text-3xl mb-8 text-blackfont text-center'> { `${firstTeam} vs ${secondTeam}` } </p>
                <p className='sm:text-lg mt-2 mb-2 text-center'> There are <span className='font-bold'>{ `${players.length} people` }</span> gambling </p>
                <p className='sm:text-lg mb-2 text-center'> The pool reward for this is <span className='font-bold'>{ `${ethers.utils.formatEther(balance)}`} <span className='text-sm font-bold'>ETH</span></span></p>
                <div className='max-w-7xl mb-2 sm:px-10 px-2 flex flex-col text-center'>
                    <p><span className='sm:text-lg'>Description:</span> {`${ description }`}</p>
                </div>
                <div className='w-full max-w-screen-sm flex justify-center items-center mt-2 mb-6'>

                    <ProgressBar
                            total={ players.length }
                            firstTeamCount={ firstTeamCount }
                            secondTeamCount={ players.length - firstTeamCount }
                    />
                </div>

                <EnterGambleForm
                    betAddress={ betAddress }
                    firstTeam={ firstTeam }
                    secondTeam={ secondTeam }
                    State={ State }
                    betState={ betState }
                    acceptTie={acceptTie}

                />
                <p className='lg:absolute block lg:bottom-16 lg:right-10 font-bold sm:text-lg mt-6'>{ type }</p>
                <p className='lg:absolute block lg:bottom-10 lg:right-10 text-sm sm:text-base'>{ subtype }</p>
                <p className={`mt-8 mb-4 sm:mt-12 lg:mt-0 sm:px-4 py-1 px-2 text-sm sm:text-base lg:absolute block sm:top-4 sm:left-10 rounded-2xl ${betState === 0 ? 'bg-green text-white' : 'bg-gray-300' }`}>{stateText}</p>
                <div className='mt-3 mb-6 text-center hidden sm:flex items-center' onClick={ () => { navigator.clipboard.writeText(manager); setClipboard(true) } }> 
                    <p>The manager of this gamble is: <span className='font-medium'>{ manager }</span></p>
                    { !clipboard && <ClipboardCopyIcon className='w-5 h-5 ml-2 text-blackfont'/> }
                    { clipboard && <ClipboardCheckIcon className='w-5 h-5 ml-2 text-green'/> }
                </div>
                <div className='mt-8 mb-8 sm:hidden text-center '>The manager of this gamble is:
                    <div className='flex flex-wrap justify-center items-center' onClick={ () => { navigator.clipboard.writeText(manager); setClipboard(true) } }>
                        <span className='block font-medium ml-2'>{ `${ manager.slice(0, 4)}...${manager.slice(-5)}` } </span>
                        { !clipboard && <ClipboardCopyIcon className='w-5 h-5 ml-2 text-blackfont'/> }
                        { clipboard && <ClipboardCheckIcon className='w-5 h-5 ml-2 text-green'/> }
                    </div>
                </div>
                
                {/* { 
                    isCompleted && 
                    <div className='mt-6 '>
                        <p className='text-green text-center'>{ completedByWinner
                        ? `The gamble finished at ${ completedDateFormated }, the winner team is ${ winnerEth }.` 
                        : `The gamble was canceled on ${ completedDateFormated }` }
                        </p>
                    </div> 
                } */}
            </div>
                
            <ManageGamble
                betAddress={ betAddress }
                betState={ betState }
                matchTimestamp={ matchTimestamp }
                questionId={questionId}
                realityAddress={realityAddress}
            />
            
        </main>
    )
};
