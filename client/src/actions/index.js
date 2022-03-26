import Cookies from 'js-cookie';

const isCheckAuth = () => {
    return {
        type: 'IS_CHECK_AUTH',
        payload: Cookies.get('logged_in')
    }
}

export {
    isCheckAuth
}