import React, { useEffect } from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const { userDetails } = useAuth();
    
    useEffect(() => {
        if (!userDetails) {
            toast.info("Please login to access this page");
        }
    }, [userDetails]);

    if (!userDetails) {
        return <Navigate to="/login" replace />;
    }
    
    return (
        <div>
            {children}
        </div>
    );
};

export default ProtectedRoute;