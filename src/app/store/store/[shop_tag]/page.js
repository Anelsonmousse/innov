"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios"; // Import Axios
import ShopDetails from "@/components/ShopDetails"; // Import the shop details component
import Loader from "@/components/Loader"; // Import the Loader component

// Fetch product details by shop tag
const fetchShoptag = async (shop_tag) => {
  try {
    // Create FormData and append the necessary fields
    const formData = new FormData();
    formData.append("shop_name", shop_tag); // Pass shop_tag as shop_name
    formData.append("requestID", "rid_1983"); // Add any other necessary fields here
    const token = localStorage.getItem("token");

    // Make the POST request using Axios
    const response = await axios.post(
      "https://api.vplaza.com.ng/products/getProductByShopName",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure content type is set to multipart/form-data
        },
      }
    );

    // Return the fetched product data
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// Page component
const ProductPage = () => {
  const { shop_tag } = useParams(); // Extract shop_tag dynamically from params
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shop_tag) return; // Ensure shop_tag exists before fetching
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchShoptag(shop_tag); // Pass shop_tag to the fetch function
        setProduct(fetchedProduct); // Update the state with fetched product data
      } catch (err) {
        setError(err.message); // Set the error state
      }
    };

    fetchProduct();
  }, [shop_tag]);

  if (error) {
    return <div>Error loading product details: {error}</div>;
  }

  if (!product) {
    return <Loader />; // Show loader while product details are loading
  }

  return <ShopDetails product={product} />;
};

export default ProductPage;
