"use client";
import React, { useState, useEffect } from "react";
import { IoArrowBack, IoStorefrontOutline } from "react-icons/io5";
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
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [servicesOffered, setServicesOffered] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  let requestID = "rid_1983";

  useEffect(() => {
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
    try {
      const imageUrl = await uploadImageToSanity(imageFile);
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://api.vplaza.com.ng/users/editUser",
        {
          imageUrl,
          storeName,
          description,
          chatLink,
          servicesOffered,
          storeLocation,
          requestID,
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully");
        router.push("/");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update profile");
    }
  };

  const uploadImageToSanity = async (file) => {
    try {
      const uploadResponse = await client.assets.upload("image", file, {
        filename: file.name,
      });
      return uploadResponse.url;
    } catch (error) {
      throw new Error("Failed to upload image to Sanity.io");
    }
  };

  const triggerFileInput = () => {
    document.getElementById("file-input").click();
  };

  return (
    <div className="w-full h-full">
      <div className="bg-[#004AAD] pt-4 w-full h-[15%]">
        <IoArrowBack
          onClick={() => router.back()}
          color="white"
          className="mt-4 ml-3"
          size={30}
        />
        <div className="text-white font-bold text-xl ml-8 mt-6">Edit Food Store</div>
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

            {/* Store Name Input */}
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Food Store Name:</div>
            </div>
            <div className="relative w-[80%] mt-2">
              <IoStorefrontOutline
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-[#004AAD]"
                size={24}
              />
              <input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter your store name"
                type="text"
                className="pl-10 opacity-40 border-2 rounded-lg h-[45px] border-black peer focus:border-[#004AAD] focus:ring-0 w-full"
              />
            </div>

            {/* Chat Link Input */}
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">WhatsApp or Chat Link:</div>
            </div>
            <div className="relative w-[80%] mt-2">
              <MdPhone
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-[#004AAD]"
                size={24}
              />
              <input
                value={chatLink}
                onChange={(e) => setChatLink(e.target.value)}
                placeholder="Enter your link"
                type="text"
                className="pl-10 opacity-40 border-2 rounded-lg h-[45px] border-black peer focus:border-[#004AAD] focus:ring-0 w-full"
              />
            </div>

            {/* Store Description Input */}
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Store Description:</div>
            </div>
            <div className="relative w-[80%] mt-2">
              <MdDescription
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 peer-focus:text-[#004AAD]"
                size={24}
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Store description"
                type="text"
                className="pl-10 opacity-40 border-2 rounded-lg h-[45px] border-black peer focus:border-[#004AAD] focus:ring-0 w-full"
              />
            </div>

           
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
                value={storeLocation}
                onChange={(e) => setStoreLocation(e.target.value)}
                className="pl-10 opacity-40 border-2 rounded-lg h-[45px] border-black peer focus:border-[#004AAD] focus:ring-0 w-full"
              >
                
                <option value="" disabled>
                  Select your store location
                  
                </option>
                {Array.isArray(locations) &&
                  locations
                    .filter((location) =>
                      location.uni_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((location) => (
                      <option key={location.uni_id} value={location.uni_id}>
                        {location.uni_name}
                      </option>
                  ))}
              </select>
            </div>

            <button
              onClick={handleSave}
              type="submit"
              className="mt-6 mb-10 bg-[#004AAD] h-[45px] w-[80%] rounded-[50px] text-white font-semibold"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
