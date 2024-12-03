"use client"
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoAddOutline } from "react-icons/io5";
import { FaTrash } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import client from "../sanity/sanityClient";

const page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [product_name, setProductName] = useState("");
  const [amount, setPrice] = useState("");
  const [product_desc, setDescription] = useState("");
  const [product_cat, setCategory] = useState("");
  const [product_id, setProductId] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileInputRef = useRef(null);
  const requestID = "rid_1983";

  useEffect(() => {
    const storedProduct = localStorage.getItem("editProduct");
    if (storedProduct) {
      const productData = JSON.parse(storedProduct);
      const { details } = productData;

      setProductName(details.product_name);
      setPrice(details.amount);
      setDescription(details.description);
      setCategory(details.product_cat);
      setProductId(details.product_id);

      const images = [
        details.product_img1,
        details.product_img2,
        details.product_img3,
        details.product_img4,
        details.product_img5,
      ].filter((img) => img && img !== "0");

      setExistingImages(images);
      setImagePreviews(images);
    }
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) => {
      if (file.size <= 2 * 1024 * 1024) {
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

  const handleRemoveImage = (index) => {
    // Determine if it's an existing image or a newly added image
    const isExistingImage = index < existingImages.length;
    
    if (isExistingImage) {
      // If it's an existing image, remove from existing images and previews
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
      setImagePreviews((prev) => 
        prev.filter((_, i) => i !== index)
      );
    } else {
      // If it's a newly added image, adjust the index for imageFiles and imagePreviews
      const adjustedIndex = index - existingImages.length;
      
      // Remove from image files and previews
      setImageFiles((prev) => prev.filter((_, i) => i !== adjustedIndex));
      setImagePreviews((prev) => 
        prev.filter((_, i) => i !== index)
      );
    }
  };

  const handleAddImageClick = () => {
    if (imagePreviews.length < 5) {
      fileInputRef.current.click();
    } else {
      alert("Maximum 5 images allowed");
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

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const newImageUrls = await Promise.all(
        imageFiles.map((file) => uploadImageToSanity(file))
      );

      const allImages = [...existingImages, ...newImageUrls];

      const dataToSend = {
        product_id,
        product_name,
        amount,
        product_desc,
        product_cat,
        requestID,
        ...allImages.reduce((acc, url, index) => {
          acc[`product_img${index + 1}`] = url;
          return acc;
        }, {}),
      };

      const response = await axios.post(
        "https://api.vplaza.com.ng/products/editProduct",
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Product updated successfully");
        router.push(`/store/product`);
      } else {
        alert("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product");
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
          <h1 className="text-2xl font-bold text-blue-800">Edit Product</h1>
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
          <span className="self-end text-sm text-gray-500 ml-2">Max 5 pics</span>
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
            onClick={handleUpdate}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            Update Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;