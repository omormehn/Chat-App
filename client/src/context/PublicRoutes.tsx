import React, { useEffect } from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom';
import { PacmanLoader } from 'react-spinners';

function PublicRoutes({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flexCenter h-screen">
                <PacmanLoader
                    color={"#36D7B7"}
                    loading={loading}
                    size={50}
                />
            </div>
        );
    }
    if (user) {
        console.log("user", user)

        return <Navigate to="/chats" replace />;
    }

    return children;
}

export default PublicRoutes