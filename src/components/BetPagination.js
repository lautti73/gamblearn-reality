import React, { useEffect, useRef, useState } from 'react'
import { BetContainer } from './BetContainer'
import { PageNumbers } from './PageNumbers';

export const BetPagination = ({ bets }) => {

    const [pageNumber, setPageNumber] = useState(1);

    const [pagination, setPagination] = useState({
        bets: bets,
        currentPage: pageNumber,
        betsPerPage: 2,
    });

    useEffect(() => {
        setPagination({
            ...pagination,
            currentPage: pageNumber
        })
      
    }, [pageNumber])

    const { currentPage, betsPerPage } = pagination;

    const indexOfLastBet = currentPage * betsPerPage;
    const indexOfFirstBet = indexOfLastBet - betsPerPage;
    const currentBets = pagination.bets.slice(indexOfFirstBet, indexOfLastBet);
    const currentBetsReversed = currentBets.reverse();
    
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(pagination.bets.length / betsPerPage); i++) {
        pageNumbers.push(i);
    }

    let showPages = [];
    if (pageNumber === 1) {
        showPages = pageNumbers.slice(pageNumber - 1, pageNumber + 2)
    } else if (pageNumber === pageNumbers.length) {
        showPages = pageNumbers.slice(-3)
    } else {
        showPages = pageNumbers.slice(pageNumber - 2, pageNumber + 1)
    }

    return (
        <>
        
        {
            currentBets.map( bet =>
                    <BetContainer
                        key={bet.address}
                        bets={bet}
                    />
            )
        }
        <ul className='w-fit mt-24 flex self-center justify-center border rounded border-solid border-gray-300 shadow-sm shadow'>
            <button className='px-2 py-1 bg-white rounded-l disabled:cursor-not-allowed border-r border-solid border-gray-300' onClick={ () => setPageNumber( pageNumber - 1)  } disabled={ currentPage === 1 } >Prev</button>
        { 
            
            showPages.map( (number) => {
                return (
                    <PageNumbers
                        key={ number }
                        id={ number }
                        pagination={ pagination }
                        setPageNumber={ setPageNumber }
                    />
                )
            } )
        }
            <button className='px-2 py-1 bg-white rounded-r disabled:cursor-not-allowed' disabled={ pageNumber === Math.max(...pageNumbers) } onClick={ () => setPageNumber( pageNumber + 1)  }>Next</button>
        </ul>
        
        </>
    )
}
