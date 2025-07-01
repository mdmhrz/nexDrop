import React from 'react';
import Banner from '../Banner/Banner';
import OurServices from '../OurSevices/OurServices';
import ClientLogos from '../ClientLogos/ClientLogos';
import Features from '../Features/Features';
import HowItWorks from '../HowItWorks/HowItWorks';
import BecomeAMarchent from '../BecomeAMarchent/BecomeAMarchent';
import FaqSection from '../FaqSection/FaqSection';
import TestimonialSlider from '../TestimonialSlider/TestimonialSlider';

const Home = () => {
    return (
        <div className=''>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <ClientLogos></ClientLogos>
            <Features></Features>
            <div className='border border-b border-dashed border-gray-400 mb-20'></div>
            <BecomeAMarchent></BecomeAMarchent>
            <TestimonialSlider></TestimonialSlider>
            <FaqSection></FaqSection>
        </div>
    );
};

export default Home;