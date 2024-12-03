"use client";

import { Tag } from "@/assets";
import Header from "@/components/header";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { IoHeart } from "react-icons/io5";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    // Get wishlist data from localStorage, only if running on the client
    if (typeof window !== "undefined") {
      const wishlistData = JSON.parse(localStorage.getItem("wishlistData"));
      if (wishlistData && wishlistData.products) {
        setWishlistItems(wishlistData.products);
      }
    }
  }, []);

  const handleProductClick = (product) => {
    if (!token) {
        router.push("/signin");
    } else {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        router.push(`/product/${product.details.product_id}`);
    }
};

  const removeFromWishlist = async (productId) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const requestID = "rid_1983";

    try {
      const response = await axios.post(
        "https://api.vplaza.com.ng/products/removeFromWishlist",
        {
          requestID,
          product_id: productId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status) {
        // Remove item from local state
        alert(response.data.message);
        console.log(response.data)
        setWishlistItems(prevItems => 
          prevItems.filter(item => item.details.product_id !== productId)
        );
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  return (
    <main className="pt-8 px-2">
      <Header title="Wishlist" />
      {wishlistItems.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          Your wishlist is empty
        </div>
      ) : (
        <section className="flex mt-2 flex-wrap">
          {wishlistItems.map((item, index) => (
            <div key={index} className="w-1/2">
              <div className="p-4 relative">
                <div 
                  className="relative cursor-pointer"
                  onClick={() => handleProductClick(item)}
                >
                  <img
                    src={item.details.product_img1}
                    alt={item.details.product_name}
                    className="w-full h-[150px] object-cover rounded-lg"
                  />
                  <div 
                    className="p-1 bg-main rounded-full absolute right-2 top-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item.details.product_id);
                    }}
                  >
                    <IoHeart size={19} className="fill-white p-0" />
                  </div>
                </div>

                <h1 className="font-bold pt-2 text-xs truncate">
                  {item.product_name}
                </h1>
                <div className="relative">
                  <p className="flex items-center text-xs gap-1">
                    {Math.floor(item.average_r.average) || "0.0"}
                    <span className="inline-block">
                      <FaStar size={10} className="fill-[#FFF500]" />
                    </span>
                    <span className="text-xs bg-[#D9D9D9] px-1 rounded-sm py-[0.1rem]">
                      {item.uni}
                    </span>
                  </p>
                </div>
                <p className="font-semibold font-sans text-xl">
                  ₦{parseInt(item.details.amount).toLocaleString()}
                </p>
                {/* <Image
                  className="absolute bottom-6 right-6"
                  src={Tag}
                  alt="tag"
                /> */}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
};

export default Page;
