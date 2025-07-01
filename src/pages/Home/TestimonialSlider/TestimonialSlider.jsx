'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { BiSolidQuoteSingleLeft } from 'react-icons/bi';
import topIcons from '../../../assets/customer-top.png'

const testimonials = [
    {
        name: 'Awlad Hossin',
        title: 'Senior Product Designer',
        message:
            'NexDrop made my delivery seamless. Real-time tracking and fast pickup exceeded my expectations!',
    },
    {
        name: 'Rasel Ahamed',
        title: 'CTO',
        message:
            'I trust NexDrop for all business parcels. Efficient, secure, and always on time.',
    },
    {
        name: 'Nasir Uddin',
        title: 'CEO',
        message:
            'Incredible customer service. NexDrop has simplified our shipping process entirely.',
    },
    {
        name: 'Sarah Jahan',
        title: 'Online Store Owner',
        message:
            'Fastest delivery I’ve used. They handled fragile items perfectly!',
    },
    {
        name: 'Arman Kabir',
        title: 'Logistics Manager',
        message:
            'Their tracking system is very accurate. Highly recommended for corporate use.',
    },
    {
        name: 'Tanvir Hasan',
        title: 'Freelancer',
        message:
            'Needed a parcel sent urgently — NexDrop delivered faster than I expected!',
    },
];

const TestimonialSlider = () => {
    return (
        <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <img src={topIcons} alt="Boxes" className="mx-auto mb-6 h-16" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
                    What our customers are saying
                </h2>
                <p className="text-gray-500 mb-10 max-w-2xl mx-auto">
                    Hear from satisfied users who trust NexDrop for reliable and fast parcel delivery. We’re committed to making shipping easier and stress-free!
                </p>
            </div>

            <div className="relative max-w-6xl mx-auto px-4">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={3}
                    centeredSlides={true}
                    loop={true}
                    navigation={{
                        nextEl: '.next-btn',
                        prevEl: '.prev-btn',
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    pagination={{ clickable: true }}
                    className="pb-12"
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 3 },
                    }}
                >
                    {testimonials.map((item, index) => (
                        <SwiperSlide key={index}>
                            {({ isActive }) => (
                                <div
                                    className={`transition-all duration-300 rounded-xl p-6 text-center shadow ${isActive
                                        ? 'bg-white scale-100 opacity-100'
                                        : 'bg-gray-100 scale-90 opacity-50'
                                        }`}
                                >   <BiSolidQuoteSingleLeft className='text-5xl text-primary' />

                                    <p className="text-gray-600 text-sm md:text-base mb-6">
                                        “{item.message}”
                                    </p>
                                    <hr className="mb-4 border-dotted" />
                                    <h4 className="text-lg font-semibold text-primary">{item.name}</h4>
                                    <p className="text-sm text-gray-500">{item.title}</p>
                                </div>
                            )}
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation */}
                <div className="flex justify-center gap-4 mt-4">
                    <button className="prev-btn w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600">
                        <FaArrowLeft />
                    </button>
                    <button className="next-btn w-10 h-10 rounded-full active:bg-lime-400 bg-gray-200 flex items-center justify-center text-black">
                        <FaArrowRight />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default TestimonialSlider;
