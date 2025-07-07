import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import useTrackingLogger from '../../../hooks/useTrackingLogger';

const PendingDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const { logTracking } = useTrackingLogger();

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['riderPendingParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/rider/pending?email=${user.email}`);
            return res.data;
        }
    });


    const updateParcelStatus = async (parcel, newStatus) => {
        const actionText = newStatus === 'in_transit' ? 'mark as picked up' : 'mark as delivered';

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${actionText}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, confirm!'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch(`/parcels/updateStatus`, {
                    parcelId: parcel._id,
                    status: newStatus
                });

                if (res.data.success) {

                    // tracing updated
                    let trackDetails = `Picked up by ${user.displayName}`
                    if (newStatus === 'delivered') {
                        trackDetails = `Delivered by ${user.displayName}`
                    }

                    await logTracking({
                        tracking_id: parcel.tracking_id,
                        status: newStatus,
                        details: trackDetails,
                        updated_by: user.email
                    })

                    Swal.fire('Success!', `Parcel ${actionText} successfully.`, 'success');
                    refetch();
                } else {
                    Swal.fire('Failed', 'Failed to update parcel status.', 'error');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Something went wrong!', 'error');
            }
        }
    };

    if (isLoading) return <Loading />;

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">My Pending Deliveries</h2>

            <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Tracking ID</th>
                            <th>Receiver</th>
                            <th>Address</th>
                            <th>Zone</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {parcels.map((parcel, index) => (
                            <tr key={parcel._id}>
                                <td>{index + 1}</td>
                                <td>{parcel.title}</td>
                                <td>{parcel.trackingId}</td>
                                <td>{parcel.receiverName}</td>
                                <td>{parcel.receiverAddress}</td>
                                <td>{parcel.deliveryZone}</td>
                                <td>{parcel.paymentMethod?.[0] || 'N/A'}</td>
                                <td>{parcel.delivery_status}</td>
                                <td className="space-x-2">
                                    {parcel.delivery_status === 'rider_assigned' && (
                                        <button
                                            className="btn btn-sm btn-info"
                                            onClick={() => updateParcelStatus(parcel, 'in_transit')}
                                        >
                                            Mark Picked
                                        </button>
                                    )}
                                    {parcel.delivery_status === 'in_transit' && (
                                        <button
                                            className="btn btn-sm btn-success"
                                            onClick={() => updateParcelStatus(parcel, 'delivered')}
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingDeliveries;
