import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import warehouses from "../../../assets/warehouses.json"; // adjust path accordingly
import riderImage from "../../../assets/agent-pending.png"; // Use your rider image here or URL
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const BeARider = () => {
    const { user } = useAuth();
    console.log(user);
    const {
        register,
        handleSubmit,
        watch,
        reset,
        resetField,
        formState: { errors },
    } = useForm();

    const axiosSecure = useAxiosSecure()

    const [regions, setRegions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [coveredAreas, setCoveredAreas] = useState([]);

    // Watch selected region to update districts
    const selectedRegion = watch("region");
    //Watch selectd disctrict to update wirehouse
    const selectedDistrict = watch("district");

    //region
    useEffect(() => {
        // Get unique regions from warehouses data
        const uniqueRegions = [...new Set(warehouses.map((w) => w.region))];
        setRegions(uniqueRegions);
    }, []);

    //district
    useEffect(() => {
        if (selectedRegion) {
            const filteredDistricts = warehouses
                .filter((w) => w.region === selectedRegion)
                .map((w) => w.district);
            setDistricts(filteredDistricts);
            resetField("district");
        } else {
            setDistricts([]);
            resetField("district");
        }
    }, [selectedRegion, resetField]);

    //covered area
    useEffect(() => {
        if (selectedRegion && selectedDistrict) {
            const matched = warehouses.find(
                (w) => w.region === selectedRegion && w.district === selectedDistrict
            );
            setCoveredAreas(matched?.covered_area || []);
            resetField("covered_area");
        } else {
            setCoveredAreas([]);
            resetField("covered_area");
        }
    }, [selectedRegion, selectedDistrict, resetField]);


    const onSubmit = (data) => {
        // Append read-only user name and email
        const riderData = {
            name: user?.displayName || "",
            email: user?.email || "",
            imageUrl: user?.displayImage,
            status: "pending",
            created_at: new Date().toISOString(), // default status
            ...data,
        };
        console.log("Rider Application:", riderData);

        axiosSecure.post('/riders', riderData).then(res => {
            if (res.data.insertedId) {

                Swal.fire({
                    title: "Application Submitted!",
                    text: "Your rider application is under review. We'll contact you soon.",
                    icon: "success",
                    confirmButtonText: "OK",
                    confirmButtonColor: "#10B981", // optional: Tailwind green-500
                    backdrop: true,
                });
                reset()


            };

        })

    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Form */}
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full lg:w-1/2 bg-white p-8 rounded-lg shadow-md"
                    noValidate
                >
                    <h2 className="text-2xl font-bold mb-6">Be a Rider</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Name (read-only) */}
                        <label className="block mb-3">
                            <span className="block text-gray-500 text-sm mb-1">Name</span>
                            <input
                                type="text"
                                readOnly
                                value={user?.displayName || ""}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                            />
                        </label>

                        {/* Email (read-only) */}
                        <label className="block mb-3">
                            <span className="block text-gray-500 text-sm mb-1">Email</span>
                            <input
                                type="email"
                                readOnly
                                value={user?.email || ""}
                                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" >
                        {/* Mobile Number */}
                        <label className="block mb-3">
                            <span className="block text-gray-500 text-sm mb-1">Mobile Number</span>
                            <input
                                type="tel"
                                placeholder="Enter your mobile number"
                                {...register("mobileNumber", {
                                    required: "Mobile number is required",
                                    pattern: {
                                        value: /^[0-9]{10,15}$/,
                                        message: "Enter a valid mobile number (10-15 digits)",
                                    },
                                })}
                                className={`w-full border rounded px-3 text-sm py-2 ${errors.mobileNumber
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    }`}
                            />
                            {errors.mobileNumber && (
                                <p className="text-red-600 text-sm mt-1">
                                    {errors.mobileNumber.message}
                                </p>
                            )}
                        </label>

                        {/* Age */}
                        <label className="block mb-3">
                            <span className="block text-gray-500 text-sm mb-1">Age</span>
                            <input
                                type="number"
                                placeholder="Enter your age"
                                {...register("age", {
                                    required: "Age is required",
                                    min: { value: 18, message: "Minimum age is 18" },
                                    max: { value: 65, message: "Maximum age is 65" },
                                })}
                                className={`w-full border rounded px-3 text-sm py-2 ${errors.age ? "border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.age && (
                                <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>
                            )}
                        </label>
                    </div>



                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Warehouse (Region) */}
                        <label className="block mb-3">
                            <span className="block text-gray-500 text-sm mb-1">Region</span>
                            <select
                                {...register("region", { required: "Region is required" })}
                                className={`w-full border rounded px-3 text-sm py-2 ${errors.region ? "border-red-500" : "border-gray-300"
                                    }`}
                            >
                                <option value="">Select Region</option>
                                {regions.map((region) => (
                                    <option key={region} value={region}>
                                        {region}
                                    </option>
                                ))}
                            </select>
                            {errors.region && (
                                <p className="text-red-600 text-sm mt-1">{errors.region.message}</p>
                            )}
                        </label>

                        {/* District */}
                        <label className="block mb-3">
                            <span className="block text-gray-500 text-sm mb-1">District</span>
                            <select
                                {...register("district", { required: "District is required" })}
                                disabled={!selectedRegion}
                                className={`w-full border rounded px-3 text-sm py-2 disabled:bg-gray-100 ${errors.district ? "border-red-500" : "border-gray-300"
                                    }`}
                            >
                                <option value="">Select District</option>
                                {districts.map((district) => (
                                    <option key={district} value={district}>
                                        {district}
                                    </option>
                                ))}
                            </select>
                            {errors.district && (
                                <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>
                            )}
                        </label>
                    </div>

                    <div >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Bike Brand */}
                            <label className="block mb-3">
                                <span className="block text-gray-500 text-sm mb-1">Bike Brand</span>
                                <input
                                    type="text"
                                    placeholder="Enter your bike brand"
                                    {...register("bikeBrand", {
                                        required: "Bike brand is required",
                                    })}
                                    className={`w-full border rounded px-3 text-sm py-2 ${errors.bikeBrand ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.bikeBrand && (
                                    <p className="text-red-600 text-sm mt-1">{errors.bikeBrand.message}</p>
                                )}
                            </label>

                            {/* Bike Registration Number */}
                            <label className="block mb-6">
                                <span className="block text-gray-500 text-sm mb-1">Bike Registration Number</span>
                                <input
                                    type="text"
                                    placeholder="Enter your bike registration number"
                                    {...register("bikeRegistration", {
                                        required: "Bike registration number is required",
                                    })}
                                    className={`w-full border rounded px-3 text-sm py-2 ${errors.bikeRegistration ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.bikeRegistration && (
                                    <p className="text-red-600 text-sm mt-1">{errors.bikeRegistration.message}</p>
                                )}
                            </label>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* NID Number */}
                            <label className="block mb-3">
                                <span className="block text-gray-500 text-sm mb-1">NID Number</span>
                                <input
                                    type="text"
                                    placeholder="Enter your NID number"
                                    {...register("nidNumber", {
                                        required: "NID number is required",
                                        pattern: {
                                            value: /^[0-9]{10,17}$/,
                                            message: "Enter a valid NID number (10-17 digits)",
                                        },
                                    })}
                                    className={`w-full border rounded px-3 text-sm py-2 ${errors.nidNumber ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.nidNumber && (
                                    <p className="text-red-600 text-sm mt-1">{errors.nidNumber.message}</p>
                                )}
                            </label>

                            {/* Driving License Number */}
                            <label className="block mb-3">
                                <span className="block text-gray-500 text-sm mb-1">Driving License Number</span>
                                <input
                                    type="text"
                                    placeholder="Enter your driving license number"
                                    {...register("drivingLicense", {
                                        required: "Driving license number is required",
                                    })}
                                    className={`w-full border rounded px-3 text-sm py-2 ${errors.drivingLicense ? "border-red-500" : "border-gray-300"
                                        }`}
                                />
                                {errors.drivingLicense && (
                                    <p className="text-red-600 text-sm mt-1">{errors.drivingLicense.message}</p>
                                )}
                            </label>
                        </div>


                    </div>

                    {/* Warehouse Covered Area */}
                    <label className="block mb-6">
                        <span className="block text-gray-500 text-sm mb-1">Which Warehouse You Want to Work?</span>
                        <select
                            {...register("covered_area", {
                                required: "Please select a warehouse area",
                            })}
                            disabled={coveredAreas.length === 0}
                            className={`w-full border rounded px-3 text-sm py-2 disabled:bg-gray-100 ${errors.covered_area ? "border-red-500" : "border-gray-300"
                                }`}
                        >
                            <option value="">Select Area</option>
                            {coveredAreas.map((area) => (
                                <option key={area} value={area}>
                                    {area}
                                </option>
                            ))}
                        </select>
                        {errors.covered_area && (
                            <p className="text-red-600 text-sm mt-1">{errors.covered_area.message}</p>
                        )}
                    </label>

                    <button
                        type="submit"
                        className="btn btn-primary w-full text-black py-3"
                    >
                        Submit
                    </button>
                </form>

                {/* Rider Image */}
                <div className="w-full lg:w-1/2 flex justify-center">
                    <img
                        src={riderImage}
                        alt="Rider"
                        className="max-w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
            </div>
        </div>
    );
};

export default BeARider;
