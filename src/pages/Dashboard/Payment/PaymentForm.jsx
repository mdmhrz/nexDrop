import { useStripe } from '@stripe/react-stripe-js';
import { useElements } from '@stripe/react-stripe-js';
import { CardElement } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { set } from 'date-fns';
import React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading';
import useAuth from '../../../hooks/useAuth';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';

const PaymentForm = () => {

    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('')
    const { parcelId } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { logTracking } = useTrackingLogger()
    const navigate = useNavigate();


    const { isPending, data: parcelInfo = {} } = useQuery({
        queryKey: ['parcels', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`)
            return res.data;
        }
    })

    if (isPending) {
        return <Loading></Loading>
    }

    console.log(parcelInfo);
    const amount = parcelInfo.totalCost;
    const amountInCents = amount * 100;


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return
        }
        const card = elements.getElement(CardElement)

        if (!card) {
            return
        }


        //Step-1: Validate the card
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

            // Setp:2 create payment intent
            const res = await axiosSecure.post('/create-payment-intent', {
                amountInCents,
                parcelid: parcelId
            })

            const clientSecret = res.data.clientSecret;


            //Step-3: Confirm Payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.displayName,
                        email: user.email
                    }
                }
            })

            if (result.error) {
                setError(result.error.message)
            }
            else {
                setError('')
                if (result.paymentIntent.status === 'succeeded') {
                    console.log('Payment Succeeded');
                    console.log(result);
                    const transactionId = result.paymentIntent.id
                    //Step-4: marked parcel paid also create payment history
                    const paymentData = {
                        parcelId,
                        email: user.email,
                        amount,
                        transactionId: transactionId,
                        paymentMethod: result.paymentIntent.payment_method_types,
                    }

                    const paymentRes = await axiosSecure.post(`/payments`, paymentData);
                    if (paymentRes.data.insertdId) {
                        console.log('Payment Successfully done');


                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `
                                <div class="text-left">
                                    <p><strong>Transaction ID:</strong> ${transactionId}</p>
                                    <p>Your payment has been successfully processed.</p>
                                </div>
                            `,
                            confirmButtonText: 'Go to My Parcels',
                            confirmButtonColor: '#22c55e',
                            allowOutsideClick: false,
                        }).then(async (result) => {
                            if (result.isConfirmed) {
                                //Tracking update
                                await logTracking({
                                    tracking_id: parcelInfo.tracking_id,
                                    status: 'payment_done',
                                    details: `Paid by ${user.displayName}`,
                                    updated_by: user.email
                                })

                                navigate('/dashboard/myparcels');
                            }
                        });
                    }
                }
            }

            // console.log('res from intent', res);
        }



    }

    return (
        <div>
            <form onSubmit={handleSubmit} className='space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto' >
                <CardElement className='p-2 border rounded'>
                </CardElement>
                {error && <small className="text-red-500 mt-2">{error}</small>}
                {/* {success && <p className="text-green-500 mt-2">{success}</p>} */}
                <button
                    className='btn btn-primary w-full text-black'
                    type='submit'
                    disabled={!stripe}
                >Pay ${amount}</button>

            </form>
        </div>
    );
};

export default PaymentForm;