import React from 'react';
import { useForm } from 'react-hook-form';

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
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
                <fieldset className="fieldset">
                    <h2 className='text-center font-bold text-3xl'>Login Now</h2>

                    <label className="label">Email</label>
                    <input type="email" {...register('email')} className="input w-full" placeholder="Email" />

                    <label className="label">Password</label>
                    <input type="password" {...register('password', { required: true, minLength: 6 })} className="input w-full" placeholder="Password" />
                    {errors.password && errors.password.type === 'required' && (
                        <span className="text-red-500">Password is required</span>
                    )}
                    {errors.password?.type === 'minLength' && (<span className="text-red-500">Password must be 6 character</span>)}

                    <div><a className="link link-hover">Forgot password?</a></div>

                    <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
            </form>
        </div>
    );
};

export default Login;