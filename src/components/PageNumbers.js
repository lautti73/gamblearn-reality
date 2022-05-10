import React from 'react'

export const PageNumbers = ({ id, pagination, setPageNumber }) => {

    const handleClick = (e) => {
        setPageNumber(
            Number(e.target.id)
        );
    }

    return (
        <li id={id} onClick={handleClick} className={`px-2 py-1 cursor-pointer border-r border-solid border-gray-300 ${ pagination.currentPage == id ? 'bg-sky-400 text-white' : 'bg-white text-black' }`}>
            { id }
        </li>
    )
}
