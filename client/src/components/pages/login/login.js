import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../../utils/axiosInterceptors';

import { isCheckAuth } from '../../../actions';
import './login.css';

const Login = () => {
    const dispatch = useDispatch();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = () => {
        axios.post('/api/user/login', {login, password})
        .then((response) => {
            console.log(response);
            dispatch(isCheckAuth());
        })
        .catch((err) => {
            console.log(err.response);
        })
    }

    return (
        <div className="login">
            <h1>Login</h1>
            <input 
            type="text"
            placeholder="login"
            value={login}
            onChange={(e) => setLogin(e.target.value)} />
            <input 
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
            <button 
            type="button"
            onClick={loginHandler}>Войти</button>
        </div>
    )
}

export default Login;