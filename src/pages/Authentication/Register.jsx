import React from 'react';
import { set, useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';
import SocialLogin from './SocialLogin/SocialLogin';
import axios from 'axios';
import { useState } from 'react';
import useAxios from '../../hooks/useAxios';

const Register = () => {
    const [profilePic, setProfilePic] = useState('');
    const { createUser, updateUserProfile } = useAuth();
    const axiosInstance = useAxios()

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();




    const onSubmit = (data) => {
        console.log(data);
        createUser(data.email, data.password)
            .then(async (result) => {
                console.log(result.user);

                //Update userInfo in the database
                const userInfo = {
                    email: data.email,
                    role: 'user', //default role
                    created_at: new Date().toISOString(),
                    last_log_in: new Date().toISOString(),
                }

                const userRes = await axiosInstance.post('/users', userInfo);
                console.log(userRes.data);

                //update user profile in firebase
                const userProfile = {
                    displayName: data.name,
                    photoURL: profilePic,
                }
                updateUserProfile(userProfile)
                    .then(() => {
                        console.log('Profile name and picture updated');
                    })
                    .catch(errors => console.log(errors))



            }).catch(error => {
                console.error('Error creating user:', error)
            })
    };

    const handleImageUpload = async (e) => {
        const image = e.target.files[0];
        // console.log(image);

        const formData = new FormData();
        formData.append('image', image)

        //upload image to imgbb
        const imageUploadUrl = `https://api.imgbb.com/1/upload?&key=${import.meta.env.VITE_image_upload_key}`
        const res = await axios.post(imageUploadUrl, formData)
        setProfilePic(res.data.data.url);
        console.log(res.data.data.url);
    }


    return (
        <div className='bg-base-100 p-4 rounded-xl'>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <fieldset className="fieldset">
                    <h2 className='text-center font-bold text-3xl'>Register Now</h2>


                    {/* Name field */}
                    <label className="label">Your Name</label>
                    <input type="text" {...register('name', {
                        required: true,
                    })} className="input w-full" placeholder="Your Name" />
                    {errors.email && errors.email.type === 'required' && (
                        <span className="text-red-500">Name is required</span>)}

                    {/* Image field */}
                    <label className="label">Your Picture</label>
                    <input
                        onChange={handleImageUpload}
                        type="file"
                        className="input w-full"
                        placeholder="Your Profile Picture"
                    />


                    {/* Email field */}
                    <label className="label">Email</label>
                    <input type="email" {...register('email', {
                        required: true,
                    })} className="input w-full" placeholder="Email" />
                    {errors.email && errors.email.type === 'required' && (
                        <span className="text-red-500">Email is required</span>)}


                    {/* Password field */}
                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input w-full" placeholder="Password" />
                    {errors.password && errors.password.type === 'required' && (
                        <span className="text-red-500">Password is required</span>
                    )}
                    {errors.password?.type === 'minLength' && (<span className="text-red-500">Password must be 6 characters</span>)}


                    <button className="btn bg-lime-500 mt-4">Regiser</button>
                    <div>Already have an account?<Link to='/login' className="btn btn-link text-blue-600">Login</Link></div>
                </fieldset>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Register;