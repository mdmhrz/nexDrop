import React from 'react';
import logo from '../../../assets/logo.png'

const NexDropLogo = () => {
    return (
        <div className='flex items-end'>
            <img className='mb-2' src={logo} alt="" />
            <p className='-ml-2 text-3xl font-extrabold'>NexDrop</p>
        </div>
    );
};

export default NexDropLogo;