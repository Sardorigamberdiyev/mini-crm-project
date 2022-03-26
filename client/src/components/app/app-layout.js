import React from 'react';
import { Outlet } from 'react-router-dom';
import './app-layout.css';

const AppLayout = () => {
    return (
        <div className="app-layout">
            <h1>Navbar</h1>
            <Outlet />
            <h1>Footer</h1>
        </div>
    )
}

export default AppLayout;