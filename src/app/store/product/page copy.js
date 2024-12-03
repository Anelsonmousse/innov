"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { BB, Product, Tag } from "@/assets";
import Button from "@/components/button";
import Delete from "@/components/delete";
import Image from "next/image";

import { FaRegStar } from "react-icons/fa";
import { AiFillSetting } from "react-icons/ai";
import { FaPencilAlt, FaStar } from "react-icons/fa";
import { FiCopy } from "react-icons/fi";
import { IoAddCircleOutline, IoTrashBin } from "react-icons/io5";

const page = () => {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const [shopImageUrl, setShopImageUrl] = useState("");
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const shopData = JSON.parse(localStorage.getItem("shopDetails"));
    if (shopData) {
      setShopName(shopData.shop_name);
      setShopDesc(shopData.shop_desc);
      setShopImageUrl(shopData.shop_image_url);
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("token");
      const requestID = "rid_1983";

      let endpoint = "https://api.vplaza.com.ng/products/getProductByShop";
      let requestData = {
        requestID,
      };

      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        : {};

      try {
        const response = await axios.post(endpoint, requestData, config);

        if (
          response.data.status === false &&
          response.data.message === "Failed to get product from this uni"
        ) {
          setError(
            "No products are available from this university. Please check back later or select a different location."
          );
        } else {
          console.log(response.data.data);
          const fetchedItems = shuffleArray(response.data.data);
          setItems(token ? fetchedItems.slice(0, 25) : fetchedItems);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          "Please try again later, we're having trouble fetching the list of products."
        );
      }
    };

    fetchItems();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleProductClick = (product) => {
    localStorage.setItem("viewProduct", JSON.stringify(product));
    router.push(`/storeproductview/${product.details.product_id}`);
  };

  const handleDelete = (productId) => {
    setSelectedProductId(productId);
    setDeleteModal(true);
  };

  const handleCopyStoreLink = () => {
    const storeLink = `https://yourstore.com/${shopName}`;
    navigator.clipboard
      .writeText(storeLink)
      .then(() => alert("Store link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  return (
    <main>
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <Button
          variant="plain"
          onClick={() => router.back()}
          className="flex gap-1 px-2 py-1 text-xs items-center"
        >
          <IoArrowBack size={16} /> Back
        </Button>
        <h1 className="font-bold font-sans text-2xl">Your Store</h1>
        <div className="w-20"></div> {/* Spacer for visual balance */}
      </div>
      <section className="pt-8 pb-4 px-4 flex flex-col border-b-main border-b-4">
        <div className="my-4 gap-2 items-center flex">
          {shopImageUrl && (
            <img
              alt="store owner"
              src={shopImageUrl}
              className="w-36 h-36 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-xl font-sans font-bold">{shopName}</h2>
            <p className="text-xs">{shopDesc}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              <Button
                onClick={() => router.push("/editstore")}
                className="flex gap-1 px-2 py-1 text-sm items-center"
              >
                <FaPencilAlt size={12} /> Edit
              </Button>
              <Button
                onClick={() => router.push("/store/food")}
                className="flex gap-1 px-2 py-1 text-sm items-center"
              >
                Switch to food
              </Button>
              <Button className="flex gap-1 px-2 py-1 text-sm items-center">
                <AiFillSetting size={12} /> Offer a service
              </Button>
            </div>
          </div>
        </div>
        <div className="flex mt-8 justify-between items-center">
          <Button
            variant="plain"
            onClick={handleCopyStoreLink}
            className="flex gap-1 px-2 py-1 text-xs items-center"
          >
            <FiCopy size={16} /> Copy Store Link
          </Button>
          <Button
            variant="plain"
            onClick={() => router.push("/addProduct")}
            className="flex gap-1 px-2 py-1 text-xs items-center"
          >
            <IoAddCircleOutline size={16} /> Add New Product
          </Button>
        </div>
      </section>
      <section className="flex mt-2 flex-wrap">
        {items.map((item) => (
          <div key={item.details.product_id} className="w-4/12">
            <div className="p-2 relative">
              <div
                className="relative"
                onClick={() => handleProductClick(item)}
              >
                <img
                  src={item.details.product_img1 || Product}
                  className="w-full rounded-lg cursor-pointer"
                  alt={item.details.product_name}
                />
                <IoTrashBin
                  size={24}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.details.product_id);
                  }}
                  className="absolute bottom-0 fill-main right-0 bg-white p-1 cursor-pointer"
                />
              </div>
              <div className="w-full">
                <div className="mt-2 text-[10px] font-bold">
                  {item.details.product_name}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm w-full">
                <span>{Math.floor(item.average_r.average)}</span>
                <FaStar size={10} className="fill-[#FFF500]" />
              </div>
              <p className="font-semibold font-sans text-sm">
                ₦{parseInt(item.details.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </section>
      {deleteModal && (
        <Delete
          productId={selectedProductId}
          productName={
            items.find((item) => item.details.product_id === selectedProductId)
              ?.details.product_name || "Product"
          }
          productImage={
            items.find((item) => item.details.product_id === selectedProductId)
              ?.details.product_img1 || Product
          }
          amount={
            items.find((item) => item.details.product_id === selectedProductId)
              ?.details.amount || 0
          }
          onClose={() => setDeleteModal(false)}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </main>
  );
};

export default page;
