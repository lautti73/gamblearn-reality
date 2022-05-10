import React from 'react'
import { AdjustmentsIcon } from '@heroicons/react/solid';
import types from '../bet-types/types';
import { FilterTypes } from './FilterTypes';
// import { ModalFilters } from './ModalFilters';

export const FilterBets = () => {
    return (
        <div>
            <div className='mb-6 px-2.5 py-2 bg-white rounded shadow-md shadow-gray-300 lg:hidden'>
                <div className='flex items-center justify-center' 
                // onClick={ () => { setOpenFilters( true ) }}
                >
                    <AdjustmentsIcon className='w-5 h-5 rotate-90 mr-1'/>
                    <p className='font-bold'>Filters</p>
                </div>
            </div>
            <aside className='w-80 px-6 py-6 mr-5 bg-white shadow-md shadow-gray-400 rounded hidden lg:block'>
                    <div className='types mt-3'>
                    {
                        Object.keys(types).map( (el, i)  => {
                            return <FilterTypes 
                                type={el}
                            />
                        })
                    }
                    </div>
            </aside>
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
    
        </div>
)
}
