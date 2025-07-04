import { useStripe } from '@stripe/react-stripe-js';
import { useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import { set } from 'date-fns';
import React from 'react';
import { useState } from 'react';

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('')


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return
        }
        const card = elements.getElement(CardElement)

        if (!card) {
            return
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card
        })

        if (error) {
            console.log('error', error);
            setError(error.message)
        }
        else {
            setError('')
            console.log('Payment Method', paymentMethod);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto' >
                <CardElement className='p-2 border rounded'>
                </CardElement>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {/* {success && <p className="text-green-500 mt-2">{success}</p>} */}
                <button
                    className='btn btn-primary w-full text-black'
                    type='submit'
                    disabled={!stripe}
                >Pay For Parcel Pickup</button>

            </form>
        </div>
    );
};

export default PaymentForm;