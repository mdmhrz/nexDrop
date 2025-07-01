import React from 'react';
import bgImage from '../../../assets/be-a-merchant-bg.png'
import loationMarchant from '../../../assets/location-merchant.png'

const BecomeAMarchent = () => {
    return (
        <div className='relative text-base-100 flex items-center bg-[#03373D] rounded-2xl p-6 md:p-8 mb-10'>
            <img className='absolute top-0 left-0 right-0' src={bgImage} alt="" />
            <div className='space-y-4 relative'>
                <h3 className='font-bold text-3xl'>Merchant and Customer Satisfaction is Our First Priority</h3>
                <p className='font-light text-gray-300'>
                    We offer the lowest delivery charge with the highest value along with 100% safety of your product. Pathao courier delivers your parcels in every corner of Bangladesh right on time.
                </p>
                <div className='flex gap-3'>
                    <button className='btn bg-[#CAEB66]'>Become a Marchant</button>
                    <button className='btn btn-outline border-lime-400'>Earn with NexDrop Courier</button>
                </div>
            </div>
            <div>
                <img src={loationMarchant} alt="" />
            </div>
        </div>
    );
};

export default BecomeAMarchent;