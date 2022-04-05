import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from '../../../utils/axiosInterceptors';

import { isCheckAuth } from '../../../actions';
import './home.css';


const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        axios.get('/api/system')
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err.response);
            })
    })

    const logoutHandler = () => {
        axios.delete('/api/user/logout')
        .then((response) => {
            dispatch(isCheckAuth());
            console.log(response);
        })
        .catch((err) => {
            console.log(err.response);
        })
    }

    const refreshTokenHandler = () => {
        axios.get('/api/token/refresh/access')
            .then((response) => {
                console.log(response);
            })
            .catch((err) => {
                console.log(err.response);
            })
    }

    return (
        <div className="home">
            <button 
            type="button"
            onClick={refreshTokenHandler}>Рефрещить токен</button>
            <button 
            type="button"
            onClick={logoutHandler}>Выйти</button>
        </div>
    )
}

export default Home;