"use client";
import React, { useState, useEffect } from "react";
import { IoArrowBack } from "react-icons/io5";
import {
  MdPhone,
  MdDescription,
  MdRoomService,
  MdLocationOn,
} from "react-icons/md";
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
  const [email, setEmail] = useState(""); // State for email
  const [loading, setLoading] = useState(false);
  const [user_location, setUserLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const requestID = "rid_1983";

  // Load data from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const uEmail = localStorage.getItem("emailn");
    if (userData) {
      console.log(userData);
      setUsername(userData.username || "");
      setGender(userData.gender === 1 ? "Male" : "Female");
      setPhone(userData.phone || "");
      setEmail(uEmail || ""); 
      setUserLocation(userData.user_location || "");
      // Set email from localStorage
      setImageUrl(userData.imageUrl || "");
      setImagePreview(userData.imageUrl || "");
    } else if (uEmail) {
      setEmail(uEmail || ""); // Set email from localStorage
    };

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
        console.log(data);
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
      try {
        // Log the image file being uploaded to Sanity
        console.log("Uploading to Sanity:", { imageFile });

        // Upload to Sanity first
        const imageAsset = await client.assets.upload("image", imageFile);
        uploadedImageUrl = imageAsset.url;

        // Log the data being sent to the backend after Sanity upload
        console.log("Sending data to backend (editUser):", {
          imageUrl: uploadedImageUrl,
          username,
          gender: gender === "Male" ? 1 : 0,
          phone,
          servicesOffered,
          user_location,
          email, // Include email in the request body
          requestID,
        });

        // Send the data to the backend
        const response = await axios.post(
          "https://api.vplaza.com.ng/users/editUser",
          {
            imageUrl: uploadedImageUrl,
            username,
            gender: gender === "Male" ? 1 : 0,
            phone,
            servicesOffered,
            user_location,
            email, // Include email in the request body
            requestID,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          console.log(response);
          alert("Profile updated successfully");
          router.push("/");
        } else if(response.message === "signature verification failed") {
          router.push("/signin");
        } else {
          console.log(response);
          alert("Failed to update profile");
        }
      } catch (sanityError) {
        console.error("Sanity upload failed:", sanityError);

        // Log the data being sent to the backend when uploading the image directly
        const formData = new FormData();
        formData.append("imageUrl", imageFile);
        formData.append("username", username);
        formData.append("gender", gender === "Male" ? 1 : 0);
        formData.append("phone", phone);
        formData.append("servicesOffered", servicesOffered);
        formData.append("email", email); 
        formData.append("requestID", requestID);
        formData.append("user_location", user_location);

        console.log("Sending data to backend (editUser2):", formData);

        const response = await axios.post(
          "https://api.vplaza.com.ng/users/editUser2",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          uploadedImageUrl = response.data.imageUrl; // Update image URL with the backend's response
          console.log(response);
          alert("Profile updated successfully");
          router.push("/");
          return;
        } else if(response.message === "signature verification failed") {
          router.push("/signin");
        } else {
          console.log(response);
          alert("Failed to update profile");
        }
      }
    } else {
      // Log the data being sent to the backend if no new image is selected
      console.log("Sending data to backend (editUser) with existing image:", {
        imageUrl: uploadedImageUrl,
        username,
        gender: gender === "Male" ? 1 : 0,
        phone,
        user_location,
        servicesOffered,
        email, // Include email in the request body
        requestID,
      });

      // If no new image is selected, send the existing imageUrl to the backend
      const response = await axios.post(
        "https://api.vplaza.com.ng/users/editUser",
        {
          imageUrl: uploadedImageUrl,
          username,
          gender: gender === "Male" ? 1 : 0,
          phone,
          user_location,
          servicesOffered,
          email, // Include email in the request body
          requestID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        console.log(response.data.data);
        alert("Profile updated successfully");
        router.push("/");
      } else if(response.message === "signature verification failed") {
        router.push("/signin");
      } else {
        console.log(response);
        alert("Failed to update profile");
      }
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
      <div className="bg-[#004AAD] pt-4 w-full h-[15%]">
        <IoArrowBack
          onClick={() => router.back()}
          color="white"
          className="mt-4 ml-3"
          size={30}
        />
        <div className="text-white font-bold text-xl ml-8 mt-6">
          Edit Profile
        </div>
        <div className="bg-white h-[95%] rounded-tr-[50px] rounded-tl-[50px] mt-[5%]">
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
            <input type="hidden" value={email} />
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
            <input
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              placeholder="Enter your Gender"
              type="text"
              className="w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] border-black"
            />
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Phone Number:</div>
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your Phone number"
              type="text"
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
              <div className="ml-[10%] mt-4">Store Location:</div>
            </div>
            <div className="relative w-[80%] mt-2">
              <MdLocationOn
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-[#004AAD]"
                size={24}
              />
              <select
                value={user_location}
                onChange={(e) => setUserLocation(e.target.value)}
                className="pl-10 opacity-40 border-2 rounded-lg h-[45px] border-black peer focus:border-[#004AAD] focus:ring-0 w-full"
              >
                <option value="" disabled>
                  Select your store location
                </option>
                {Array.isArray(locations) &&
                  locations.map((location) => (
                      <option key={location.uni_id} value={location.uni_name}>
                        {location.uni_name}
                      </option>
                    ))}
              </select>
            </div>

            <div
              onClick={handleSave}
              className="bg-[#004AAD] w-[90%] mt-16 text-center font-bold text-lg h-[45px] rounded-lg text-white py-2"
            >
              Save
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
