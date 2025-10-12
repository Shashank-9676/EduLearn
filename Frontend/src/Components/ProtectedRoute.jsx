import React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
    const userDetails = localStorage.getItem('userDetails');
    if (!userDetails) {
        return <Navigate to="/login" replace />;
    }
    return <div>
        {children}

    </div>
};

export default ProtectedRoute;