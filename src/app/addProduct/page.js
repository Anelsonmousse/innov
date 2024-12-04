"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import client from "../sanity/sanityClient";
import "../../../dev/styles.css";

const Page = () => {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState("new");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [product_name, setProductName] = useState("");
  const [amount, setPrice] = useState("");
  const [product_desc, setDescription] = useState("");
  const [product_cat, setCategory] = useState("");
  const fileInputRef = useRef(null);
  let requestID = "rid_1983";
  const userData = JSON.parse(localStorage.getItem("userData"));
  // Handle image upload with file size limit
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      if (file.size <= 2 * 1024 * 1024) {
        // Check if file size is <= 2MB
        return true;
      } else {
        alert(`${file.name} is larger than 2MB and will not be uploaded.`);
        return false;
      }
    });

    const newImagePreviews = validFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setImagePreviews((prev) => [...prev, ...newImagePreviews]);
    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const handleAddImageFromButton = (index) => {
    fileInputRef.current.click();
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

  const handleSavet = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadImageToSanity(file))
      );

      const response = await axios.post(
        "https://api.vplaza.com.ng/products/createProduct",
        {
          imageUrls,
          product_name,
          amount,
          product_desc,
          product_cat,
          //selectedState,
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
        alert("Product added successfully");
        router.push("/store/product");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error uploading to Sanity:", error);

      // If error occurs while uploading to Sanity, send the actual image files to createProduct2 endpoint
      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();
        imageFiles.forEach((file, index) => {
          formData.append(`image${index}`, file);
        });
        formData.append("product_name", productName);
        formData.append("amount", amount);
        formData.append("product_desc", product_desc);
        formData.append("product_cat", product_cat);
        //formData.append("selectedState", selectedState);
        formData.append("requestID", requestID);
        const fallbackResponse = await axios.post(
          "https://api.vplaza.com.ng/products/createProduct2",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (fallbackResponse.status === 200) {
          alert("Product added successfully using fallback endpoint");
          router.push("/store/product");
        } else {
          alert("Failed to add product using fallback endpoint");
        }
      } catch (fallbackError) {
        console.error("Error with fallback upload:", fallbackError);
        alert("Failed to add product");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadImageToSanity(file))
      );

      // Prepare data for the backend
      const dataToSend = {
        product_name,
        amount,
        product_desc,
        product_cat,
        //selectedState,
        requestID,
        // Dynamically setting product_img fields based on the number of images
        ...imageUrls.reduce((acc, url, index) => {
          acc[`product_img${index + 1}`] = url;
          return acc;
        }, {}),
      };

      // Console log the data being sent
      console.log("Data being sent to the backend:", dataToSend);

      const response = await axios.post(
        "https://api.vplaza.com.ng/products/createProduct",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response);
        alert("Product added successfully");
        router.push("/store/product");
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      console.error("Error uploading to Sanity:", error);

      try {
        const token = localStorage.getItem("token");
        const formData = new FormData();

        // Add image files dynamically to formData
        imageFiles.forEach((file, index) => {
          formData.append(`product_img${index + 1}`, file);
        });
        formData.append("product_name", product_name);
        formData.append("amount", amount);
        formData.append("product_desc", product_desc);
        formData.append("product_cat", product_cat);
        // formData.append("selectedState", selectedState);
        formData.append("requestID", requestID);

        // Console log the formData being sent
        console.log("FormData being sent to the fallback endpoint:", formData);

        const fallbackResponse = await axios.post(
          "https://api.vplaza.com.ng/products/createProduct2",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (fallbackResponse.status === 200) {
          alert("Product added successfully using fallback endpoint");
          router.push("/store/product");
        } else {
          alert("Failed to add product using fallback endpoint");
        }
      } catch (fallbackError) {
        console.error("Error with fallback upload:", fallbackError);
        alert("Failed to add product");
      }
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
            <div className="relative w-full h-full">
              <img
                src={imagePreviews[0]}
                alt="Product Main"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage(0);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition z-10"
              >
                <FaTrash size={16} />
              </button>
            </div>
          ) : (
            <div className="w-full h-full bg-blue-100 flex items-center justify-center">
              <AiOutlinePlus className="text-blue-500" size={48} />
              <span className="ml-2 text-blue-600">Add Product Image</span>
            </div>
          )}
        </div>

        <div className="flex space-x-2 mb-4">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="relative w-20 h-20 group">
              {imagePreviews[index + 1] ? (
                <>
                  <img
                    src={imagePreviews[index + 1]}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    onClick={() => handleRemoveImage(index + 1)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FaTrash size={12} />
                  </button>
                </>
              ) : (
                <button
                  onClick={handleAddImageClick}
                  className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500 rounded-md hover:bg-blue-200 transition"
                >
                  <AiOutlinePlus size={24} />
                </button>
              )}
            </div>
          ))}
          <span className="self-end text-sm text-gray-500 ml-2">
            Max 5 pics
          </span>
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
            type="text"
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
          ></textarea>

          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
