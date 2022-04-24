import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './app-layout.css';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <div className='navbar'>
                <div className='container'>
                    <div className='logo'>Your Logo</div>
                    <ul className='menu'>
                        <li>
                            <Link to='/'>Операторы</Link>
                        </li>
                        <li>
                            <Link to='/order'>Заказы</Link>
                        </li>
                        <li>
                            <Link to='/debts'>Долги</Link>
                        </li>
                    </ul>
                    <div className='name'>Jo'rayev Temur</div>
                </div>
            </div>
            <div className='app-wrapper'>
                <div className='outlet'>
                    <Outlet />
                </div>
                <div className='bg-dark'/>
            </div>
        </div>
    )
}

export default AppLayout;