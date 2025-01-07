"use client";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    requestID: "rid_1983",
  });
  const [loading, setLoading] = useState(false); // State for managing the loader

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loader when submission starts

    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("requestID", formData.requestID);

    try {
      const response = await axios.post(
        "https://api.vplaza.com.ng/users/loginfunc",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.data.message == "success") {
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem(
          "userData",
          JSON.stringify(response.data.data.userData)
        );
        localStorage.setItem(
          "shopDetails",
          JSON.stringify(response.data.shopDetails)
        );
        localStorage.setItem("emailn", response.data.data.userData.email);
        console.log("Success:", response.data);
        const token = localStorage.getItem("token");
        console.log(token);
        router.push("/");
      } else {
        console.log("Failed:", response.data);
        alert("Invalid Credentials entered");
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Login failed");
    } finally {
      setLoading(false); // Hide loader after completion
    }
  };

  return (
    <div className="w-full h-screen">
  <div className="bg-[#004AAD] pt-4 w-full h-screen flex flex-col">
    <IoArrowBack
      color="white"
      className="mt-4 ml-3"
      size={30}
      onClick={() => router.back()}
    />

    <div className="bg-white w-full h-full rounded-tr-[50px] rounded-tl-[50px] mt-[15%] flex flex-col justify-between">
      <div>
        <div className="font-bold text-3xl pt-32 ml-[10%]">Login</div>
        <form onSubmit={handleSubmit} className="w-full px-8">
          <div className="mt-4">
            <label htmlFor="email" className="block ml-[5%] text-sm">
              Email:
            </label>
            <input
              placeholder="Enter your Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-[90%] opacity-40 border-2 ml-[5%] rounded-lg pl-3 h-[45px] border-black"
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="block ml-[5%] text-sm">
              Password:
            </label>
            <input
              placeholder="Enter your Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-[90%] opacity-40 border-2 ml-[5%] rounded-lg pl-3 h-[45px] border-black"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-[#004AAD] w-[90%] ml-[5%] mt-8 text-center font-bold text-md h-[45px] rounded-lg text-white py-2"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>
        <div
          onClick={() => router.push("/forgot_pass")}
          className="w-full text-right text-[#004AAD] text-sm pr-[10%] font-bold mt-1 cursor-pointer"
        >
          Forgotten Password?
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex items-center justify-center space-x-2 text-sm font-bold w-full text-center mb-8">
        <span>Don't have an Account?</span>
        <div
          onClick={() => router.push("/signup")}
          className="text-[#004AAD] cursor-pointer"
        >
          Sign Up
        </div>
      </div>
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

export default Page;
