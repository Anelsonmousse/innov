"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    otp: "",
    password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    const requestID = "rid_1983";

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("otp", formData.otp);
      data.append("password", formData.password);
      data.append("confirm_password", formData.confirm_password);
      data.append("requestID", requestID);

      // Log data being sent to the backend
      console.log("Data being sent to backend:");
      for (const pair of data.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      const response = await axios.post(
        "https://api.vplaza.com.ng/users/resetPassword",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (response.data.status === true) {
        alert("Password reset successful");
        router.push("/signin");
      } else {
        setError(response.data.message || "Password reset failed");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to reset password. Please try again.");
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
          <div className="font-bold text-3xl pt-32 px-8">Reset Password</div>

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
              <label htmlFor="password" className="block ml-[10%]">
                Password:
              </label>
              <input
                placeholder="Enter New Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-[80%] opacity-40 border-2 ml-[10%] rounded-lg pl-3 h-[45px] border-black"
                required
              />
            </div>

            <div className="mt-4">
              <label htmlFor="confirm_password" className="block ml-[10%]">
                Confirm Password:
              </label>
              <input
                placeholder="Confirm New Password"
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                className="w-[80%] opacity-40 border-2 ml-[10%] rounded-lg pl-3 h-[45px] border-black"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-center mt-2">{error}</div>
            )}

            <button
              type="submit"
              className="bg-[#004AAD] w-[90%] ml-[5%] mt-16 text-center font-bold text-lg h-[45px] rounded-lg text-white py-2"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
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
