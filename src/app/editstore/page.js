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
import Loader from "@/components/Loader";

const Page = () => {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [shop_name, setShopName] = useState("");
  const [shop_desc, setDescription] = useState("");
  const [shop_whatsapp_link, setChatLink] = useState("");
  const [service_offered, setServicesOffered] = useState("");
  const [loading, setLoading] = useState(false);
  const [shop_location, setStoreLocation] = useState("");
  const [shop_image_url, setImageUrl] = useState("");
  const [locations, setLocations] = useState([]);
  const [validationErrors, setValidationErrors] = useState({
    shop_name: false,
    shop_desc: false,
    shop_whatsapp_link: false,
    shop_location: false,
    shop_image: false
  });
  let requestID = "rid_1983";

  // Validate if all required fields are filled
  const isFormValid = () => {
    return (
      shop_name.trim() !== "" &&
      shop_whatsapp_link.trim() !== "" &&
      shop_desc.trim() !== "" &&
      shop_location.trim() !== "" &&
      (imagePreview !== null)
    );
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("shopDetails"));
  
    if (userData) {
      console.log(userData);
      setShopName(userData.shop_name || "");
      setChatLink(userData.shop_whatsapp_link || "");
      setDescription(userData.shop_desc);
      setStoreLocation(userData.shop_location || "");
      setServicesOffered(userData.service_offered || "NULL");
      // Set email from localStorage
      setImageUrl(userData.shop_image_url || "");
      setImagePreview(userData.shop_image_url || "");
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
        setValidationErrors(prev => ({...prev, shop_image: false}));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      shop_name: !shop_name.trim(),
      shop_desc: !shop_desc.trim(),
      shop_whatsapp_link: !shop_whatsapp_link.trim(),
      shop_location: !shop_location.trim(),
      shop_image: !imagePreview
    };

    setValidationErrors(errors);

    // Return true if no errors, false otherwise
    return !Object.values(errors).some(error => error);
  };

  const triggerFileInput = () => {
    document.getElementById("file-input").click();
  };

  const handleSave = async () => {
    // Validate form before submission
    if (!validateForm()) {
      alert("Please fill in all required fields and upload a shop image.");
      return;
    }

    setLoading(true); // Start the loader

    try {
      const token = localStorage.getItem("token");
      let uploadedImageUrl = shop_image_url; // Use existing image URL by default

      if (imageFile) {
        try {
          // Log the image file being uploaded to Sanity
          console.log("Uploading to Sanity:", { imageFile });

          // Upload to Sanity first
          const imageAsset = await client.assets.upload("image", imageFile);
          uploadedImageUrl = imageAsset.url;

          // Log the data being sent to the backend after Sanity upload
          console.log("Sending data to backend (editUser):", {
            shop_image_url: uploadedImageUrl,
            shop_name,
            shop_desc,
            shop_location,
            shop_whatsapp_link,
            service_offered,
            requestID,
          });

          // Send the data to the backend
          const response = await axios.post(
            "https://api.vplaza.com.ng/shops/editShop",
            {
              shop_image_url: uploadedImageUrl,
              shop_name,
              shop_desc,
              shop_location,
              shop_whatsapp_link,
              service_offered,
              requestID,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.status === true) {
            console.log(response);
            localStorage.setItem(
              "userData",
              JSON.stringify(response.data.userData)
            );
            localStorage.setItem(
              "shopDetails",
              JSON.stringify(response.data.shopDetails)
            );
            alert("Shop updated successfully");
            router.push("/store/product");
          } else {
            console.log(response);
            alert("Failed to update Shop");
          }
        } catch (sanityError) {
          console.error("Sanity upload failed:", sanityError);

          // Log the data being sent to the backend when uploading the image directly
          const formData = new FormData();
          formData.append("shop_image_url", imageFile);
          formData.append("shop_name", shop_name);
          formData.append("service_offered", service_offered);
          formData.append("shop_desc", shop_desc);
          formData.append("shop_whatsapp_link", shop_whatsapp_link);
          formData.append("requestID", requestID);
          formData.append("shop_location", shop_location);

          console.log("Sending data to backend (editUser2):", formData);

          const response = await axios.post(
            "https://api.vplaza.com.ng/shops/editShop",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            uploadedImageUrl = response.data.imageUrl;
            console.log(response);
            localStorage.setItem(
              "userData",
              JSON.stringify(response.data.userData)
            );
            localStorage.setItem(
              "shopDetails",
              JSON.stringify(response.data.shopDetails)
            );
            alert("Shop updated successfully");
            router.push("/");
            return;
          } else {
            console.log(response);
            alert("Failed to update Shop");
          }
        }
      } else {
        // Log the data being sent to the backend if no new image is selected
        console.log("Sending data to backend (editUser) with existing image:", {
          shop_image_url: uploadedImageUrl,
          shop_name,
          shop_desc,
          shop_location,
          shop_whatsapp_link,
          service_offered,
          requestID,
        });

        // If no new image is selected, send the existing imageUrl to the backend
        const response = await axios.post(
          "https://api.vplaza.com.ng/shops/editShop",
          {
            shop_image_url: uploadedImageUrl,
            shop_name,
            shop_desc,
            shop_location,
            shop_whatsapp_link,
            service_offered,
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
          localStorage.setItem(
            "userData",
            JSON.stringify(response.data.userData)
          );
          localStorage.setItem(
            "shopDetails",
            JSON.stringify(response.data.shopDetails)
          );
          alert("Shop updated successfully");
          router.push("/");
        } else if(response.message === "signature verification failed") {
          router.push("/signin");
        }
        else {
          console.log(response);
          alert("Failed to update Shop");
        } 
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update Shop");
    } finally {
      setLoading(false); // Stop the loader
    }
  };

  return (
    <div className="w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <Loader /> {/* Show Loader */}
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
          Edit Store
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
            <div 
              className="mt-3 flex flex-col items-center" 
              onClick={triggerFileInput}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Selected"
                  className={`w-32 h-32 object-cover mb-4 rounded-full ${validationErrors.shop_image ? 'border-2 border-red-500' : ''}`}
                />
              ) : (
                <div className={`w-32 h-32 relative mb-4 ${validationErrors.shop_image ? 'border-2 border-red-500' : ''}`}>
                  <Image
                    src={Edit}
                    alt="Upload"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              )}
              {validationErrors.shop_image && (
                <span className="text-red-500 text-sm">Shop image is required</span>
              )}
            </div>
           
            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Store Name:</div>
            </div>
            <input
              value={shop_name}
              onChange={(e) => {
                setShopName(e.target.value);
                setValidationErrors(prev => ({...prev, shop_name: false}));
              }}
              placeholder="Enter your Shop Name"
              type="text"
              className={`w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] ${validationErrors.shop_name ? 'border-red-500' : 'border-black'}`}
            />
            {validationErrors.shop_name && (
              <span className="text-red-500 text-sm w-[80%] text-left">Store name is required</span>
            )}
           
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
                value={shop_whatsapp_link}
                onChange={(e) => {
                  setChatLink(e.target.value);
                  setValidationErrors(prev => ({...prev, shop_whatsapp_link: false}));
                }}
                placeholder="Enter your link"
                type="text"
                className={`pl-10 opacity-40 border-2 rounded-lg h-[45px] peer focus:border-[#004AAD] focus:ring-0 w-full ${validationErrors.shop_whatsapp_link ? 'border-red-500' : 'border-black'}`}
              />
            </div>
            {validationErrors.shop_whatsapp_link && (
              <span className="text-red-500 text-sm w-[80%] text-left">WhatsApp or Chat link is required</span>
            )}

            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Shop Description:</div>
            </div>
            <input
              value={shop_desc}
              onChange={(e) => {
                setDescription(e.target.value);
                setValidationErrors(prev => ({...prev, shop_desc: false}));
              }}
              placeholder="Enter your shop description"
              type="text"
              className={`w-[80%] opacity-40 border-2 rounded-lg pl-3 h-[45px] ${validationErrors.shop_desc ? 'border-red-500' : 'border-black'}`}
            />
            {validationErrors.shop_desc && (
              <span className="text-red-500 text-sm w-[80%] text-left">Shop description is required</span>
            )}

            <div className="w-[100%]">
              <div className="ml-[10%] mt-4">Service offered (optional):</div>
            </div>
            <input
              value={service_offered}
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
                value={shop_location}
                onChange={(e) => {
                  setStoreLocation(e.target.value);
                  setValidationErrors(prev => ({...prev, shop_location: false}));
                }}
                className={`pl-10 opacity-40 border-2 rounded-lg h-[45px] peer focus:border-[#004AAD] focus:ring-0 w-full ${validationErrors.shop_location ? 'border-red-500' : 'border-black'}`}
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
            {validationErrors.shop_location && (
              <span className="text-red-500 text-sm w-[80%] text-left">Store location is required</span>
            )}

<button
              onClick={handleSave}
              disabled={!isFormValid()}
              className={`
                ${isFormValid() 
                  ? 'bg-[#004AAD] cursor-pointer hover:bg-blue-700' 
                  : 'bg-gray-400 cursor-not-allowed'}
                text-white mt-5 py-2 px-4 rounded-lg
              `}
            >
              Save Store
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
