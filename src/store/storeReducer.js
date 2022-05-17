import { type } from "os";
import { filterType } from "../functions/filterType";

const types = {
    setConnect: 'set - connect',
    logged: 'login - bool',
    filterTypes: 'filter - type',
    filterSubtypes: 'filter - subtypes',
    loadBets: 'load - bets',
    filterOwner: 'filter - owner'
}

const initialStore = {
    openConnect: false,
    logged: false,
    bets: [],
    filteredBets: [],
    filtersByType: [],
    filtersBySubtype: [],
    ownerFilteredBets: [],
    filterOwner: false,
}

const storeReducer = (state, action) => {
    switch(action.type) {
        case types.setConnect:
            return {
                ...state,
                setConnect: action.payload
            }
        case types.logged:
            return {
                ...state,
                logged: action.payload
            }
        case types.loadBets:
            return {
                ...state,
                bets: action.payload,
                filteredBets: action.payload,
                ownerFilteredBets: action.payload
            }
        case types.filterTypes: {
            let updatedFilters = [...state.filtersByType];
            let filteredBets = [];

            // If there is a filter with the same name (action.payload) applied, then remove it, else add it.
            if (state.filtersByType.includes(action.payload)) {
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
        case types.filterOwner: {
            let ownerFilteredBets = state.filteredBets;
            if (!state.filterOwner) {
                ownerFilteredBets = state.filteredBets.filter( (bet) =>
                bet.manager == action.payload
                )   
            }
            return {
                ...state,
                filterOwner: !state.filterOwner,
                ownerFilteredBets
            }
        }
        default:
            return state;
    }
}

export {initialStore, types}
export default storeReducer