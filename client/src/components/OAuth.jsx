import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { logInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL}),
            });
            // const data = await res.json();
            // console.log(data);
            // dispatch(logInSuccess(data));
            // navigate('/');
            const data = await res.json();
            localStorage.setItem('userId', data._id);
            dispatch(logInSuccess(data));
            if (data.isNewUser) {
                navigate('/setrole');  // 新用户导航到角色选择页面
            } else {
                navigate('/');  // 现有用户导航到主页或其他页面
            }
        }catch(error){
            console.log("could not sign in with google",error)
        }
    }
  return (
    <button onClick={handleGoogleClick} type='button' className='bg-blue-600 text-white p-3 rounded-lg uppercase hover: opacity-80'>Continue with google</button>
  )
}
