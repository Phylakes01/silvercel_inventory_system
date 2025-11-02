import React from "react";
import { UserAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const { session, loading } = UserAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return <>{session ? <>{children}</> : <Navigate to="/" replace />}</>
}

export default PrivateRoute;