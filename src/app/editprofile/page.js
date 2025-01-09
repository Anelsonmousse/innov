"use client";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Edit } from "../../assets";
import axios from "axios";
import client from "../sanity/sanityClient";

const Page = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [loading, setLoading] = useState(false);
  const [user_location, setUserLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const requestID = "rid_1983";

  // Validate if all required fields are filled
  const isFormValid = () => {
    return (
      username.trim() !== "" &&
      gender.trim() !== "" &&
      phone.trim() !== "" &&
      user_location.trim() !== "" &&
      imagePreview !== null
    );
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      // console.log(userData);
      setUsername(userData.username || "");
      setGender(userData.gender === 1 ? "Male" : "Female");
      setPhone(userData.phone || "");
      setUserLocation(userData.user_location || "");
      setImageUrl(userData.imageUrl || "");
      setImagePreview(userData.imageUrl || "");
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.post(
          "https://api.vplaza.com.ng/shops/getUni",
          {
            requestID,
          }
        );
        const data = response.data;
        setLocations(data);
        // console.log(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true); // Start the loader

    try {
      const token = localStorage.getItem("token");
      let uploadedImageUrl = imageUrl; // Use existing image URL by default

      if (imageFile) {
        // console.log("Uploading to Sanity:", { imageFile });

        try {
          // Upload the image to Sanity
          const imageAsset = await client.assets.upload("image", imageFile);
          uploadedImageUrl = imageAsset.url;
        } catch (sanityError) {
          console.error("Sanity upload failed:", sanityError);
        }
      }

      // Ensure that gender is either Male or Female before sending the value
      let genderValue = null;  // Default to null if gender is invalid
      if (gender === "Male") {
        genderValue = 1;
      } else if (gender === "Female") {
         genderValue = 0;
      }

      const payload = {
        imageUrl: uploadedImageUrl,
        username,
        gender: genderValue, // Send 1 for Male, 0 for Female
        phone,
        servicesOffered,
        user_location,
        requestID,
      };

      // console.log("Sending data to backend (editUser):", payload);

      const response = await axios.post(
        "https://api.vplaza.com.ng/users/editUser",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        // console.log(response.data.status);
        // console.log(response);
        alert("Profile updated successfully");
        router.push("/profile");
      } else if (response.message === "signature verification failed") {
        router.push("/signin");
      } else {
        // console.log(response);
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  const triggerFileInput = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="loader">Uploading...</div>
        </div>
      )}
      <div className="bg-[#004AAD] pt-2 w-full h-[15%]">
        <div className="text-white font-bold flex justify-between ml-4 mt-3">
          <div className="flex">
            <IoArrowBack
              onClick={() => {
                router.back();
              }}
              color="white"
              size={30}
            />
            <div className="ml-1 text-lg">Edit Profile</div>
          </div>
        </div>
        <div className="bg-white h-[95%] rounded-tr-[50px] rounded-tl-[50px] mt-[10%]">
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex flex-col items-center"
          >
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="mt-3" onClick={triggerFileInput}>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-32 h-32 object-cover mb-4 rounded-full"
                />
              ) : (
                <div className="w-32 h-32 relative mb-4">
                  <Image
                    src={Edit}
                    alt="Upload"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
            </div>
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Full Name:</div>
            </div>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Full Name"
              type="text"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
            />
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Gender:</div>
            </div>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
            >
              <option value="" disabled>
                Select your Gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Phone Number:</div>
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your Phone number"
              type="tel"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
            />
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Service offered (optional):</div>
            </div>
            <input
              value={servicesOffered}
              onChange={(e) => setServicesOffered(e.target.value)}
              placeholder="Enter services you offer"
              type="text"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
            />
            {/* Store Location Dropdown */}
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Your Location:</div>
            </div>
            <div className="relative w-[80%] mt-2">
              <select
                value={user_location}
                onChange={(e) => setUserLocation(e.target.value)}
                className="pl-3 opacity-40 border-2 rounded-lg h-[45px] border-black peer focus:border-[#004AAD] focus:ring-0 w-full"
              >
                <option value="" disabled>
                  Select your location
                </option>
                {Array.isArray(locations) &&
                  locations.map((location) => (
                    <option key={location.uni_id} value={location.uni_name}>
                      {location.uni_name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleSave}
              disabled={!isFormValid()}
              className={`
                ${
                  isFormValid()
                    ? "bg-[#004AAD] cursor-pointer hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }
                text-white mt-5 py-2 px-4 rounded-lg
              `}
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
