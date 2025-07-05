import { useState } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield, FaUserSlash } from "react-icons/fa";

const MakeAdmin = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState("");
    const [query, setQuery] = useState("");

    const { data: users = [], isFetching, refetch } = useQuery({
        queryKey: ["search-users", query],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/search?email=${query}`);
            return res.data;
        },
        enabled: !!query
    });

    const handleSearch = () => {
        if (searchText.trim()) {
            setQuery(searchText.trim());
        }
    };

    const handleMakeAdmin = async (id) => {
        const confirm = await Swal.fire({
            title: "Make Admin?",
            text: "Are you sure you want to give admin access?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Make Admin",
            confirmButtonColor: "#10B981",
        });

        if (confirm.isConfirmed) {
            await axiosSecure.patch(`/users/make-admin/${id}`);
            Swal.fire("Success", "User is now an admin!", "success");
            refetch();
        }
    };

    const handleRemoveAdmin = async (id) => {
        const confirm = await Swal.fire({
            title: "Remove Admin?",
            text: "Are you sure you want to revoke admin access?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Remove",
            confirmButtonColor: "#EF4444",
        });

        if (confirm.isConfirmed) {
            await axiosSecure.patch(`/users/remove-admin/${id}`);
            Swal.fire("Updated", "Admin access removed!", "info");
            refetch();
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Admin Management</h2>

            {/* Search Input */}
            <div className="flex gap-2 mb-6">
                <input
                    type="text"
                    placeholder="Search by email"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="input input-bordered w-full"
                />
                <button onClick={handleSearch} className="btn btn-primary text-black">
                    <FaSearch className="mr-2" /> Search
                </button>
            </div>

            {/* Loading or no result */}
            {isFetching ? (
                <p className="text-sm text-gray-500">Searching...</p>
            ) : users.length === 0 && query ? (
                <p className="text-red-500">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="table w-full border border-base-300 rounded-lg">
                        <thead className="bg-gray-200 text-gray-700">
                            <tr>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Created At</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user._id} className="hover">
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`badge ${user.role === 'admin' ? 'badge-success' : 'badge-secondary'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>{new Date(user.created_at).toLocaleString()}</td>
                                    <td>
                                        {user.role === "admin" ? (
                                            <button onClick={() => handleRemoveAdmin(user._id)} className="btn btn-xs btn-error">
                                                <FaUserSlash className="mr-1" /> Remove Admin
                                            </button>
                                        ) : (
                                            <button onClick={() => handleMakeAdmin(user._id)} className="btn btn-xs btn-success">
                                                <FaUserShield className="mr-1" /> Make Admin
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MakeAdmin;
