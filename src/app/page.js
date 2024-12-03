"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Twelve,
  Thirteen,
  Fourteen,
} from "../assets";
import { IoIosHeart } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { FaStar, FaRegStar, FaSearch } from "react-icons/fa";
import { MdStore, MdHomeFilled } from "react-icons/md";
import { IoPersonCircleSharp } from "react-icons/io5";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [userDatax, setUserDatax] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const userDatay = JSON.parse(localStorage.getItem("userData"));
  setUserDatax(userDatay);
    const tken = localStorage.getItem("token");
    setToken(tken);
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
      const requestID = "rid_1983"; // Generate request ID

      // Retrieve user data from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));

      let endpoint = "";
      let requestData = {
        requestID,
      };

      if (tkenn) {
        // If token exists, use the 'getProductByUni' endpoint
        endpoint = "https://api.vplaza.com.ng/products/getProductByUniL";

        // Dynamically set the university from localStorage (userData)
        if (userData && userData.user_location) {
          requestData.university = userData.user_location;
        } else {
          console.error("University location not found in userData");
          return; // Exit if no university location found
        }
      } else {
        // If no token exists, use the 'getAllProducts' endpoint
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
      console.log("Request Config:", {
        endpoint,
        requestData,
        config,
      });

      try {
        const response = await axios.post(endpoint, requestData, config);

        // Log the response from the API
        console.log(`Response from endpoint: ${endpoint}`, response);

        // Check if the response contains the message "no product from this university"
        if (response.data.status === false && response.data.message === "Failed to get product from this uni") {
          setError("No products are available from this university. Please check back later or select a different location.");
        } else {
          console.log(response.data.data);
          const fetchedItems = shuffleArray(response.data.data);

          if (tkenn) {
            // Show only the first 25 products when logged in
            setItems(fetchedItems.slice(0, 25));
          } else {
            setItems(fetchedItems);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Please try again later, we're having trouble fetching the list of products.");
      }
    };

    fetchItems();
  }, []);

  const handleViewMoreProducts = () => {
    if (!token) {
      router.push("/signin");
    } else {
      // Fetch more products logic (if needed)
      console.log("Fetching more products...");
    }
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

const CategoryItem = ({ image, label, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center p-2 hover:bg-[#003288] rounded-lg transition-all cursor-pointer"
  >
    <div className="w-12 h-12 md:w-16 md:h-16 relative">
      <Image 
        src={image} 
        alt={label}
        layout="fill"
        objectFit="contain"
        className="transition-transform hover:scale-110"
      />
    </div>
    <div className="text-xs md:text-sm text-center text-white font-medium mt-1">
      {label}
    </div>
  </div>
);

const ProductList = ({ items }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 50;
  const totalPages = Math.ceil(items.length / productsPerPage);

  const handleProductClick = (item) => {
      if (!token) {
          router.push("/signin");
      }else {
          localStorage.setItem('selectedProduct', JSON.stringify(item));
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
                          className="flex flex-col items-center p-4 border border-gray-300 rounded cursor-pointer transition-all hover:shadow-lg"
                      >
                          <img
                              src={item.details.product_img1}
                              alt={item.details.product_name}
                              width={150}
                              height={150}
                              className="w-[150px] h-[150px] object-cover"
                          />
                          <div className="w-full">
                              <div className="mt-2 text-[10px] font-bold">
                                  {item.details.product_name}
                              </div>
                          </div>
                          <div className="flex flex-col text-sm w-full">
                              <div className="flex items-center">
                                  <StarRating rating={getRating(item)} />
                              </div>
                              <div className="font-bold text-md">{item.shopDetails.shop_name}</div>
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
  const tkenn = localStorage.getItem("token");
  const requestID = "rid_1983";
  const userData = JSON.parse(localStorage.getItem("userData"));

  if (!userData || !userData.user_location) {
      console.error("University location not found in userData");
      return;
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
  }
};

const handleWishlistClick = async () => {
  const tkenn = localStorage.getItem("token");
  const requestID = "rid_1983";

  console.log(requestID)
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
    console.log(config, requestData)
    const response = await axios.post(endpoint, requestData, config);
    
    if (response.data.status) {
      // Store the wishlist data in localStorage
      console.log(response.data)
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
    <div className="flex flex-col min-h-screen justify-between">
      {/* Main Content */}
      <div>
        {/* Search Nav */}

        <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
          <button 
                onClick={handleWishlistClick}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
              <IoIosHeart size={24} />
            </button>
            
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#004AAD]"
                placeholder="Search products..."
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="bg-[#004AAD] px-4 py-2 rounded-lg">
              <span className="text-white text-sm font-medium truncate max-w-[150px] block">
                {userDatax?.user_location || "No University selected"}
              </span>
            </div>
          </div>
        </div>
      </header>

     {/* Categories */}
     <div className="bg-[#004AAD] py-6">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-xl md:text-2xl font-bold text-white mb-6">
            Categories
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 md:gap-6">
            <CategoryItem image={Five} label="Phones" onClick={() => handleCategoryClick("phones")} />
            <CategoryItem image={Six} label="Furnitures" onClick={() => handleCategoryClick("furnitures")} />
            <CategoryItem image={Seven} label="Electronics" onClick={() => handleCategoryClick("electronics")} />
            <CategoryItem image={Eight} label="Tops" onClick={() => handleCategoryClick("tops")} />
            <CategoryItem image={Nine} label="Health & Beauty" onClick={() => handleCategoryClick("health & beauty")} />
            <CategoryItem image={Ten} label="Women" onClick={() => handleCategoryClick("women")} />
            <CategoryItem image={Twelve} label="Grocery" onClick={() => handleCategoryClick("grocery")} />
            <CategoryItem image={Thirteen} label="Miscellaneous" onClick={() => handleCategoryClick("miscellaneous")} />
          </div>
        </div>
      </div>
      
        
        {/* Main Body */}
        <div className="px-4 w-full">
          <div className="flex w-full justify-between mt-3">
            <div className="text-lg font-bold">Top Products</div>
            <FaFilter />
          </div>
          {error ? (
            <div className="text-center text-red-500 mt-4">{error}</div>
          ) : (
            <ProductList items={items} />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="w-full  h-[100px] sticky bottom-0 bg-white ">
        <div className="bg-[#004AAD] justify-between flex rounded-2xl w-[90%] ml-[5%] h-[70%]">
          <div className=" flex justify-between ml-[5%] mt-3 w-[90%]">
            {token ? (
               <MdStore
               onClick={() => {
             
                 if (!token) {
                   router.push("/signin");
                  
                 } else {
                   // Retrieve and parse the userData from localStorage
                   const userData = JSON.parse(localStorage.getItem("userData"));
 
                   // Check if userData exists and then access the shop_status and shop_plan
                   if (userData) {
                     const shopStatus = userData.shop_status;
                     const shopPlan = userData.shop_plan;
 
                     //alert(`shop_status: ${shopStatus}, shop_plan: ${shopPlan}`);
 
                     if (shopStatus === 0) {
                       //alert("Redirecting to market page");
                       router.push("/market");
                     } else if (shopStatus === 1) {
                      // alert("Redirecting to store page");
                       router.push("/store/product");
                     } else {
                       // Handle other cases or provide a default route
                       //alert("Unhandled shop status");
                       router.push("/");
                     }
                   } else {
                   //  alert("User data not found");
                   }
                 }
               }}
               color="#686868"
               size={40}
             />
            ) : (
              <MdStore
                onClick={() => router.push("/signin")}
                color="#686868"
                size={40}
              />
            )}
            <div className="h-[50px] w-[50px] rounded-full bg-white text-center items-center justify-center">
              <MdHomeFilled
                color="#004AAD"
                className="ml-[5px] pt-[2px]"
                size={40}
              />
            </div>
            {token ? (
              <IoPersonCircleSharp
                onClick={() => router.push("/profile")}
                color="#686868"
                size={40}
              />
            ) : (
              <IoPersonCircleSharp
                onClick={() => router.push("/signin")}
                color="#686868"
                size={40}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
