import { createContext, useReducer } from "react";
import storeReducer, { initialStore, types } from "./storeReducer";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(storeReducer, initialStore)
    const setOpenConnect = (connect) => dispatch({type: types.setConnect, payload: connect})
    const loadBets = (bets) => dispatch({ type: types.loadBets, payload: bets})
    const filterBets = (type, typeOrSubstype) => dispatch({ type: types[typeOrSubstype], payload: type})

    return(
        <StoreContext.Provider value={[store, setOpenConnect, { loadBets, filterBets }]}>
            {children}
        </StoreContext.Provider>
    )
}

export { StoreContext }
export default StoreProvider