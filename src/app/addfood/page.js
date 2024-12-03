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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [product_name, setProductName] = useState("");
  const [amount, setPrice] = useState("");
  const [product_desc, setDescription] = useState("");
  const [product_cat, setCategory] = useState("");
  const fileInputRef = useRef(null);
  const requestID = "rid_1983";

  // Fix localStorage access in Next.js
  const userData =
    typeof window !== "undefined" && localStorage.getItem("userData")
      ? JSON.parse(localStorage.getItem("userData"))
      : null;

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
    setImageFiles((prev) => [...prev, ...files]);
  };

  const handleAddImageClick = () => {
    fileInputRef.current.click();
  };

  const uploadImageToSanity = async (file) => {
    const response = await client.assets.upload("image", file, {
      filename: file.name,
    });
    return response.url;
  };

  const handleSave = async () => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      // Upload images to Sanity
      const imageUrls = await Promise.all(
        imageFiles.map((file) => uploadImageToSanity(file))
      );

      const data = {
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

      await axios.post(
        "https://api.vplaza.com.ng/products/createFoodProduct",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Food added successfully");
      router.push("/");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to add food");
    }
  };

  return (
    <div className="p-4">
      <IoArrowBack onClick={() => router.back()} size={30} />
      <h1>Add Food</h1>

      <div onClick={handleAddImageClick} className="image-upload">
        <AiOutlinePlus size={40} />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ display: "none" }}
        />
      </div>

      <div>
        {imagePreviews.map((preview, index) => (
          <img key={index} src={preview} alt="Preview" width={100} />
        ))}
      </div>

      <input
        type="text"
        placeholder="Product name"
        value={product_name}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Price"
        value={amount}
        onChange={(e) => setPrice(e.target.value)}
      />
      <textarea
        placeholder="Description"
        value={product_desc}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>
      <select
        value={product_cat}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="furniture">Furniture</option>
        <option value="food">Food</option>
        <option value="electronics">Electronics</option>
      </select>

      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default Page;
