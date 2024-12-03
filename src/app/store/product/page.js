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
import { FaPencilAlt, FaStar, FaArrowLeft } from "react-icons/fa";
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
    <main className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center mb-4">
          <Button
            variant="plain"
            onClick={() => router.push("/")}
            className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="font-bold font-sans text-2xl flex-grow text-center">
            Your Store
          </h1>
        </div>

      {/* Store Information Section */}
      <section className="pt-8 pb-4 px-4 bg-white border-b-main border-b-4 mb-4">
        <div className="my-4 gap-4 items-center flex">
          {shopImageUrl && (
            <img
              alt="store owner"
              src={shopImageUrl}
              className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
            />
          )}
          <div>
            <h2 className="text-xl font-sans font-bold text-gray-800">
              {shopName}
            </h2>
            <p className="text-xs text-gray-600 mt-1">{shopDesc}</p>
            <div className="mt-3 flex gap-2 flex-wrap">
              <Button
                onClick={() => router.push("/editstore")}
                className="flex gap-1 px-3 py-2 text-sm items-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <FaPencilAlt size={12} /> Edit
              </Button>
              <Button
                onClick={() => router.push("/store/food")}
                className="flex gap-1 px-3 py-2 text-sm items-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                Switch to food
              </Button>
              <Button className="flex gap-1 px-3 py-2 text-sm items-center bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors">
                <AiFillSetting size={12} /> Offer a service
              </Button>
            </div>
          </div>
        </div>
        <div className="flex mt-6 justify-between items-center">
          <Button
            variant="plain"
            onClick={handleCopyStoreLink}
            className="flex gap-1 px-2 py-1 text-xs items-center text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiCopy size={16} /> Copy Store Link
          </Button>
          <Button
            variant="plain"
            onClick={() => router.push("/addProduct")}
            className="flex gap-1 px-3 py-2 text-sm items-center bg-main text-white hover:bg-opacity-90 transition-colors"
          >
            <IoAddCircleOutline size={16} /> Add New Product
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-4 py-4 bg-white">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No products available</p>
            <p className="text-sm">Add your first product to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.details.product_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div
                  className="relative cursor-pointer group"
                  onClick={() => handleProductClick(item)}
                >
                  <div className="relative">
                    <img
                      src={item.details.product_img1 || Product}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.details.product_name}
                    />
                    <IoTrashBin
                      size={24}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.details.product_id);
                      }}
                      className="absolute bottom-2 right-2 fill-red-500 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                    />
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar size={14} />
                        <span className="text-sm font-semibold">
                          {Math.floor(item.average_r.average)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-green-600">
                        ₦{parseInt(item.details.amount).toLocaleString()}
                      </p>
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 truncate mb-1">
                      {item.details.product_name}
                    </h3>

                    <p className="text-xs text-gray-500 truncate">
                      {item.shopDetails.shop_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Modal */}
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

      {/* Error Handling */}
      {error && (
        <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
          <p className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md">
            {error}
          </p>
        </div>
      )}
    </main>
  );
};

export default page;
