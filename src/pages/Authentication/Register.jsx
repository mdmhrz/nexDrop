import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router';
import SocialLogin from './SocialLogin/SocialLogin';

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const { createUser } = useAuth()


    const onSubmit = (data) => {
        console.log(data);
        createUser(data.email, data.password)
            .then(result => {
                console.log(result.user);
            }).catch(error => {
                console.error('Error creating user:', error)
            })
    };


    return (
        <div className='bg-base-100 p-4 rounded-xl'>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <fieldset className="fieldset">
                    <h2 className='text-center font-bold text-3xl'>Register Now</h2>


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