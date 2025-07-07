import { useQuery } from '@tanstack/react-query';
import { FaBoxOpen, FaMotorcycle, FaMoneyBillWave, FaCheckCircle, FaUsers } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';
import Loading from '../../../components/Loading';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#00C49F', '#FFBB28', '#0088FE', '#FF8042', '#A28EFF', '#FF6F91', '#9AD0F5'];

const statusIcons = {
    delivered: <FaCheckCircle className="text-3xl text-green-600" />,
    in_transit: <MdLocalShipping className="text-3xl text-yellow-600" />,
    rider_assigned: <FaMotorcycle className="text-3xl text-orange-500" />,
    not_collected: <FaBoxOpen className="text-3xl text-gray-600" />,
    unassigned: <FaBoxOpen className="text-3xl text-blue-400" />,
    unknown: <FaBoxOpen className="text-3xl text-red-400" />,
};

const formatStatus = (status) => {
    if (!status) return 'Unassigned';
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    const { data: statuses = [], isLoading } = useQuery({
        queryKey: ['parcelStatusCounts'],
        queryFn: async () => {
            const res = await axiosSecure.get('/parcels/delivery/status-count');
            return res.data;
        },
    });

    if (isLoading) return <Loading />;

    const chartData = statuses.map(({ status, count }) => ({
        name: formatStatus(status),
        value: count,
        rawStatus: status || 'unassigned',
    }));

    return (
        <div className="p-6 space-y-8">
            <h2 className="text-2xl font-bold mb-4">📦 Parcel Delivery Status Summary</h2>

            {/* Status Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {chartData.map(({ name, value, rawStatus }, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-gray-200 shadow-md rounded-xl p-5 flex items-center gap-4 hover:shadow-lg transition"
                    >
                        <div>
                            {statusIcons[rawStatus] || statusIcons.unknown}
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold">{name}</h4>
                            <p className="text-2xl font-bold text-gray-700">{value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pie Chart Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">📊 Delivery Overview</h2>
                <div className="bg-white p-6 rounded-xl shadow w-full h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={130}
                                label
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
