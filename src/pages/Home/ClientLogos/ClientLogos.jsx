import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import logo1 from '../../../assets/brands/amazon.png'
import logo2 from '../../../assets/brands/casio.png'
import logo3 from '../../../assets/brands/moonstar.png'
import logo4 from '../../../assets/brands/randstad.png'
import logo5 from '../../../assets/brands/amazon_vector.png'
import logo6 from '../../../assets/brands/start-people 1.png'
import logo7 from '../../../assets/brands/start.png'

const logos = [
    logo1, logo2, logo3, logo4, logo5, logo6, logo7
];

const ClientLogos = () => {
    return (
        <section className="py-26 bg-primary/5 mb-16 rounded-xl">
            <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-neutral">Trusted By</h2>
                <p className="mt-2 text-gray-500">Leading businesses and partners</p>
            </div>

            <Swiper
                modules={[Autoplay]}
                spaceBetween={40}
                slidesPerView={2}
                breakpoints={{
                    640: { slidesPerView: 3 },
                    768: { slidesPerView: 4 },
                    1024: { slidesPerView: 5 },
                }}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                }}
                speed={4000}
                loop={true}
                grabCursor={true}
                className="mySwiper"
            >
                {logos.map((logo, index) => (
                    <SwiperSlide key={index}>
                        <div className='bg-base-100 rounded-md p-4 shadow-md mb-2'>
                            <img
                                src={logo}
                                alt={`Client logo ${index + 1}`}
                                className="h-8 w-auto mx-auto object-contain"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default ClientLogos;
