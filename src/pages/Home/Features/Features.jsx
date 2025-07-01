import React from "react";
import track from '../../../assets/features/tracking.png'
import safe from '../../../assets/features/safe.png'
import support from '../../../assets/features/support.png'

const features = [
    {
        title: "Live Parcel Tracking",
        description:
            "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
        image: track,
    },
    {
        title: "100% Safe Delivery",
        description:
            "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
        image: safe,
    },
    {
        title: "24/7 Call Center Support",
        description:
            "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
        image: support,
    },
];

const Features = () => {
    return (
        <div className="py-16 w-full mx-auto">
            {/* Section Title & Subtitle */}
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral">Why Choose NexDrop?</h2>
                <p className="mt-2 text-gray-500 max-w-xl mx-auto">
                    Experience reliable, fast, and secure delivery solutions trusted by businesses and individuals nationwide.
                </p>
            </div>

            {/* Features List */}
            {features.map((feature, index) => (
                <div
                    key={index}
                    className="flex flex-col md:flex-row items-center gap-6 md:gap-12 mb-12 bg-base-100 p-6 rounded-xl shadow"
                >
                    {/* Left Image (fixed width) */}
                    <div className="w-full md:w-auto md:flex-shrink-0 flex justify-center">
                        <img
                            src={feature.image}
                            alt={feature.title}
                            className="max-h-48 object-contain"
                        />
                    </div>

                    {/* Divider (fixed height & width) */}
                    <div className="hidden md:flex h-full w-px items-stretch">
                        <svg width="100%" height="100%" preserveAspectRatio="none">
                            <line
                                x1="50%"
                                y1="0"
                                x2="50%"
                                y2="100%"
                                stroke="#ccc"
                                strokeWidth="2"
                                strokeDasharray="6,6"
                            />
                        </svg>
                    </div>

                    {/* Right Content (takes remaining space) */}
                    <div className="w-full flex-1 h-full text-center md:text-left flex flex-col justify-center">
                        <h3 className="text-3xl font-bold text-slate-800">{feature.title}</h3>
                        <p className="mt-2 text-gray-600">{feature.description}</p>
                    </div>
                </div>

            ))}
        </div>
    );
};

export default Features;
