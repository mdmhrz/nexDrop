import React from 'react';
import { Link, NavLink } from 'react-router';
import NexDropLogo from '../NexDropLogo/NexDropLogo';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';

const Navbar = () => {
    const { user, logout } = useAuth();

    const navItems = <>
        <li><NavLink to='/'>Home</NavLink></li>
        <li><NavLink to='/coverage'>Coverage</NavLink></li>

        {
            user && <>
                <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
            </>
        }
        <li><NavLink to='/sendParcel'>Send A Parcel</NavLink></li>
        <li><NavLink to='/about'>About Us</NavLink></li>
    </>

    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, log out!',
            cancelButtonText: 'Cancel'
        }).then(result => {
            if (result.isConfirmed) {
                logout()
                    .then(() => {
                        console.log('Logged out successfully');
                    })
                    .catch(error => {
                        console.error('Logout error:', error);
                    });
            }
        });
    };


    return (
        <div className="navbar bg-base-100 shadow-sm rounded-lg">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        {navItems}

                    </ul>
                </div>
                <NexDropLogo></NexDropLogo>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {navItems}
                </ul>
            </div>
            <div className="navbar-end">
                {user ? <button onClick={handleLogout} className='btn btn-primary text-black'>Logout</button> : <Link to='/login' className='btn bg-lime-400'>Login</Link>}
            </div>
        </div>
    );
};

export default Navbar;