import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; 
import brandImage from '../image/brandImage.png'; 


export default function About() {
  return (
    <div className='container mx-auto px-4 md:px-12 py-20'>
      <h1 className='text-4xl md:text-5xl font-bold mb-10 text-center text-slate-800'>About NewBoston Estate</h1>
      <div className='flex flex-wrap justify-between -mx-4 bg-transparent'>
        {/* 左侧区域：图片 */}
        <div className='md:w-1/2 px-4 mb-6 flex justify-center bg-transparent'>
          <img src={brandImage} alt="NewBoston Estate" className='w-full md:w-3/4 h-auto object-contain rounded-lg border-0 m-0 p-0 shadow-none'/>
        </div>
        {/* 右侧区域：文字内容 */}
        <div className='md:w-1/2 px-4 flex flex-col justify-center'>
          <h2 className='text-2xl font-bold text-slate-800 mb-6'>Your Dream Home Awaits</h2>
            <p className='text-lg text-slate-700 mb-6'>
              Welcome to NewBoston Estate, the premier real estate agency in the heart of the most sought-after neighborhoods. 
              For over 20 years, we've been the guiding force in helping people find their perfect home or smoothly transition to their next one.
            </p>
            <h3 className='text-xl font-bold text-slate-800 mb-4'>Why Choose Us?</h3>
            <ul className='list-disc list-inside mb-6 text-lg text-slate-700'>
              <li><strong>Local Expertise</strong>: Deeply knowledgeable in desirable neighborhoods.</li>
              <li><strong>Personalized Service</strong>: Tailored solutions to fit your unique needs.</li>
              <li><strong>Proven Track Record</strong>: Thousands of happy homeowners.</li>
            </ul>
            <p className='text-lg text-slate-700 mb-6'>
              Ready to find your dream home? Contact us today and let NewBoston Estate guide you home!
            </p>
          {/* 联系和关注部分 */}
          <div>
            <h3 className='text-xl font-bold text-slate-800 mb-4'>Contributor</h3>
            <div className='flex flex-wrap'>
              <a href="https://www.linkedin.com/in/shaoming-li-7024881ab/" className='text-lg text-slate-700 mb-4 flex items-center mr-4'>
                <FaLinkedin className='inline mr-2'/>Shaoming Li
              </a>
              <a href="https://www.linkedin.com/in/zichuan-zhu-a0a625233/" className='text-lg text-slate-700 mb-4 flex items-center mr-4'>
                <FaLinkedin className='inline mr-2'/>Zichuan Zhu
              </a>
              <a href="https://www.linkedin.com/in/ruixin-ori-li-8362351ba" className='text-lg text-slate-700 mb-4 flex items-center mr-4'>
                <FaLinkedin className='inline mr-2'/>Ruixin Li
              </a>
              <a href="https://www.linkedin.com/in/yalun-qi-422518170/" className='text-lg text-slate-700 mb-4 flex items-center'>
                <FaLinkedin className='inline mr-2'/>Yalun Qi
              </a>
            </div>
            <h3 className='text-xl font-bold text-slate-800 mb-4 mt-6'>Follow Us</h3>
            <a href="https://github.com/jack0712li/Real-estate-app.git" className='text-lg text-slate-700 flex items-center'>
              <FaGithub className='inline mr-2'/>GitHub
            </a>
          </div>
        </div>
      </div>

      <div className='w-full border-t border-gray-300 pt-6 mt-8 '>
        <h2 className='text-2xl font-bold mb-4  text-slate-800'>Legal Terms and Usage Rights</h2>
        <ul>
          <li className='text-slate-700 mb-4'>NewBoston Estate respects your rights and privacy.</li>
          <li className='text-slate-700 mb-4'>All photographs and houses associated with NewBoston Estate are the exclusive intellectual property of NewBoston Estate.</li>
          <li className='text-slate-700 mb-4'>We reserve all rights pertaining to these materials.</li>
          <li className='text-slate-700 mb-4'>Any unauthorized use, reproduction, or distribution of these materials will be considered a violation of our rights and will be prosecuted to the fullest extent of the law.</li>
        </ul>
      </div>
    </div>
  );
}
