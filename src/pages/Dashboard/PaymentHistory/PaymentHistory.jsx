import React from 'react';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../../components/Loading';
import { format } from 'date-fns';
import { FaMoneyCheckAlt } from 'react-icons/fa';

const PaymentHistory = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: payments = [], isPending } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments/user?email=${user.email}`);
            return res.data
        }
    })

    if (isPending) {
        return <Loading></Loading>
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-base-200 rounded-xl shadow">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaMoneyCheckAlt /> My Payment History
            </h2>

            {payments.length === 0 ? (
                <p className="text-center text-gray-500 py-10">No payment records found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full text-sm md:text-base">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Amount (৳)</th>

                                <th>Transaction ID</th>
                                <th>Paid At</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment, index) => (
                                <tr key={payment._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <span className="badge badge-success font-semibold text-white">
                                            ৳{payment.amount}
                                        </span>
                                    </td>
                                    <td className="break-all">{payment.transactionId}</td>
                                    <td>{format(new Date(payment.paid_at), 'PPpp')}</td>
                                    <td className="text-xs text-gray-600">{payment.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;