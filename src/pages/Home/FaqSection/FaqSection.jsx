import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const faqs = [
    {
        question: 'How does NexDrop parcel delivery work?',
        answer:
            'NexDrop makes parcel delivery fast and effortless. You simply book a delivery through our platform, and our professional couriers pick up your parcel from your location and deliver it securely to the destination. You can track the entire process in real-time through our website.',
    },
    {
        question: 'Is NexDrop suitable for all types of packages?',
        answer:
            'Yes! NexDrop handles all standard parcel sizes — from small documents to larger boxes. For oversized or special items, you can contact our support team for custom delivery arrangements.',
    },
    {
        question: 'Does NexDrop offer same-day or express delivery?',
        answer:
            'Absolutely. We provide same-day and express delivery options within supported zones. Just select the desired delivery speed during checkout and we’ll handle the rest with priority service.',
    },
    {
        question: 'Can I track my parcel in real-time?',
        answer:
            'Yes, every parcel comes with a unique tracking ID that allows you to monitor its status in real-time from pickup to delivery. You’ll receive live updates via SMS or email as well.',
    },
    {
        question: 'How will I know when my parcel is delivered?',
        answer:
            'You will receive a delivery confirmation via SMS or email once the parcel reaches its destination. We also provide photo proof of delivery for added security and transparency.',
    },
];


const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleIndex = (index) => {
        setOpenIndex(index === openIndex ? null : index);
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-800">
                Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
                Learn everything you need to know about NexDrop’s fast, reliable, and secure parcel delivery services. From booking to tracking, we’ve got you covered!
            </p>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className={`rounded-xl border ${openIndex === index ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200'} overflow-hidden`}>
                        <button
                            className="w-full text-left px-6 py-4 font-medium text-gray-800 focus:outline-none flex justify-between items-center"
                            onClick={() => toggleIndex(index)}
                        >
                            {faq.question}
                            <span className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                                ▼
                            </span>
                        </button>
                        {openIndex === index && faq.answer && (
                            <motion.div
                                className="px-6 pb-4 text-gray-600"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {faq.answer}
                            </motion.div>
                        )}
                    </div>
                ))}
            </div>

            <div className="text-center mt-10 flex items-center justify-center gap-0">
                <button className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-6 py-3 rounded-full transition-all">
                    See More FAQ’s
                </button>
                <div className=' bg-black p-4 rounded-full'>
                    <FaArrowRight className=" -rotate-45 text-lime-500" />
                </div>
            </div>
        </div>
    );
};

export default FaqSection;
