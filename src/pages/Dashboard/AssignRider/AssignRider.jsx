import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import Loading from '../../../components/Loading';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AssignRider = () => {
    const axiosSecure = useAxiosSecure();
    const [selectedParcel, setSelectedParcel] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: parcels = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['assignableParcels'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/user?isPaid=true&delivery_status=not_collected');
            return res.data;
        },
    });

    // Fetch riders by senderCenter (district)
    const { data: riders = [], isLoading: ridersLoading } = useQuery({
        queryKey: ['ridersByDistrict', selectedParcel?.senderCenter],
        enabled: !!selectedParcel?.senderCenter,
        queryFn: async () => {
            const res = await axiosSecure.get(`/riders/active?district=${selectedParcel.senderCenter}`);
            return res.data;
        },
    });

    const handleAssignClick = (parcel) => {
        setSelectedParcel(parcel);
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setSelectedParcel(null);
        setIsModalOpen(false);
    };


    const handleRiderAssign = async (rider) => {
        try {
            const res = await axiosSecure.patch('/parcels/assignRider', {
                parcelId: selectedParcel._id,
                riderId: rider._id,
                riderEmail: rider.email,
                riderName: rider.name
            });

            if (res.data.success) {
                toast.success("Rider assigned successfully!");
                refetch();       // refresh parcel list
                handleClose();   // close modal
            } else {
                toast.error("Assignment failed.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error assigning rider.");
        }
    };


    if (isLoading) return <Loading />;
    if (isError) return <p className="text-center text-red-500">Failed to load parcels.</p>;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Assign Rider</h2>
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Sender</th>
                            <th>Receiver</th>
                            <th>From → To</th>
                            <th>Weight (kg)</th>
                            <th>Cost (৳)</th>
                            <th>Payment</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td>{parcel.title}</td>
                                <td>{parcel.senderName}</td>
                                <td>{parcel.receiverName}</td>
                                <td>{parcel.senderDistrict} → {parcel.receiverDistrict}</td>
                                <td>{parcel.weight}</td>
                                <td>{parcel.totalCost}</td>
                                <td>{parcel.paymentMethod?.[0] || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm text-black"
                                        onClick={() => handleAssignClick(parcel)}
                                    >
                                        Assign Rider
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={handleClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-md rounded bg-white p-6 space-y-4 shadow-lg">
                        <Dialog.Title className="text-lg font-bold">Assign Rider</Dialog.Title>
                        <p className="text-sm text-gray-600">
                            Sender Center: <span className="font-semibold">{selectedParcel?.senderCenter}</span>
                        </p>

                        {ridersLoading ? (
                            <p>Loading riders...</p>
                        ) : riders.length === 0 ? (
                            <p className="text-red-500">No available riders in this district.</p>
                        ) : (
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {riders.map((rider) => (
                                    <li key={rider._id} className="flex items-center justify-between border rounded p-2">
                                        <div>
                                            <p className="font-medium">{rider.name}</p>
                                            <p className="text-xs text-gray-500">{rider.email}</p>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => handleRiderAssign(rider)}
                                        >
                                            Assign
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="text-right">
                            <button onClick={handleClose} className="btn btn-sm">
                                Close
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
};

export default AssignRider;
