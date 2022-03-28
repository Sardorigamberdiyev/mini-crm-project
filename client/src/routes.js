import React from 'react';
import { Route } from 'react-router-dom';
import { AppLayout } from './components/app';
import { Login, Home } from './components/pages';


const useRoutes = (isAuth, authRole) => {

    const authRoutes = (
        <>
        <Route path="/" element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path="*" element={<h1>Not fount 404</h1>} />
        </Route>
        </>
    );

    const unauthRoutes = (
        <>
        <Route path="/" element={<Login />} />
        <Route path="*" element={<h1>Not fount 404</h1>} />
        </>
    );

    return isAuth === 'yes' ? authRoutes : unauthRoutes;
}

export default useRoutes;