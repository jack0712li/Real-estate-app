import React from 'react';
import { useNavigate } from 'react-router-dom';

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
      navigate('/sign-in');  
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <div className='choose-role'>
      <button onClick={() => handleRoleSelection('buyer')}>Become a Buyer</button>
      <button onClick={() => handleRoleSelection('seller')}>Become a Seller</button>
    </div>
  );
}
