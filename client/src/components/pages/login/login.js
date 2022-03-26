import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';

import { isCheckAuth } from '../../../actions';
import './login.css';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const loginHandler = () => {
        axios.post('/api/login', {login, password}, {
            headers: {
                'XSRF-TOKEN': Cookies.get('XSRF-TOKEN')
            }
        })
        .then((response) => {
            console.log(response);
            dispatch(isCheckAuth());
            navigate('/');
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