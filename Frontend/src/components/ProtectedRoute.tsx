import React, { type ReactNode } from 'react';
import { Navigate, useLocation, type Location } from 'react-router-dom';
import { useAuthContext } from '../context/AuthProvider'
// import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
    redirectTo?: string;
}

interface LocationState {
    from?: Location;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    fallback,
    redirectTo = '/login'
}) => {
    const { isAuthenticated, isLoadingUser } = useAuthContext();
    const location = useLocation();

    if (isLoadingUser) {
        return fallback ? <>{fallback}</> : <>Loading...</>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location } as LocationState} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;