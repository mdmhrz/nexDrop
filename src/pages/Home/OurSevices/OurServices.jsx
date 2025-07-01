import React from 'react';
import { FaUndo } from 'react-icons/fa';
import { FaBuilding, FaGlobe, FaMoneyBillWave, FaTruckFast, FaWarehouse } from 'react-icons/fa6'; // or 'react-icons/fa' if you prefer

const services = [
    {
        title: "Express & Standard Delivery",
        description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
        icon: <FaTruckFast className="text-4xl text-primary" />,
    },
    {
        title: "Nationwide Delivery",
        description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
        icon: <FaGlobe className="text-4xl text-primary" />,
    },
    {
        title: "Fulfillment Solution",
        description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
        icon: <FaWarehouse className="text-4xl text-primary" />,
    },
    {
        title: "Cash on Home Delivery",
        description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product.",
        icon: <FaMoneyBillWave className="text-4xl text-primary" />,
    },
    {
        title: "Corporate Service / Contract In Logistics",
        description: "Customized corporate services which includes warehouse and inventory management support.",
        icon: <FaBuilding className="text-4xl text-primary" />,
    },
    {
        title: "Parcel Return",
        description: "Through our reverse logistics facility we allow end customers to return or exchange their products with online business merchants.",
        icon: <FaUndo className="text-4xl text-primary" />,
    },
];

const OurServices = () => {
    return (
        <section className="my-20 py-16 px-4 lg:px-12 p-4 md:p-8 mx-auto bg-[#03373D] rounded-2xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl lg:text-4xl font-bold text-base-100">Our Services</h2>
                <p className="mt-4 text-base lg:text-lg text-gray-300">
                    We provide comprehensive and reliable delivery solutions tailored to your business and customer needs.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                {services.map((service, index) => (
                    <div
                        key={index}
                        className="card bg-base-100 shadow-xl hover:shadow-2xl p-8 hover:bg-green-100/90 transition duration-300"
                    >
                        <div className="card-body text-center">
                            <div className="mb-4 flex items-center justify-center">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-semibold text-primary text-center">{service.title}</h3>
                            <p className="text-sm text-gray-600 mt-2">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurServices;
