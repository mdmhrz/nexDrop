import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/Loading';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

const MyEarnings = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [filteredParcels, setFilteredParcels] = useState([]);
    const [filter, setFilter] = useState('all');

    const { data: parcels = [], isLoading } = useQuery({
        queryKey: ['riderCompletedParcels', user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/rider/delivery/completed?email=${user.email}`);
            return res.data;
        }
    });

    useEffect(() => {
        if (!parcels.length) return;

        const now = dayjs();
        let filtered = parcels;

        if (filter === 'today') {
            filtered = parcels.filter(parcel =>
                dayjs(parcel.delivered_at).isSame(now, 'day')
            );
        } else if (filter === 'week') {
            filtered = parcels.filter(parcel =>
                dayjs(parcel.delivered_at).week() === now.week() &&
                dayjs(parcel.delivered_at).year() === now.year()
            );
        } else if (filter === 'month') {
            filtered = parcels.filter(parcel =>
                dayjs(parcel.delivered_at).isSame(now, 'month')
            );
        } else if (filter === 'year') {
            filtered = parcels.filter(parcel =>
                dayjs(parcel.delivered_at).isSame(now, 'year')
            );
        }

        setFilteredParcels(filtered);
    }, [filter, parcels]);

    if (isLoading) return <Loading />;

    // Calculate earnings
    let total = 0;
    let cashedOut = 0;
    let pending = 0;

    filteredParcels.forEach(parcel => {
        const isSameDistrict = parcel.receiverDistrict === parcel.senderDistrict;
        const rate = isSameDistrict ? 0.8 : 0.3;
        const earning = parcel.totalCost * rate;
        total += earning;

        if (parcel.cashout_status === 'cashed_out') cashedOut += earning;
        else pending += earning;
    });

    return (
        <div className="p-4 space-y-6">
            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap mb-4">
                {['today', 'week', 'month', 'year', 'all'].map(opt => (
                    <button
                        key={opt}
                        className={`btn btn-sm ${filter === opt ? 'btn-primary' : 'btn-outline'}`}
                        onClick={() => setFilter(opt)}
                    >
                        {opt === 'all' ? 'Overall' : `This ${opt}`}
                    </button>
                ))}
            </div>

            {/* Earnings Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 text-blue-900 p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold">Total Earnings</h2>
                    <p className="text-3xl font-extrabold mt-2">{total.toFixed(2)}৳</p>
                </div>
                <div className="bg-green-100 text-green-900 p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold">Cashed Out</h2>
                    <p className="text-3xl font-extrabold mt-2">{cashedOut.toFixed(2)}৳</p>
                </div>
                <div className="bg-yellow-100 text-yellow-900 p-6 rounded-xl shadow text-center">
                    <h2 className="text-xl font-bold">Pending</h2>
                    <p className="text-3xl font-extrabold mt-2">{pending.toFixed(2)}৳</p>
                </div>
            </div>

            {/* Deliveries Table */}
            <div className="mt-6">
                <h3 className="font-bold text-lg mb-2">Deliveries ({filteredParcels.length})</h3>
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full text-sm">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Tracking ID</th>
                                <th>Cost</th>
                                <th>Earning</th>
                                <th>Status</th>
                                <th>Delivered At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredParcels.map((parcel, index) => {
                                const isSameDistrict = parcel.receiverDistrict === parcel.senderDistrict;
                                const rate = isSameDistrict ? 0.8 : 0.3;
                                const earning = parcel.totalCost * rate;

                                return (
                                    <tr key={parcel._id}>
                                        <td>{index + 1}</td>
                                        <td>{parcel.title}</td>
                                        <td>{parcel.trackingId}</td>
                                        <td>{parcel.totalCost}৳</td>
                                        <td className="text-green-600 font-semibold">{earning.toFixed(2)}৳</td>
                                        <td>
                                            {parcel.cashout_status === 'cashed_out' ? (
                                                <span className="badge badge-success">Paid</span>
                                            ) : (
                                                <span className="badge badge-warning">Pending</span>
                                            )}
                                        </td>
                                        <td>{new Date(parcel.delivered_at).toLocaleString()}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyEarnings;
