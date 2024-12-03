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
import { FaStar, FaRegStar } from "react-icons/fa";
import { MdStore, MdHomeFilled } from "react-icons/md";
import { IoPersonCircleSharp } from "react-icons/io5";
import axios from "axios";

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [items, setItems] = useState([]);
  const [userDatax, setUserDatax] = useState([]);
  const [error, setError] = useState(null);
  
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

const ProductList = ({ items }) => {
    const router = useRouter();

    const handleProductClick = (item) => {
        if (!token) {
            router.push("/signin");
        } else {
            // Store the product data before navigation
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

  
    return (
        <div className="w-full">
            <div className="grid grid-cols-2 w-full gap-4">
                {Array.isArray(items) &&
                    items.map((item, index) => (
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
                                <div className="text-md">₦{parseInt(item.details.amount)}</div>
                                <div className="text-sm mt-[8px] ml-3 text-[#004AAD] font-medium">
                                    {item.status}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
            {token && items.length === 50 && (
                <div
                    className="text-center mt-4 text-blue-600 cursor-pointer"
                    onClick={handleViewMoreProducts}
                >
                    View More Products
                </div>
            )}
        </div>
    );
};


  

  const handleCategoryClicky = async (category) => {
    const tkenn = localStorage.getItem("token");
    const requestID = "rid_1983"; // Generate request ID
    const userData = JSON.parse(localStorage.getItem("userData"));

    // Ensure userData and university are available
    if (!userData || !userData.user_location) {
        console.error("University location not found in userData");
        return; // Exit if no university location found
    }

    const university = userData.user_location;

    const endpoint = "https://api.vplaza.com.ng/products/getProductByUniCat";
    const requestData = {
        requestID,
        university,
        category, // The selected category (passed dynamically)
    };

    const config = tkenn
        ? {
            headers: {
                Authorization: `Bearer ${tkenn}`,
            },
        }
        : {};

    // Log the request configuration before sending the request
    console.log("Sending request:", {
        endpoint,
        requestData,
        config,
    });

    try {
        const response = await axios.post(endpoint, requestData, config);
        console.log("Response:", response);
        console.log("Response data:", response.data);

        // Check if the response is successful
        if (response.data.status) {
            // Pass the fetched data to another page (e.g., ProductListPage)
            router.push({
                pathname: "/category/category",
                query: {
                    category,
                    products: JSON.stringify(response.data.products), // Assuming products are in response.data.products
                },
            });
        } else {
            // Handle the case where the response indicates failure
            alert(response.data.message || "Failed to load products.");
        }
    } catch (error) {
        console.error("Error fetching products by category:", error);
        alert("An error occurred while fetching products.");
    }
};

// Modified handleCategoryClick function
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
      } else {
          alert(response.data.message || "No products found in this category.");
      }
  } catch (error) {
      console.error("Error fetching products by category:", error);
      alert("An error occurred while fetching products.");
  }
};

  return (
    <div className="flex flex-col min-h-screen justify-between">
      {/* Main Content */}
      <div>
        {/* Search Nav */}
        <div className="w-full mt-2 px-3 mb-2 justify-between flex">
          <IoIosHeart
            onClick={() => {
              router.push("/wishlist");
            }}
            size={30}
            color="black"
          />
          <input
            type="text"
            value=""
            className="bg-[#D9D9D9] text-sm pl-2 w-full ml-3 rounded-lg"
            placeholder="Search"
          />
          {/* Categories tab */}
          <div className="bg-[#004AAD] text-sm px-3 py-1 text-wrap ml-2 rounded-lg text-white text-center">
  {userDatax && userDatax.user_location ? userDatax.user_location : "No University selected"}
</div>

        </div>
        <div className="w-full px-4 bg-[#004AAD]">
          <div className="text-center w-full text-xl pt-3 text-white">
            Categories
          </div>
          <div>
            <div className="flex w-full items-center justify-center mt-2 gap-5">
              <div onClick={() => handleCategoryClick("phones")}>
                <Image src={Five} alt="Phones" />
                <div className="text-sm text-center text-white font-medium">
                  Phones
                </div>
              </div>
              <div onClick={() => handleCategoryClick("furnitures")}>
                <Image src={Six} alt="Furnitures" />
                <div className="text-sm text-center text-white font-medium">
                  Furnitures
                </div>
              </div>
              <div onClick={() => handleCategoryClick("electronics")}>
                <Image src={Seven} alt="Electronics" />
                <div className="text-sm text-center text-white font-medium">
                  Electronics
                </div>
              </div>
              <div onClick={() => handleCategoryClick("tops")}>
                <Image src={Eight} alt="Tops" />
                <div className="text-sm text-center text-white font-medium">
                  Tops
                </div>
              </div>
            </div>
            {/* Next row */}
            <div className="flex w-full items-center justify-center gap-5">
              <div onClick={() => handleCategoryClick("health & beauty")}>
                <Image src={Nine} alt="Health & Beauty" />
                <div className="text-sm text-center text-white font-medium">
                  Health & Beauty
                </div>
              </div>
              <div onClick={() => handleCategoryClick("women")}>
                <Image src={Ten} alt="Wears" />
                <div className="text-sm text-center text-white font-medium">
                  Women
                </div>
              </div>
              <div onClick={() => handleCategoryClick("grocery")}>
                <Image src={Twelve} alt="Grocery" />
                <div className="text-sm text-center text-white font-medium">
                  Grocery
                </div>
              </div>
              <div onClick={() => handleCategoryClick("miscellaneous")}>
                <Image src={Thirteen} alt="Miscellaneous" />
                <div className="text-sm text-center text-white font-medium">
                  Miscellaneous
                </div>
              </div>
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
