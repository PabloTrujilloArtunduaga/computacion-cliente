import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const { register, handleSubmit,
    formState: {errors}
   } = useForm();
  const { signup } = useAuth();

  const onSubmit = handleSubmit(async (values) => {
    await signup(values);
  });

  return (
    <div className='bg-zinc-800 max-w-md p-10 rounded-md'>
      <form onSubmit={onSubmit}>
        <input 
          type="text"
          {...register("username", { required: true })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Username'
        />
        <input 
          type="email"
          {...register("email", { required: true })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='email@gmail.com'
        />
        <input 
          type="password"
          {...register("password", { required: true })}
          className='w-full bg-zinc-700 text-white px-4 py-2 rounded-md my-2'
          placeholder='Password'
        />
        <button type='submit'>Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;