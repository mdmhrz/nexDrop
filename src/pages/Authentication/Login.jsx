import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import SocialLogin from './SocialLogin/SocialLogin';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const onSubmit = (data) => {
        console.log(data);
        // Handle login logic here, e.g., API call
    };
    return (
        <div className='bg-base-100 p-4 rounded-xl'>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <fieldset className="fieldset">
                    <h2 className='text-center font-bold text-3xl'>Please Login</h2>

                    <label className="label">Email</label>
                    <input type="email" {...register('email')} className="input w-full" placeholder="Email" />

                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input w-full" placeholder="Password" />
                    {errors.password && errors.password.type === 'required' && (
                        <span className="text-red-500">Password is required</span>
                    )}
                    {errors.password?.type === 'minLength' && (<span className="text-red-500">Password must be 6 character</span>)}

                    <div><a className="link link-hover">Forgot password?</a></div>

                    <button className="btn bg-lime-500 mt-4">Login</button>
                    <div>Don't have an account?<Link to='/register' className="btn btn-link text-blue-600">Register</Link></div>
                </fieldset>
            </form>
            <SocialLogin></SocialLogin>
        </div>
    );
};

export default Login;