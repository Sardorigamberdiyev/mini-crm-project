import Cookies from 'js-cookie';

const isCheckAuth = () => {
    return {
        type: 'IS_CHECK_AUTH',
        payload: Cookies.get('logged_in')
    }
}

const ChangeAdminMenu = (payload) =>{
    return {
        type: "ADMIN_MENU",
        payload
    }
}

const ChangeMenu = (payload) =>{
    return {
        type: "MENU",
        payload
    }
}
export {
    isCheckAuth,
    ChangeMenu,
    ChangeAdminMenu
}