"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import client from "../sanity/sanityClient";
import "../../../dev/styles.css";
import Loader from "@/components/Loader";

const Page = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product_name, setProductName] = useState("");
  const [amount, setPrice] = useState("");
  const [product_desc, setDescription] = useState("");
  const [product_cat, setCategory] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const fileInputRef = useRef(null);
  const requestID = "rid_1983"; // Example request ID, replace with dynamic ID if needed.

  const isFormValid = () => {
    return (
      product_name.trim() !== "" &&
      amount.trim() !== "" &&
      product_desc.trim() !== "" &&
      product_cat.trim() !== "" &&
      imagePreviews.length > 1
    );
  };

  // Access localStorage client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("userData");
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    }
  }, []);

  if (!userData) {
    return <div><Loader /> {/* Show Loader */}</div>;
  }

  // Handle image file changes
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + imageFiles.length > 5) {
      alert("You can only upload up to 5 images.");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size <= 2 * 1024 * 1024) {
        return true;
      } else {
        alert(`${file.name} exceeds 2MB and won't be uploaded.`);
        return false;
      }
    });

    const previews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove selected image
  const handleRemoveImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Trigger file input for image upload
  const handleAddImageClick = () => {
    if (imageFiles.length < 5) {
      fileInputRef.current.click();
    } else {
      alert("You have already uploaded 5 images.");
    }
  };

  // Upload images to Sanity.io
  const uploadImageToSanity = async (file) => {
    try {
      console.log("Uploading file to Sanity:", file.name); // Log the file name being uploaded
      const response = await client.assets.upload("image", file, {
        filename: file.name,
      });
      console.log("Response from Sanity for file:", file.name, response); // Log the response from Sanity
      return response.url;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  // Save product information
  const handleSave = async () => {
    if (imageFiles.length < 1) {
      alert("Please upload at least one image.");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadImageToSanity(file))
      );

      const dataToSend = {
        product_name,
        amount,
        product_desc,
        product_cat,
        requestID,
        ...imageUrls.reduce((acc, url, index) => {
          acc[`product_img${index + 1}`] = url;
          return acc;
        }, {}),
      };

      console.log("Sending data to backend (addProduct):",dataToSend)

      const response = await axios.post(
        "https://api.vplaza.com.ng/products/createProduct",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        console.log(response);
        alert("Product added successfully!");
        router.push("/store/product");
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert("An error occurred while saving the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col p-4 overflow-y-auto">
      <div className="w-full max-w-lg mx-auto flex-grow bg-white rounded-2xl shadow-2xl p-6">
        {loading && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="spinner animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        )}

        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="mr-4 hover:bg-blue-100 p-2 rounded-full transition"
          >
            <IoArrowBack className="text-blue-600" size={24} />
          </button>
          <h1 className="text-2xl font-bold text-blue-800">Add Product</h1>
        </div>

        <div
          className="relative h-56 w-full rounded-xl overflow-hidden group cursor-pointer mb-4"
          onClick={handleAddImageClick}
        >
          {imagePreviews.length > 0 ? (
            <img
              src={imagePreviews[0]}
              alt="Product Main"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <AiOutlinePlus className="text-blue-500" size={48} />
              <span className="ml-2 text-blue-600">Add Product Image</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mb-4">
          {imagePreviews.slice(1).map((preview, index) => (
            <div key={index} className="relative w-20 h-20 group">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-md"
              />
              <button
                onClick={() => handleRemoveImage(index + 1)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
          {imageFiles.length < 5 && (
            <button
              onClick={handleAddImageClick}
              className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 rounded-md hover:bg-blue-200 transition"
            >
              <AiOutlinePlus size={24} />
            </button>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
        />

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            value={product_name}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          <select
            value={product_cat}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          >
            <option value="">Select Category</option>
            <option value="furniture">Furniture</option>
            <option value="accessories">Accessories</option>
            <option value="phones">Phones</option>
            <option value="electronics">Electronics</option>
            <option value="tops">Tops</option>
            <option value="pants">Pants</option>
            <option value="women">Women</option>
            <option value="services">Services</option>
          </select>

          <input
            type="tel"
            placeholder="Price"
            value={amount}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />

          <textarea
            placeholder="Product Description"
            value={product_desc}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-blue-200 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
          />
        </div>
        {/* Add the message below */}
        <div className="text-center text-sm text-blue-600 mt-4">
          Ensure to add more than 1 image
        </div>


        <div className="flex justify-center">
          <button
            onClick={handleSave}
            disabled={loading || !isFormValid()}
            className={`
            ${isFormValid() 
              ? 'bg-[#004AAD] cursor-pointer hover:bg-blue-700' 
              : 'bg-gray-400 cursor-not-allowed'}
                text-white mt-5 py-2 px-4 rounded-lg
            `}
         >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
