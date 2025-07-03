import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import warehouseData from '../../assets/warehouses.json'; // adjust the path
import useAuth from '../../hooks/useAuth';
import { useLoaderData } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const SendAParcel = () => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const axiosSecure = useAxiosSecure()

    const watchType = watch('type');
    const senderRegion = watch('senderRegion');
    const receiverRegion = watch('receiverRegion');

    //submit related
    const { user } = useAuth();
    const now = new Date();
    const trackingId = `NDX-${format(now, 'yyyyMMdd')}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

    // Extract unique regions and districts from warehouse data
    const regions = [...new Set(warehouseData.map((item) => item.region))];
    const getDistrictsByRegion = (region) => {
        return [...new Set(warehouseData.filter(item => item.region === region).map(item => item.district))];
    };

    const onSubmit = (data) => {
        const type = data.type;
        const weight = parseFloat(data.weight) || 0;
        const senderDistrict = data.senderCenter;
        const receiverDistrict = data.receiverCenter;


        const isSameDistrict = senderDistrict === receiverDistrict;
        const deliveryZone = isSameDistrict ? "Within Same District" : "Outside District";

        let baseCost = 0;
        let extraCharges = 0;
        let extraExplanation = "";
        let breakdownNote = "";

        if (type === 'document') {
            baseCost = isSameDistrict ? 60 : 80;
            breakdownNote = type + " delivery " + (isSameDistrict ? "within same district." : "outside district.");
        } else {
            if (weight <= 3) {
                baseCost = isSameDistrict ? 110 : 150;
                breakdownNote = `Non-document delivery (≤ 3kg) ${isSameDistrict ? "within district" : "outside district."}`;
            } else {
                const extraWeight = weight - 3;
                const extraWeightCost = extraWeight * 40;
                if (isSameDistrict) {
                    baseCost = 110;
                    extraCharges = extraWeightCost;
                    extraExplanation = `Extra charge: ৳40 × ${extraWeight.toFixed(1)}kg = ৳${extraWeightCost}`;
                } else {
                    baseCost = 150;
                    extraCharges = extraWeightCost + 40;
                    extraExplanation = `Extra charge: ৳40 × ${extraWeight.toFixed(1)}kg = ৳${extraWeightCost}<br>+ ৳40 extra for outside district delivery`;
                }
                breakdownNote = `Non-document over 3kg ${isSameDistrict ? "within district." : "outside district."}`;
            }
        }

        const totalCost = baseCost + extraCharges;

        Swal.fire({
            icon: 'info',
            title: 'Delivery Cost Breakdown',
            html: `
            <div class="text-left text-sm md:text-base">
                <p><strong>Parcel Type:</strong> ${type}</p>
                <p><strong>Weight:</strong> ${weight} kg</p>
                <p><strong>Delivery Zone:</strong> ${isSameDistrict ? 'Within District' : 'Outside District'}</p>
                <hr class="my-2" />
                <p><strong>Base Cost:</strong> ৳${baseCost}</p>
                <p><strong>Extra Charges:</strong> ৳${extraCharges}</p>
                <p class="text-gray-600 text-sm mt-1">${breakdownNote}</p>
                ${extraExplanation ? `<p class="text-gray-600 text-sm mt-1">${extraExplanation}</p>` : ''}
                <hr class="my-2" />
                <p class="text-xl font-bold text-green-600">Total Cost: ৳${totalCost}</p>
            </div>
        `,
            showCancelButton: true,
            confirmButtonText: '🟢 Proceed to Payment',
            cancelButtonText: '✏️ Continue Editing',
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#e5e7eb',
        }).then((result) => {
            if (result.isConfirmed) {
                const parcelData = {
                    ...data,
                    totalCost,
                    created_by: user?.email || 'guest',
                    senderDistrict,
                    receiverDistrict,
                    deliveryZone,
                    created_date: now.toISOString(), // recommended format for DB and sorting
                    created_at_readable: format(now, 'PPpp'), // for display: "Jul 2, 2025 at 11:12 PM"
                    trackingId,
                    status: 'pending',
                    isPaid: false,
                    paymentMethod: 'unpaid',
                };

                console.log('Saving to DB:', parcelData);

                //Save data to server
                axiosSecure.post('/parcels', parcelData)
                    .then(response => {
                        console.log('Parcel submitted successfully:', response.data);
                        if (response.data.insertedId) {
                            // Reset form only if submission is successful
                            reset();
                            //here you could redirect to a payment page or trigger a payment modal
                            Swal.fire({
                                title: "Redirecting....",
                                text: 'Porceeding to payment gateway',
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false
                            });


                        }
                    })


                // 
                // //reset();
            }
        });
    };


    return (
        <div className="mx-auto max-w-7xl bg-base-200 p-6 rounded-xl shadow my-20">
            <h2 className="text-2xl font-bold mb-2">Add Parcel (User)</h2>
            <p className="text-sm mb-6">
                As the system is based on Door-to-Door delivery, Parcel needs both pickup and delivery location.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Parcel Info */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Parcel Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="label">Parcel Type</label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2">
                                    <input type="radio" value="document" {...register('type', { required: true })} className="radio" />
                                    Document
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" value="non-document" {...register('type', { required: true })} className="radio" />
                                    Non-Document
                                </label>
                            </div>
                            {errors.type && <span className="text-red-500 text-sm">Parcel type is required</span>}
                        </div>
                        <div>
                            <label className="label">Title</label>
                            <input {...register('title', { required: true })} className="input input-bordered w-full" />
                            {errors.title && <span className="text-red-500 text-sm">Title is required</span>}
                        </div>
                        {watchType === 'non-document' && (
                            <div>
                                <label className="label">Weight (kg)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    {...register('weight')}
                                    className="input input-bordered w-full"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Sender + Receiver side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Sender Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Sender Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Name</label>
                                <input {...register('senderName', { required: true })} defaultValue="John Doe" className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label">Contact</label>
                                <input {...register('senderContact', { required: true })} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label">Region</label>
                                <select {...register('senderRegion', { required: true })} className="select select-bordered w-full">
                                    <option value="">Select Region</option>
                                    {regions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Service Center</label>
                                <select {...register('senderCenter', { required: true })} className="select select-bordered w-full">
                                    <option value="">Select District</option>
                                    {getDistrictsByRegion(senderRegion).map(dist => (
                                        <option key={dist} value={dist}>{dist}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Address</label>
                                <input {...register('senderAddress', { required: true })} className="input input-bordered w-full" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Pick-up Instruction</label>
                                <textarea {...register('senderInstruction', { required: true })} className="textarea textarea-bordered w-full"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Receiver Info</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="label">Name</label>
                                <input {...register('receiverName', { required: true })} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label">Contact</label>
                                <input {...register('receiverContact', { required: true })} className="input input-bordered w-full" />
                            </div>
                            <div>
                                <label className="label">Region</label>
                                <select {...register('receiverRegion', { required: true })} className="select select-bordered w-full">
                                    <option value="">Select Region</option>
                                    {regions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="label">Service Center</label>
                                <select {...register('receiverCenter', { required: true })} className="select select-bordered w-full">
                                    <option value="">Select District</option>
                                    {getDistrictsByRegion(receiverRegion).map(dist => (
                                        <option key={dist} value={dist}>{dist}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Address</label>
                                <input {...register('receiverAddress', { required: true })} className="input input-bordered w-full" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="label">Delivery Instruction</label>
                                <textarea {...register('receiverInstruction', { required: true })} className="textarea textarea-bordered w-full"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="text-left">
                    <button type="submit" className="btn btn-primary text-black w-full max-w-xs">
                        Submit Parcel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SendAParcel;
