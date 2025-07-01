import React from 'react';
import Banner from '../Banner/Banner';
import OurServices from '../OurSevices/OurServices';
import ClientLogos from '../ClientLogos/ClientLogos';
import Features from '../Features/Features';
import HowItWorks from '../HowItWorks/HowItWorks';
import BecomeAMarchent from '../BecomeAMarchent/BecomeAMarchent';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <HowItWorks></HowItWorks>
            <OurServices></OurServices>
            <ClientLogos></ClientLogos>
            <Features></Features>
            <BecomeAMarchent></BecomeAMarchent>
        </div>
    );
};

export default Home;