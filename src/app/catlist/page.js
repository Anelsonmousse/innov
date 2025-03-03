"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  FA,
  GA,
  SKINCARE,
  FUNNY,
ELECTRONICS,
BAGS,
FOOTWEAR,
HAIR,
JEAN,
JEWELRIES,
  KITCHEN,
  LINGERIE,
  PERFUME,
  GOWN,
  PHONE,
  SUIT,
  TOP,
  SUPPLEMENT,
} from "../../assets";
import { IoArrowBack } from "react-icons/io5";
import { IoIosHeart } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaFilter } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaStar, FaRegStar, FaSearch } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdStore, MdHomeFilled } from "react-icons/md";
import { IoPersonCircleSharp } from "react-icons/io5";
import axios from "axios";
import Loader from "@/components/Loader";

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // Filtered product list
  const [userDatax, setUserDatax] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  

  useEffect(() => {
    const userDatay = JSON.parse(localStorage.getItem("userData"));
  setUserDatax(userDatay);
    const tken = localStorage.getItem("token");
    setToken(tken);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const renderAuthButton = (path, icon) => {
    const isAuthenticated = Boolean(localStorage.getItem("token")); // Replace with your auth logic
    return (
      <div className="cursor-pointer" onClick={() => router.push(path)}>
        {icon}
      </div>
    );
  };

  useEffect(() => {
    const fetchItems = async () => {
      const tkenn = localStorage.getItem("token");
      const userDataRaw = localStorage.getItem("userData");
      const requestID = "rid_1983"; // Generate request ID
    
      // Parse user data
      const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
    
      let endpoint = "";
      let requestData = {
        requestID,
      };
    
      if (tkenn && userData) {
        // Use 'getProductByUni' endpoint
        endpoint = "https://api.vplaza.com.ng/products/getProductByUniL";
    
        if (userData.user_location) {
          requestData.university = userData.user_location;
        } else {
          router.push("/editprofile"); // Redirect to edit profile page
        }
      } else {
        // Use 'getAllProducts' endpoint
        endpoint = "https://api.vplaza.com.ng/products/getAllProducts";
      }

      const config = tkenn
        ? {
            headers: {
              Authorization: `Bearer ${tkenn}`,
            },
          }
        : {};

      // Log the request configuration before sending the request
      // console.log("Request Config:", {
      //   endpoint,
      //   requestData,
      //   config,
      // });

      try {
        const response = await axios.post(endpoint, requestData, config);

        // Log the response from the API
        // console.log(`Response from endpoint: ${endpoint}`, response);

        // Check if the response contains the message "no product from this university"
        if (response.data.status === false && response.data.message === "Failed to get product from this uni") {
          setError("No products are available from this university. Please check back later or select a different location.");
        } else {
          // console.log(response.data.data);
          const fetchedItems = shuffleArray(response.data.data);
          const visibleItems = tkenn ? fetchedItems.slice(0, 200) : fetchedItems;
          setItems(visibleItems);
          setFilteredItems(visibleItems); // Initialize filtered items
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Please try again later, we're having trouble fetching the list of products.");
      }
    };

    fetchItems();
  }, []);

   // Function to filter items based on search query
   const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = items.filter((item) =>
      item.details.product_name.toLowerCase().includes(query)
    );
    setFilteredItems(filtered);
  };


  const StarRating = ({ rating }) => {
    const totalStars = 5;
    const ratingNumber = parseInt(rating) || 0;
    
    return (
        <div className="flex">
            {[...Array(totalStars)].map((_, index) => (
                <span key={index}>
                    {index < ratingNumber ? (
                        <FaStar size={10} className="fill-[#FFF500]" />
                    ) : (
                        <FaRegStar size={10} className="fill-[#FFF500]" />
                    )}
                </span>
            ))}
        </div>
    );
};

// const CategoryItem = ({ image, label, onClick }) => (
//   <div 
//     onClick={onClick}
//     className="relative w-full h-[110px] overflow-hidden cursor-pointer group"
//   >
//     <div className="">
//       <Image 
//         src={image} 
//         alt={label}
//         width={460}
//         className="transition-transform hover:scale-110"
//       />
//     </div>
//     <div className="text-xs md:text-sm text-center text-white font-medium mt-1">
//       {label}
//     </div>
//   </div>
// );

const CategoryItem2 = ({ image, label, onClick, desc, prod }) => (
  <div 
    onClick={onClick}
    className="relative w-[166px] h-[187px] 
             rounded-xl border-[1px] border-white/50 overflow-hidden"
>
    <Image
      src={image}
      alt="Background"
      layout="fill"
      objectFit="cover"
      quality={100}
    />

    <div className="absolute inset-0 flex flex-col justify-start  text-white p-3">
      <p className="text-[16px] font-semibold pt-2">{label}</p>
      <p className="text-[10px]">{desc}</p>
      <p className="text-[10px] pt-[90px]">{prod}</p>
    </div>
  </div>
);

const ProductList = ({ items }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 200;
  const totalPages = Math.ceil(items.length / productsPerPage);

  const handleProductClick = (item) => {
      if (!token) {
          router.push("/signin");
      }else {
          router.push(`/product/${item.details.product_id}`);
      }
  };

  const getRating = (items) => {
      if (items.reviews && items.reviews.length > 0) {
          return items.reviews[0].rating;
      }
      return "0";
  };

  // Calculate the products to show on current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = items.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePreviousPage = () => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
      setCurrentPage(prev => Math.min(prev + 1, totalPages));
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
      <div className="w-full">
          <div className="grid grid-cols-2 w-full gap-4">
              {Array.isArray(currentProducts) &&
                  currentProducts.map((item, index) => (
                      <div
                          onClick={() => handleProductClick(item)}
                          key={index}
                          className="flex flex-col items-left p-4 rounded cursor-pointer transition-all hover:shadow-lg"
                      >
                          <img
                              src={item.details.product_img1}
                              alt={item.details.product_name}
                              width={200}
                              height={180}
                              className="w-[200px] h-[180px] object-cover rounded-[7px]"
                          />
                          <div className="w-full">
                              <div className="mt-2 text-[12px] font-bold">
                                  {item.details.product_name}
                              </div>
                          </div>
                          <div className="flex flex-col text-sm w-full">
                              <p className="flex items-center text-[10px]">
                                                {item.average_r.average ?? "No rating"} {/* Show average rating if available */}
                                                <span className="inline-block">
                                                  <FaStar size={10} className="fill-[#FFF500]" />
                                                </span>
                                              </p>
                              <div className="font-medium text-xs">{item.shopDetails.shop_name}</div>
                          </div>
                          <div className="font-semibold flex w-full text-lg">
                              <div className="text-md"> ₦{parseInt(item.details.amount).toLocaleString()}</div>
                              <div className="text-sm mt-[8px] ml-3 text-[#004AAD] font-medium">
                                  {item.status}
                              </div>
                          </div>
                      </div>
                  ))}
          </div>

          {/* Pagination Controls */}
          {items.length > productsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-6 mb-8">
                  <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${
                          currentPage === 1
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-[#004AAD] text-white hover:bg-[#003288]'
                      } transition-colors`}
                  >
                      Previous
                  </button>

                  <span className="text-sm font-medium">
                      Page {currentPage} of {totalPages}
                  </span>

                  <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${
                          currentPage === totalPages
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-[#004AAD] text-white hover:bg-[#003288]'
                      } transition-colors`}
                  >
                      Next
                  </button>
              </div>
          )}
      </div>
  );
};


  
const handleCategoryClick = async (category) => {
  setLoading(true); // Activate full-screen loader
  const tkenn = localStorage.getItem("token");
  const requestID = "rid_1983";
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!token) {
    router.push("/signin");
  } else if (!userData || !userData.user_location) {
      console.error("University location not found in userData");
      router.push("/profile");
  }

  const university = userData.user_location;
  const endpoint = "https://api.vplaza.com.ng/products/getProductByUniCatL";
  
  const requestData = {
      requestID,
      university,
      category,
  };

  const config = tkenn ? {
      headers: {
          Authorization: `Bearer ${tkenn}`,
      },
  } : {};

  try {
      const response = await axios.post(endpoint, requestData, config);
      
      if (response.data.status) {
          // Store the category data in localStorage
          localStorage.setItem('categoryData', JSON.stringify({
              category,
              products: response.data.data,
              timestamp: Date.now()
          }));
          
          // Navigate to the category page
          router.push(`/category/${category}`);
      } else if(response.data.message === "signature verification failed") {
        localStorage.removeItem("token");
      } else {
          alert(response.data.message || "No products found in this category.");
      }
  } catch (error) {
      console.error("Error fetching products by category:", error);
      alert("An error occurred while fetching products.");
  } finally {
    setLoading(false); // Hide loader after request is complete
  }
};
  




const handleWishlistClick = async () => {
  const tkenn = localStorage.getItem("token");
  const requestID = "rid_1983";

  // console.log(requestID)
  if (!tkenn) {
    router.push("/signin");
    return;
  }

  const endpoint = "https://api.vplaza.com.ng/products/getWishlistByShop";
  
  const requestData = {
    requestID,
  };

  const config = {
    headers: {
      Authorization: `Bearer ${tkenn}`,
    },
  };

  try {
    // console.log(config, requestData)
    const response = await axios.post(endpoint, requestData, config);
    
    if (response.data.status) {
      // Store the wishlist data in localStorage
      // console.log(response.data)
      localStorage.setItem('wishlistData', JSON.stringify({
        products: response.data.data,
        timestamp: Date.now()
      }));
      
      // Navigate to the wishlist page
      router.push('/wishlist');
    } else if(response.data.message === "signature verification failed") {
      localStorage.removeItem("token");
    }
    else {
      alert(response.data.message || "No products found in your wishlist.");
    }
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    alert("An error occurred while fetching your wishlist.");
  }
};

  return (
    <div className=" h-full justify-between">
      {loading && (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      )}
      {/* Main Content */}
      <div>
        {/* Search Nav */}

        <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
          <button> 
                <IoArrowBack
                    onClick={() => {
                      router.push("/");
                    }}
                    color="black"
                    size={24}
                    className="cursor-pointer"
                  />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#004AAD]"
                placeholder="Search products..."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* <div className="bg-[#004AAD] px-4 py-2 rounded-lg">
              <span className="text-white text-[10px] font-medium truncate max-w-[80px] block">
                {userDatax?.user_location || "No University selected"}
              </span>
            </div> */}
            <div className="bg-[#004AAD] inline-flex items-center justify-center p-2 rounded">
              <FaLocationDot className="text-white" />
            </div>
          </div>
        </div>
      </header>

     {/* Categories */}
<div className="bg-[#004AAD] h-screen py-2">
    <h2 className="text-center text-xl md:text-2xl font-bold text-white pb-2 pt-2">
      Categories
    </h2>
    <div className="w-full h-px bg-[#8CBDFF] opacity-30"></div>
    <div className="flex flex-wrap w-full bg-[#004AAD] justify-center items-center pt-2 gap-5 ">
        <CategoryItem2
            image={BAGS}
            label="Bags"
            onClick={() => handleCategoryClick("bags")}
            desc="Versatility"
            prod="500+ items"
        />
        <CategoryItem2
            image={ELECTRONICS}
            label="Electronics"
            onClick={() => handleCategoryClick("electronics")}
            desc="Innovation"
            prod="500+ Items"
        />
        <CategoryItem2
            image={FA}
            label="Food"
            onClick={() => handleCategoryClick("food")}
            desc="Nourishing"
            prod="500+ Items"
        />
        <CategoryItem2
            image={FOOTWEAR}
            label="Footwear"
            onClick={() => handleCategoryClick("footwear")}
            desc="Comfort"
            prod="500+ items"
        />
        <CategoryItem2
            image={FUNNY}
            label="Furniture"
            onClick={() => handleCategoryClick("furniture")}
            desc="Durability"
            prod="500+ Items"
        />
        <CategoryItem2
            image={GA}
            label="Gadgets and Accessories"
            onClick={() => handleCategoryClick("gadgets")}
            desc="Technology"
            prod="500+ items"
        />
        <CategoryItem2
            image={GOWN}
            label="Gown"
            onClick={() => handleCategoryClick("gown")}
            desc="Elegance"
            prod="500+ items"
        />
        <CategoryItem2
            image={HAIR}
            label="Hairs"
            onClick={() => handleCategoryClick("hair")}
            desc="Manageability"
            prod="500+ Items"
        />
        <CategoryItem2
            image={JEAN}
            label="Jean"
            onClick={() => handleCategoryClick("jean")}
            desc="Durability"
            prod="500+ items"
        />
        <CategoryItem2
            image={JEWELRIES}
            label="Jewelries"
            onClick={() => handleCategoryClick("jewelries")}
            desc="Luxury"
            prod="500+ Items"
        />
        <CategoryItem2
            image={KITCHEN}
            label="Kitchen"
            onClick={() => handleCategoryClick("kitchen")}
            desc="Practicality"
            prod="500+ Items"
        />
        <CategoryItem2
            image={LINGERIE}
            label="Lingerie"
            onClick={() => handleCategoryClick("lingerie")}
            desc="Intimacy"
            prod="500+ Items"
        />
        <CategoryItem2
            image={PERFUME}
            label="Perfumes"
            onClick={() => handleCategoryClick("perfume")}
            desc="Fragrance"
            prod="500+ Items"
        />
        <CategoryItem2
            image={PHONE}
            label="Phones"
            onClick={() => handleCategoryClick("phone")}
            desc="Connectivity"
            prod="500+ Items"
        />
        <CategoryItem2
            image={SKINCARE}
            label="Skincare"
            onClick={() => handleCategoryClick("skincare")}
            desc="Hydration"
            prod="500+ Items"
        />
      <CategoryItem2
          image={SUIT}
          label="Suit"
          onClick={() => handleCategoryClick("suit")}
          desc="Elegance"
          prod="500+ items"
        />
        <CategoryItem2
            image={SUPPLEMENT}
            label="Supplement"
            onClick={() => handleCategoryClick("perfume")}
            desc="Potency"
            prod="500+ Items"
        />
        <CategoryItem2
            image={TOP}
            label="Top"
            onClick={() => handleCategoryClick("perfume")}
            desc="Quality"
            prod="500+ Items"
        />
        <CategoryItem2
            image={PERFUME}
            label="Trousers"
            onClick={() => handleCategoryClick("perfume")}
            desc="Comfort"
            prod="500+ Items"
        />
    </div>
</div>
      </div>
    </div>
  );
};

export default Page;
