import React from 'react';
import useAuth from '../hooks/useAuth';
import useUserRole from '../hooks/useUserRole';
import Loading from '../components/Loading';
import { Navigate } from 'react-router';

const RiderRoutes = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, roleLoading } = useUserRole();

    console.log(role);


    if (loading || roleLoading) {
        return <Loading></Loading>
    }

    if (!user || role !== 'rider') {
        return <Navigate state={{ from: location.pathname }} to='/forbidden'></Navigate>
    }

    return children;
};

export default RiderRoutes;