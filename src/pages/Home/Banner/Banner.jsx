import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImage1 from '../../../assets/banner/banner1.png';
import bannerImage2 from '../../../assets/banner/banner2.png';
import bannerImage3 from '../../../assets/banner/banner3.png';
import { Carousel } from 'react-responsive-carousel';

const Banner = () => {
    return (
        <Carousel autoPlay={true} infiniteLoop={true} showThumbs={false} className='my-10 overflow-hidden rounded-2xl'>
            <div>
                <img src={bannerImage1} />
                <p className="legend">On Time Delivery</p>
            </div>
            <div>
                <img src={bannerImage2} />
                <p className="legend">Fastest Delivery, Easy PickUp</p>
            </div>
            <div>
                <img src={bannerImage3} />
                <p className="legend">Delivery Within 30 Minutes</p>
            </div>

        </Carousel>
    );
};

export default Banner;