"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { AD, BB, Product, Tag } from "@/assets";
import Button from "@/components/button";
import Delete from "@/components/delete";
import Image from "next/image";
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

  useEffect(() => {
    const shopData = JSON.parse(localStorage.getItem("shopDetails"));
    if (shopData) {
      setShopName(shopData.shop_name || "Steralizer");
      setShopDesc(
        shopData.shop_desc || "Bursting your head with delicious meal"
      );
      setShopImageUrl(shopData.shop_image_url || BB);
    }
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const token = localStorage.getItem("token");
      const requestID = "rid_1984";

      let endpoint = "https://api.vplaza.com.ng/products/getFoodByShop";
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
          response.data.message === "Failed to get food from this uni"
        ) {
          setError(
            "No food items are available from this university. Please check back later or select a different location."
          );
        } else {
          const fetchedItems = response.data.data;
          setItems(token ? fetchedItems.slice(0, 25) : fetchedItems);
        }
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError(
          "Please try again later, we're having trouble fetching the list of food items."
        );
      }
    };

    fetchItems();
  }, []);

  const handleFoodClick = (food) => {
    localStorage.setItem("viewFood", JSON.stringify(food));
    router.push(`/storeproductview/${food.details.food_id}`);
  };

  const handleDelete = (foodId) => {
    setSelectedProductId(foodId);
    setDeleteModal(true);
  };

  const handleCopyStoreLink = () => {
    const storeLink = `https://yourstore.com/food/${shopName}`;
    navigator.clipboard
      .writeText(storeLink)
      .then(() => alert("Food store link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <section className="pt-8 pb-4 px-4 bg-white border-b-main border-b-4 mb-4">
        <div className="flex items-center mb-4">
          <Button
            variant="plain"
            onClick={() => router.back()}
            className="mr-4 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FaArrowLeft size={20} />
          </Button>
          <h1 className="font-bold font-sans text-2xl flex-grow text-center">
            Your Food Store
          </h1>
        </div>

        <div className="my-4 gap-4 items-center flex">
          <img
            alt="store owner"
            src={shopImageUrl}
            className="w-36 h-36 rounded-full object-cover border-4 border-gray-200"
          />
          <div>
            <h2 className="text-xl font-sans font-bold text-gray-800">
              {shopName}
            </h2>
            <p className="text-xs text-gray-600 mt-1">{shopDesc}</p>

            <div className="mt-3 flex gap-2 flex-wrap">
              <Button
                onClick={() => router.push("/editfstore")}
                className="flex gap-1 px-3 py-2 text-sm items-center bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <FaPencilAlt size={12} /> Edit
              </Button>
              <Button
                onClick={() => router.push("/store/product")}
                className="flex gap-1 px-3 py-2 text-sm items-center bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                Switch to product
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
            onClick={() => router.push("/addFood")}
            className="flex gap-1 px-3 py-2 text-sm items-center bg-main text-white hover:bg-opacity-90 transition-colors"
          >
            <IoAddCircleOutline size={16} /> Add New Food
          </Button>
        </div>
      </section>

      {/* Food Items Section */}
      <section className="px-4 py-4 bg-white">
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No food items available</p>
            <p className="text-sm">Add your first food to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item) => (
              <div
                key={item.details.food_id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div
                  className="relative cursor-pointer group"
                  onClick={() => handleFoodClick(item)}
                >
                  <div className="relative">
                    <img
                      src={item.details.food_img1 || AD}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      alt={item.details.food_name}
                    />
                    <IoTrashBin
                      size={24}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.details.food_id);
                      }}
                      className="absolute bottom-2 right-2 fill-red-500 bg-white rounded-full p-1 shadow-md hover:bg-red-50 transition-colors"
                    />
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-1 text-yellow-500">
                        <FaStar size={14} />
                        <span className="text-sm font-semibold">
                          {Math.floor(item.average_r?.average || 4.3)}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-green-600">
                        ₦{parseInt(item.details.amount).toLocaleString()}
                      </p>
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 truncate mb-1">
                      {item.details.food_name}
                    </h3>

                    <p className="text-xs text-gray-500 truncate">
                      {item.shopDetails?.shop_name || "Steralizer"}
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
            items.find((item) => item.details.food_id === selectedProductId)
              ?.details.food_name || "Food Item"
          }
          productImage={
            items.find((item) => item.details.food_id === selectedProductId)
              ?.details.food_img1 || AD
          }
          amount={
            items.find((item) => item.details.food_id === selectedProductId)
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
