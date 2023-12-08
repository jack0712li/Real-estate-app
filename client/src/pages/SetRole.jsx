import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaStore } from 'react-icons/fa';

export default function ChooseRole() {
  const navigate = useNavigate();

  const handleRoleSelection = async (role) => {
    // 这里发送请求到后端，更新用户的类型
    // 假设用户ID存储在localStorage或通过其他方式获得
    const userId = localStorage.getItem('userId');
    try {
      await fetch(`/api/auth/signup/setRole/${userId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type: role }),
      });
      console.log('Become a', role, 'successfully!');
      navigate('/');  
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };
  return (
    <div className='flex flex-col items-center justify-center h-screen gap-4 p-4'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-800'>
          Welcome New User!
        </h1>
        <p className='text-xl text-gray-600 mt-2'>
          What do you want to become?
        </p>
      </div>
  
      <div className='flex flex-wrap justify-center gap-8 mt-8'>
        <div className='flex flex-col items-center w-1/2 max-w-sm p-8 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-blue-100 hover:border-blue-500 transition-all'
             onClick={() => handleRoleSelection('buyer')}>
          <FaUserTie className='text-8xl text-blue-600 mb-4' />
          <span className='text-2xl text-gray-700'>Become a Buyer</span>
        </div>
  
        <div className='flex flex-col items-center w-1/2 max-w-sm p-8 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-green-100 hover:border-green-500 transition-all'
             onClick={() => handleRoleSelection('seller')}>
          <FaStore className='text-8xl text-green-600 mb-4' />
          <span className='text-2xl text-gray-700'>Become a Seller</span>
        </div>
      </div>
    </div>
  );
  
}
