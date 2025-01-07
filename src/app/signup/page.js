"use client";
import React, { useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import axios from "axios";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    requestID: "rid_1983",
  });

  const [loading, setLoading] = useState(false); // New state for loading
  const [error, setError] = useState(""); // State for error messages
  const router = useRouter();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(""); // Reset error messages on form submit
    setLoading(true); // Set loading to true when the form is submitted

    // Validate password and confirm password
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("confirm_password", formData.confirm_password);
    form.append("requestID", formData.requestID);

    try {
      const response = await axios.post(
        "https://api.vplaza.com.ng/users/registerUser",
        form
      );

      console.log("Success:", response.data);

      // Check if the status is true
      if (response.data.status === true) {
        alert("Sign up successful");

        // Store the access_token in localStorage
        const tokenn = response.data.data.access_token;
        const email = response.data.data.datatoken.email;

        console.log(email);
        localStorage.setItem("token", tokenn);
        localStorage.setItem("emailn", email);

        // Navigate to the edit profile page
        router.push("/editprofile");
      } else {
        alert("Sign up failed. Please check your details and try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Sign up failed. An error occurred.");
    } finally {
      setLoading(false); // Re-enable the button when the request is complete
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

      {/* Main Content */}
      <div className="bg-white w-full h-full rounded-tr-[50px] rounded-tl-[50px] mt-[15%] flex flex-col justify-between">
        <div>
          <div className="font-bold text-3xl pt-28 ml-[7.5%]">Sign Up</div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="w-[100%]">
              <div className="ml-[7.5%] mt-4 text-sm">Email:</div>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-[85%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
              required
              disabled={loading} // Disable input fields when loading
            />
            <div className="w-[100%]">
              <div className="ml-[7.5%] mt-4 text-sm">Password:</div>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              className="w-[85%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
              required
              disabled={loading} // Disable input fields when loading
            />
            <div className="w-[100%]">
              <div className="ml-[7.5%] mt-4 text-sm">Confirm Password:</div>
            </div>
            <input
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your Password"
              type="password"
              name="confirm_password"
              className="w-[85%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
              required
              disabled={loading} // Disable input fields when loading
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

            <button
              type="submit"
              className={`bg-[#004AAD] w-[85%] mt-8 text-center font-bold text-md h-[45px] rounded-lg text-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-center space-x-2 text-sm font-bold w-full text-center mb-8">
          <span>Already have an Account?</span>
          <div
            onClick={() => {
              if (!loading) router.push("/signin");
            }}
            className={`text-[#004AAD] cursor-pointer ${
              loading ? "pointer-events-none" : ""
            }`}
          >
            Login
          </div>
        </div>
      </div>
    </div> 
    </div>
  );
};

export default SignUpPage;
