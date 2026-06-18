import React from 'react'
import PlayerLayout from '../layouts/PlayerLayout';
import AdminLayout from '../layouts/AdminLayout';
import PlatformLayout from '../layouts/PlatformLayout';
import { Navigate, Outlet, replace } from 'react-router-dom';

function ProtectedRoutes(role,user) {

    // restrict access to role based routes without login
    if(!user) {
        return (
            <Navigate to="/login" replace/>
        )
    }

    // protected player routes
    if(role == "player") {
        return (
            <PlatformLayout>
                <Outlet/>    
            </ PlatformLayout>
        )
    }

    // protected admin routes
    if ( role == "admin") {
        return (
            <AdminLayout>
                <Outlet/>
            </AdminLayout>
        )
    }

    // unauthorized
    return <Navigate to="/unauthorized" replace/>
}

export default ProtectedRoutes