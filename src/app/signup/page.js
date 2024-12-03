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
    setLoading(true); // Set loading to true when the form is submitted

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

      console.log(form);
      
      console.log("Success:", response.data);
      alert("Sign up successful");
        // Store the access_token in localStorage
        const tokenn = response.data.data.access_token;
        const email = response.data.data.datatoken.email;

        console.log(email)
      localStorage.setItem("token", tokenn);
      localStorage.setItem("emailn", email);
      router.push("/editprofile");
    } catch (error) {
      console.error("Error:", error);
      alert("Sign up failed");
    } finally {
      setLoading(false); // Re-enable the button when the request is complete
    }
  };

  return (
    <div className={`w-full h-full ${loading ? "pointer-events-none opacity-50" : ""}`}>
      <div className="bg-[#004AAD] pt-4 w-full h-[15%]">
        <IoArrowBack color="white" className="mt-4 ml-3" size={30} />
        <div className="bg-white h-[85%] rounded-tr-[50px] rounded-tl-[50px] mt-[15%]">
          <div className="font-bold text-2xl pt-16 px-8">Sign Up</div>
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Email:</div>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your Email"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
              required
              disabled={loading} // Disable input fields when loading
            />
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Password:</div>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your Password"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
              required
              disabled={loading} // Disable input fields when loading
            />
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Confirm Password:</div>
            </div>
            <input
              value={formData.confirm_password}
              onChange={handleChange}
              placeholder="Confirm your Password"
              type="password"
              name="confirm_password"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
              required
              disabled={loading} // Disable input fields when loading
            />
            <button
              type="submit"
              className={`bg-[#004AAD] w-[90%] ml-[5%] mt-16 text-center font-bold text-lg h-[45px] rounded-lg text-white py-2 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={loading} // Disable button when loading
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </form>
          <div className="font-bold text-center text-md w-full text-wrap mt-12">
            Already have an Account?{" "}
            <div
              onClick={() => {
                if (!loading) router.push("/signin");
              }}
              className={`text-[#004AAD] text-center ${loading ? "pointer-events-none" : ""}`}
            >
              Log In
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
