import React from 'react';
import './home.css';


const Home = (props) => {

    const {onLogout, onRefreshToken} = props

   

    return (
        <div className="home">
            <button 
            type="button"
            onClick={onRefreshToken}>Рефрещить токен</button>
            <button 
            type="button"
            onClick={onLogout}>Выйти</button>
        </div>
    )
}

export default Home;