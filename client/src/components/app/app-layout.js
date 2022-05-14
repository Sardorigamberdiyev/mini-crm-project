import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './app-layout.css';

const AppLayout = () => {
    
    const menu = useSelector(state => state.menu)

    return (
        <div className="app-layout">
            <div className='navbar'>
                <div className='container'>
                    <div className='logo'>Your Logo</div>
                    <ul className='menu'>
                        <li className={menu === 'home' ? 'active' : ''}>
                            <Link to='/'>Операторы</Link>
                        </li>
                        <li className={menu === 'order' ? 'active' : ''}>
                            <Link to='/order'>Заказы</Link>
                        </li>
                        <li className={menu === 'debts' ? 'active' : ''}> 
                            <Link to='/debts'>Долги</Link>
                        </li>
                    </ul>
                    <div className='name'>
                        <Link to='/admin'>Jo'rayev Temur</Link>
                    </div>
                </div>
            </div>
            <div className='app-wrapper'>
                <div className='outlet'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AppLayout;