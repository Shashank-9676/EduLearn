import React from 'react';
import { Navigate } from 'react-router';
import Cookies from 'js-cookie'; 
const ProtectedRoute = ({ children }) => {
    const userDetails = Cookies.get('jwt_token');
    if (!userDetails) {
        return <Navigate to="/login" replace />;
    }
    return <div>
        {children}
    </div>
};

export default ProtectedRoute;