import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logInStart, logInSuccess, logInFailure} from '../redux/user/userSlice';
import OAuth from '../components/OAuth.jsx';

export default function LogIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector(state => state.user);
  const  navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData(
      { 
        ...formData, 
        [e.target.id]: e.target.value 
      }
    )
  } 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(logInStart());
      const res = await fetch('/api/auth/login',
        {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if(data.success === false) {
        dispatch(logInFailure(data.message));
        return;
      }
      dispatch(logInSuccess(data));
      navigate('/');
    }
    catch(error) {
      dispatch(logInFailure(error.message));
    }
  }
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        Log In
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id="username" onChange={handleChange}/>
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id="password" onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-600 text-white p-3 rounded-lg uppercase hover:opacity-80 disabled:opacity-60'>
          {loading ? 'Loading...' : 'Log In'}
        </button>
          <OAuth/>
      </form>
      <div className='flex gap-2 mt-5 justify-center'>
        <p>Do not have an account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div >
      <div className='flex justify-center'>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    </div>
  )
}
