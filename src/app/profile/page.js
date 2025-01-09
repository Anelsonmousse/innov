"use client";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FaSchool } from "react-icons/fa";
import { CiLock } from "react-icons/ci";
import { MdHelpOutline } from "react-icons/md";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import Loader from "@/components/Loader";

const Page = () => {
  const [user, setUser] = useState(null);
  const [uImage, setUserImage] = useState(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  let Umage;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        // console.log(token);

        const form = new FormData();
        form.append("requestID", "rid_1983");

        // Perform the POST request with the Bearer token
        const response = await axios.post(
          "https://api.vplaza.com.ng/users/getuser",
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Handle the response data

        //   console.log(response.data.imageUrl);
        //    Umage = response.data.imageUrl;
        //    console.log(Umage);
        // console.log(response.data);
        setUser(response.data);
        //  localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("userData", JSON.stringify(response.data));
      } catch (error) {
        // Handle any errors
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this useEffect runs once after the initial render

  const LogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("shopDetails");
    localStorage.removeItem("userData");
    localStorage.removeItem("emailn");
    router.push("/signin");
  };

  const handleEditProfileClick = () => {
    setLoading(true); // Activate loader before navigating
    setTimeout(() => {
      router.push("/editprofile");
      setLoading(false); // Deactivate loader after navigating
    }, 500); // Adjust the timeout if needed to simulate loading time
  };

  return (
    <div className="w-full bg-gray-200 h-screen">
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <Loader />
        </div>
      )}
      <div className="bg-[#004AAD] rounded-br-[50px] rounded-bl-[50px] pt-4 w-full h-[35%]">
        <div className="text-white font-bold flex justify-between ml-8 mt-6">
          <div className="flex">
            <IoArrowBack
              onClick={() => {
                router.push("/");
              }}
              color="white"
              size={24}
            />
            <div className="ml-1 text-lg">Profile</div>
          </div>
          <div
            onClick={handleEditProfileClick} // Trigger the loader on click
            className="w-auto text-sm bg-white text-[#004AAD] rounded-lg py-2 px-4 shadow-md cursor-pointer mr-2"
          >
            Edit Profile
          </div>
        </div>
        <div className="flex flex-col items-center">
          <img
            src={user?.imageUrl}
            alt="profile"
            className="w-32 h-32 mt-3 object-cover mb-2 rounded-full"
          />
          <div className="text-white mt-2 font-semibold text-lg">
            {user?.username}
          </div>
          <div className="text-sm mb-2 text-white">{user?.email}</div>
        </div>
      </div>
      <div className="w-full mt-4">
        <div className="bg-white flex px-4 py-4 rounded-lg mx-4">
          <FaSchool color="black" size={26} />
          <div className="text-black pl-4 text-[16px] font-semibold">
            School
          </div>
          <div className="text-black pl-4 text-[10px] w-full text-right font-semibold mt-2">
            {user?.user_location}
          </div>
        </div>
        <div className="bg-white flex px-4 py-4 mt-4 rounded-lg mx-4">
          <CiLock color="black" size={26} />
          <div
            onClick={() => router.push("/privacypolicy")}
            className="text-black pl-4 text-[16px] font-semibold"
          >
            Privacy Policy
          </div>
        </div>
        <div className="bg-white flex px-4 mt-4 py-4 rounded-lg mx-4">
          <MdHelpOutline color="black" size={26} />
          <div
            onClick={() => router.push("/helpcenter")}
            className="text-black pl-4 text-[16px] font-semibold"
          >
            Help Center
          </div>
        </div>
        <div
          onClick={LogOut}
          className="bg-white flex px-4 mt-4 py-4 rounded-lg mx-4"
        >
          <IoIosLogOut color="black" size={26} />
          <div className="text-black pl-4 text-[16px] font-semibold">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
