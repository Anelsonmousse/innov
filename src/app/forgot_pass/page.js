"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { IoArrowBack } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

const page = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const requestID = "rid_1983";
  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem("token");
    const requestID = "rid_1983";

    let endpoint = "https://api.vplaza.com.ng/users/forgetPassword";
    let data = {
      requestID,
      email,
    };

    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : {};

    try {
      console.log(endpoint, data, config)
      const response = await axios.post(endpoint, data, config);

      console.log(response);
      if (response.data.message === "OTP sent") {
        console.log(response.data.message.trim() === `OTP sent to ${email}`.trim());

        
        router.push(`/forgot_pass/otp?email=${encodeURIComponent(email)}`);
      } else {
        setError(response.data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to send OTP. Please try again.');
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
            Forgot Password
          </div>

          <form onSubmit={handleEmailSubmit} className="w-full px-8">
            <div className="mt-4">
              <label htmlFor="email" className="block ml-[10%]">
                Email:
              </label>
              <input
                placeholder="Enter your Email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Sending...' : 'Send OTP'}
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