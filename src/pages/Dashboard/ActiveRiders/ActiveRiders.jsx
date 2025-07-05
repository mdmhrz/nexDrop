import { useState } from "react";
import { FaBan, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../components/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRiders = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState("");

    const { isPending, data: riders = [], refetch } = useQuery({
        queryKey: ['active-riders'],
        queryFn: async () => {
            const res = await axiosSecure.get('/riders/active');
            return res.data;
        }
    });

    if (isPending) return <Loading />;

    const handleDeactivate = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "You are about to deactivate this rider.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, deactivate",
            confirmButtonColor: "#EF4444",
        });

        if (confirm.isConfirmed) {
            const res = await axiosSecure.patch(`/riders/deactivate/${id}`, { status: "deactivated" });
            if (res.data.modifiedCount > 0) {
                Swal.fire("Deactivated", "Rider has been deactivated.", "info");
                refetch();
            }
        }
    };

    const filteredRiders = riders.filter(rider =>
        rider.name.toLowerCase().includes(searchText.toLowerCase()) ||
        rider.mobileNumber.includes(searchText)
    );

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Active Riders</h2>

            {/* Search Bar */}
            <div className="flex items-center mb-4 max-w-md">
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    className="input input-bordered w-full"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <FaSearch className="ml-2 text-gray-500" />
            </div>

            <div className="overflow-x-auto">
                <table className="table w-full border border-base-300 rounded-lg">
                    <thead className="bg-gray-200 text-gray-700">
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Region</th>
                            <th>District</th>
                            <th>Warehouse</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRiders.length > 0 ? (
                            filteredRiders.map((rider) => (
                                <tr key={rider._id}>
                                    <td>{rider.name}</td>
                                    <td>{rider.mobileNumber}</td>
                                    <td>{rider.email}</td>
                                    <td>{rider.region}</td>
                                    <td>{rider.district}</td>
                                    <td>{rider.covered_area}</td>
                                    <td> <span className="badge badge-success">{rider.status}</span></td>
                                    <td>
                                        <button
                                            onClick={() => handleDeactivate(rider._id)}
                                            className="btn btn-sm btn-error text-white"
                                        >
                                            <FaBan className="mr-1" /> Deactivate
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center text-gray-500 py-4">
                                    No active riders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveRiders;
