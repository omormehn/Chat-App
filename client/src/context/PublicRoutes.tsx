import React, { useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';

function PublicRoutes({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();


    if (user) {
        console.log("user", user)

        return <Navigate to="/chats" replace />;
    }

    return children;
}

export default PublicRoutes