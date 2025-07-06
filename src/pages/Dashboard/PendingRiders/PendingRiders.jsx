import { useState } from "react";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";

const PendingRiders = () => {
    const [selectedRider, setSelectedRider] = useState(null);
    const axiosSecure = useAxiosSecure();

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['pending-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/pending');
            return res.data;
        }
    });

    if (isPending) return <Loading />;

    const handleApprove = async (id, email) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to approve this rider.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, approve",
            confirmButtonColor: "#10B981",
        });

        if (confirm.isConfirmed) {
            const res = await axiosSecure.patch(`/riders/approve/${id}`, { status: 'active', email });
            if (res?.data?.modifiedCount > 0) {
                Swal.fire("Approved!", "Rider has been approved.", "success");
                refetch();
            }
        }
    };

    const handleCancel = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to cancel this rider application.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel",
            confirmButtonColor: "#EF4444",
        });

        if (confirm.isConfirmed) {
            const res = await axiosSecure.patch(`/riders/cancel/${id}`, { status: "cancelled" });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Cancelled", "Rider application has been cancelled.", "info");
                refetch();
            }
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Pending Rider Applications</h2>

            <div className="overflow-x-auto">
                <table className="table w-full border border-base-300 rounded-lg">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Warehouse</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riders.map((rider) => (
                            <tr key={rider._id} className="hover">
                                <td>{rider.name}</td>
                                <td>{rider.email}</td>
                                <td>{rider.mobileNumber}</td>
                                <td>{rider.region}</td>
                                <td>{rider.district}</td>
                                <td>{rider.covered_area}</td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedRider(rider)}
                                        className="btn btn-sm btn-info text-white"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleApprove(rider._id, rider.email)}
                                        className="btn btn-sm btn-success text-white"
                                    >
                                        <FaCheck />
                                    </button>
                                    <button
                                        onClick={() => handleCancel(rider._id)}
                                        className="btn btn-sm btn-error text-white"
                                    >
                                        <FaTimes />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Rider Detail Modal */}
            {selectedRider && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
                        <button
                            onClick={() => setSelectedRider(null)}
                            className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-black"
                        >
                            &times;
                        </button>
                        <h3 className="text-xl font-bold mb-4 border-b pb-2">Rider Details</h3>
                        <div className="space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <p><span className="font-semibold">Name:</span> {selectedRider.name}</p>
                                <p><span className="font-semibold">Email:</span> {selectedRider.email}</p>
                                <p><span className="font-semibold">Mobile:</span> {selectedRider.mobileNumber}</p>
                                <p><span className="font-semibold">Age:</span> {selectedRider.age}</p>
                                <p><span className="font-semibold">NID:</span> {selectedRider.nidNumber}</p>
                                <p><span className="font-semibold">Region:</span> {selectedRider.region}</p>
                                <p><span className="font-semibold">District:</span> {selectedRider.district}</p>
                                <p><span className="font-semibold">Bike Brand:</span> {selectedRider.bikeBrand}</p>
                                <p><span className="font-semibold">License No:</span> {selectedRider.drivingLicense}</p>
                                <p><span className="font-semibold">Bike Reg. No:</span> {selectedRider.bikeRegistration}</p>
                            </div>
                            <div>
                                <p><span className="font-semibold">Covered Area:</span></p>
                                <p className="text-sm text-gray-600">{selectedRider.covered_area}</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => {
                                    handleApprove(selectedRider._id, selectedRider.email);
                                    setSelectedRider(null);
                                }}
                                className="btn btn-sm btn-success"
                            >
                                Approve
                            </button>
                            <button
                                onClick={() => {
                                    handleCancel(selectedRider._id);
                                    setSelectedRider(null);
                                }}
                                className="btn btn-sm btn-error"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingRiders;
