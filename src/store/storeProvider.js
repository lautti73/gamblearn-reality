import { createContext, useReducer } from "react";
import storeReducer, { initialStore, types } from "./storeReducer";

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
    const [store, dispatch] = useReducer(storeReducer, initialStore)
    const setOpenConnect = (connect) => dispatch({type: types.setConnect, payload: connect})

    return(
        <StoreContext.Provider value={[store, setOpenConnect]}>
            {children}
        </StoreContext.Provider>
    )
}

export { StoreContext }
export default StoreProvider