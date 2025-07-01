import React from 'react';
import { Outlet } from 'react-router';
import authImage from '../assets/authImage.png'
import NexDropLogo from '../pages/shared/NexDropLogo/NexDropLogo';

const AuthLayout = () => {
    return (
        <div className="bg-base-200 min-h-screen p-12">
            <NexDropLogo></NexDropLogo>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <img
                        src={authImage}
                    />
                </div>
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;