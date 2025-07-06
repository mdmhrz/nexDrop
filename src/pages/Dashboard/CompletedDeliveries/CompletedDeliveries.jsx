import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/Loading';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';

const CompletedDeliveries = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();

    const { data: parcels = [], isLoading, refetch } = useQuery({
        queryKey: ['riderCompletedParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/delivery/completed?email=${user.email}`);
            return res.data;
        }
    });

    if (isLoading) return <Loading />;

    // Calculate earnings
    let totalEarnings = 0;

    const handleCashoutRequest = async (parcelId) => {
        const result = await Swal.fire({
            title: 'Request Cashout?',
            text: 'Do you want to request cashout for this delivery?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, request it',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.patch('/parcels/requestCashout', { parcelId });
                if (res.data.success) {
                    toast.success("Cashout requested successfully!");
                    refetch();
                } else {
                    toast.error("Failed to request cashout.");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error while requesting cashout.");
            }
        }
    };

    const rows = parcels.map((parcel, index) => {
        const isSameDistrict = parcel.receiverDistrict === parcel.senderDistrict;
        const percentage = isSameDistrict ? 0.8 : 0.3;
        const earning = parcel.totalCost * percentage;
        totalEarnings += earning;

        return (
            <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.title}</td>
                <td>{parcel.trackingId}</td>
                <td>{parcel.receiverName}</td>
                <td>{parcel.receiverAddress}</td>
                <td>{parcel.deliveryZone}</td>
                <td>{parcel.totalCost}৳</td>
                <td className="text-green-600 font-semibold">{earning.toFixed(2)}৳</td>
                <td>{new Date(parcel.created_date).toLocaleString()}</td>
                <td>
                    {parcel.cashout_status === 'requested' ? (
                        <span className="badge badge-success">Paid</span>
                    ) : (
                        <button
                            className="btn btn-xs btn-warning"
                            onClick={() => handleCashoutRequest(parcel._id)}
                        >
                            Request Cashout
                        </button>
                    )}
                </td>
            </tr>
        );
    });

    return (
        <div className="p-4 space-y-6">
            {/* Earnings Box */}
            <div className="bg-gradient-to-r from-green-200 to-green-400 text-green-900 rounded-xl shadow-md p-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Total Earnings</h2>
                    <p className="text-sm text-green-800">From completed deliveries</p>
                </div>
                <div className="text-3xl font-extrabold">
                    {totalEarnings.toFixed(2)}৳
                </div>
            </div>

            {/* Deliveries Table */}
            <div className="overflow-x-auto">
                <table className="table table-zebra w-full text-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Tracking ID</th>
                            <th>Receiver</th>
                            <th>Address</th>
                            <th>Zone</th>
                            <th>Cost</th>
                            <th>Earning</th>
                            <th>Completed At</th>
                            <th>Cashout</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        </div>
    );
};

export default CompletedDeliveries;
