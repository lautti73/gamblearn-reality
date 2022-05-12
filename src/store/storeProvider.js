import { createContext, useReducer } from "react";
import storeReducer, { initialStore, types } from "./storeReducer";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(storeReducer, initialStore)
    const setOpenConnect = (connect) => dispatch({type: types.setConnect, payload: connect})
    const loadBets = (bets) => dispatch({ type: types.loadBets, payload: bets})
    const filterBets = (type, typeOrSubstype) => dispatch({ type: types[typeOrSubstype], payload: type})
    const setLogin = (logged) => dispatch({ type: types.logged, payload: logged})

    return(
        <StoreContext.Provider value={[store, setOpenConnect, { loadBets, filterBets, setLogin }]}>
            {children}
        </StoreContext.Provider>
    )
}

export { StoreContext }
export default StoreProvider