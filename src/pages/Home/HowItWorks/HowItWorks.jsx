import React from "react";
import {
    FaBoxOpen,
    FaMapMarkedAlt,
    FaTruck,
    FaCheckCircle,
} from "react-icons/fa";

const steps = [
    {
        icon: <FaBoxOpen className="text-4xl text-primary mb-4" />,
        title: "Book Your Parcel",
        description: "Easily schedule a pick-up through our online platform or app.",
    },
    {
        icon: <FaMapMarkedAlt className="text-4xl text-primary mb-4" />,
        title: "We Pick It Up",
        description: "Our delivery partner collects your parcel from your doorstep.",
    },
    {
        icon: <FaTruck className="text-4xl text-primary mb-4" />,
        title: "In Transit",
        description: "Track your package in real-time while it’s on the way.",
    },
    {
        icon: <FaCheckCircle className="text-4xl text-primary mb-4" />,
        title: "Delivered",
        description: "Your parcel is delivered safely and securely, on time.",
    },
];

const HowItWorks = () => {
    return (
        <section className="py-16 bg-base-100 w-full px-4 rounded-2xl">
            {/* Section Title */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral">
                    How It Works
                </h2>
                <p className="mt-2 text-gray-500 max-w-xl mx-auto">
                    Simple, fast, and secure delivery in just a few steps.
                </p>
            </div>

            {/* Step Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div
                        key={index}
                        className="bg-base-200 p-6 rounded-xl text-center shadow hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-center">{step.icon}</div>
                        <h3 className="text-xl font-semibold text-neutral">{step.title}</h3>
                        <p className="mt-2 text-gray-600 text-sm">{step.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowItWorks;
