import React from 'react';
import logo from '../../../assets/logo.png'
import { Link } from 'react-router';

const NexDropLogo = () => {
    return (
        <Link to='/'>
            <div className='flex items-end'>
                <img className='mb-2' src={logo} alt="" />
                <p className='-ml-2 text-3xl font-extrabold'>NexDrop</p>
            </div></Link>
    );
};

export default NexDropLogo;