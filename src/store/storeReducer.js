import { type } from "os";

const types = {
    setConnect: 'set - connect',
}

const initialStore = {
    openConnect: false,
}

const storeReducer = (state, action) => {
    switch(action.type) {
        case types.setConnect:
            return {
                ...state,
                setConnect: action.payload
            }
        default:
            return state;
    }
}

export {initialStore, types}
export default storeReducer