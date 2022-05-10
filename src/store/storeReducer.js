import { type } from "os";
import { filterType } from "../functions/filterType";

const types = {
    setConnect: 'set - connect',
    filterTypes: 'filter - type',
    filterSubtypes: 'filter - subtypes',
    loadBets: 'load - bets'
}

const initialStore = {
    openConnect: false,
    bets: [],
    filteredBets: [],
    filtersByType: [],
    filtersBySubtype: []
}

const storeReducer = (state, action) => {
    switch(action.type) {
        case types.setConnect:
            return {
                ...state,
                setConnect: action.payload
            }
        case types.loadBets:
            return {
                ...state,
                bets: action.payload,
                filteredBets: action.payload
            }
        case types.filterTypes: {
            let updatedFilters = [...state.filtersByType];
            let filteredBets = [];

            // If there is a filter with the same name (action.payload) applied, then remove it, else add it.
            if (state.filtersByType.find( filter => filter == action.payload)) {
                updatedFilters = state.filtersByType.filter( filter => filter != action.payload)
            } else {
                updatedFilters.push(action.payload)
            }

            // If there is no filter applied, then show all bets
            if (updatedFilters.length > 0) {
                filteredBets = filterType(state.bets, updatedFilters, 'type');
            } else {
                filteredBets = state.bets;
            }
            
            return {
                ...state,
                filtersByType: updatedFilters,
                filteredBets
            }
        }
        case types.filterSubtypes: {
            let updatedFilters = [...state.filtersBySubtype];
            let filteredBets = [];

            // If there is a filter with the same name (action.payload) applied, then remove it, else add it.
            if (state.filtersBySubtype.find( filter => filter == action.payload)) {
                updatedFilters = state.filtersBySubtype.filter( filter => filter != action.payload)
            } else {
                updatedFilters.push(action.payload)
            }

            // If there is no subtype filter applied, then show all TYPES filters applied
            if (updatedFilters.length > 0) {
                filteredBets = filterType(state.filteredBets, updatedFilters, 'subtype');
            } else {
                filteredBets = filterType(state.bets, state.filtersByType, 'type');
            }
            
            return {
                ...state,
                filtersBySubtype: updatedFilters,
                filteredBets
            }
        }
        default:
            return state;
    }
}

export {initialStore, types}
export default storeReducer