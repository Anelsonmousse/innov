"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for email in URL params when component mounts
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      // Redirect back if no email is provided
      router.replace('/forgot-password');
    }
  }, [router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const requestID = "rid_1983";
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://api.vplaza.com.ng/users/resetPassword',
        {
          email,
          otp: formData.otp,
          newPassword: formData.newPassword,
          requestID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === 'Password reset successful') {
        alert('Password reset successful');
        router.push('/login');
      } else {
        setError(response.data.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="bg-[#004AAD] pt-4 w-full h-[15%]">
        <IoArrowBack
          color="white"
          className="mt-4 ml-3"
          size={30}
          onClick={() => router.back()}
        />

        <div className="bg-white w-full h-[85%] rounded-tr-[50px] rounded-tl-[50px] mt-[15%]">
          <div className="font-bold text-3xl pt-32 px-8">
            Reset Password
          </div>

          <form onSubmit={handlePasswordReset} className="w-full px-8">
            <div className="mt-4">
              <label htmlFor="otp" className="block ml-[10%]">
                OTP:
              </label>
              <input
                placeholder="Enter OTP"
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-[80%] opacity-40 border-2 ml-[10%] rounded-lg pl-3 h-[45px] border-black"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="newPassword" className="block ml-[10%]">
                New Password:
              </label>
              <input
                placeholder="Enter New Password"
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-[80%] opacity-40 border-2 ml-[10%] rounded-lg pl-3 h-[45px] border-black"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="confirmPassword" className="block ml-[10%]">
                Confirm Password:
              </label>
              <input
                placeholder="Confirm New Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-[80%] opacity-40 border-2 ml-[10%] rounded-lg pl-3 h-[45px] border-black"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-center mt-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="bg-[#004AAD] w-[90%] ml-[5%] mt-16 text-center font-bold text-lg h-[45px] rounded-lg text-white py-2"
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
    </div>
  );
};

export default page;
