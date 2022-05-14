import Cookies from 'js-cookie';

const initialState = {
    loggedIn: Cookies.get('logged_in') || 'no'
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'IS_CHECK_AUTH':
            return {
                ...state,
                loggedIn: action.payload
            }
        case "ADMIN_MENU":
            return {
                ...state,
                menuAdmin : action.payload
            } 
        case "MENU":
            return {
                ...state,
                menu : action.payload
            }
        default:
            return state
    }
}

export default reducer;