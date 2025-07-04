import React from 'react';
import { FaEye, FaTrashAlt, FaMoneyBillWave } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

const MyParcels = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: parcels = [], refetch, isLoading } = useQuery({
        queryKey: ['my-parcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/user?email=${user.email}`);
            return res.data;
        },
    });

    const handleView = (parcel) => {
        Swal.fire({
            title: 'Parcel Details',
            html: `
                <div class="text-left">
                    <p><strong>Tracking ID:</strong> ${parcel.trackingId}</p>
                    <p><strong>Type:</strong> ${parcel.type}</p>
                    <p><strong>Cost:</strong> ৳${parcel.totalCost}</p>
                    <p><strong>Status:</strong> ${parcel.isPaid ? 'Paid' : 'Unpaid'}</p>
                    <p><strong>Created At:</strong> ${parcel.created_at_readable}</p>
                    <hr class="my-2"/>
                    <p><strong>Sender:</strong> ${parcel.senderName} (${parcel.senderContact})</p>
                    <p><strong>Receiver:</strong> ${parcel.receiverName} (${parcel.receiverContact})</p>
                    <p><strong>Zone:</strong> ${parcel.deliveryZone}</p>
                </div>
            `,
            confirmButtonText: 'Close',
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            const res = await axiosSecure.delete(`/parcels/${id}`);
            if (res.data.deletedCount > 0) {
                Swal.fire('Deleted!', 'Parcel has been deleted.', 'success');
                //This can use
                queryClient.invalidateQueries(['my-parcels', user.email]);

                // this is also can use to update display
                // refetch()
            }
        }
    };

    const handlePay = async (parcel) => {
        const result = await Swal.fire({
            title: 'Confirm Payment',
            text: `Pay ৳${parcel.totalCost} for parcel "${parcel.title}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Pay Now',
        });

        if (result.isConfirmed) {
            navigate(`/dashboard/payment/${parcel._id}`)
        }
    };

    return (
        <div className="overflow-x-auto bg-base-200 p-6 rounded-xl shadow max-w-7xl  w-11/12 mx-auto mt-6">
            <h2 className="text-2xl font-bold mb-4">My Parcels</h2>

            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Title</th>
                        <th>Created At</th>
                        <th>Cost (৳)</th>
                        <th>Status</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-lg">Loading...</td>
                        </tr>
                    ) : parcels.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center text-gray-500 py-8">
                                No parcels found.
                            </td>
                        </tr>
                    ) : (
                        parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td className="capitalize">{parcel.type}</td>
                                <td className="max-w-[180px] truncate">{parcel.title}</td>
                                <td>{parcel.created_at_readable}</td>
                                <td>৳{parcel.totalCost}</td>
                                <td>
                                    <span className={`badge px-4 py-1 text-white ${parcel.isPaid ? 'badge-success' : 'badge-error'}`}>
                                        {parcel.isPaid ? 'Paid' : 'Unpaid'}
                                    </span>
                                </td>
                                <td className="flex gap-2 justify-center">
                                    <button onClick={() => handleView(parcel)} className="btn btn-sm btn-info" title="View Details">
                                        <FaEye />
                                    </button>
                                    <button onClick={() => handleDelete(parcel._id)} className="btn btn-sm btn-error" title="Delete Parcel">
                                        <FaTrashAlt />
                                    </button>
                                    <button
                                        onClick={() => handlePay(parcel)}
                                        className="btn btn-sm btn-success"
                                        disabled={parcel.isPaid}
                                        title="Pay Now"
                                    >
                                        <FaMoneyBillWave />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default MyParcels;
