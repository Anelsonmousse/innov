"use client"; // Since you're using client-side hooks

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import ProductDetail2 from "@/components/ProductDetail2"; // Product Detail Component
import Loader from "@/components/Loader"; // Import the Loader component

const fetchProductById = async (product_id) => {
  try {
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("requestID", "rid_1983"); // Add other necessary fields

    const response = await axios.post(
      "https://api.vplaza.com.ng/products/ProductById",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};


const ProductPage = () => {
  const { product_id } = useParams(); // Extract the product_id from URL params
  console.log("Product ID:", product_id); // Log the product_id to verify
  
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product_id) return; // Ensure 'product_id' is available before fetching

    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(product_id);
        setProduct(fetchedProduct); // Set product data
      } catch (err) {
        setError(err.message); // Set error if fetch fails
      }
    };

    fetchProduct();
  }, [product_id]); // Fetch when the 'product_id' changes

  if (error) {
    return <div>Error loading product details: {error}</div>;
  }

  if (!product) {
    return <Loader />; // Show loader while product details are loading
  }

  return <ProductDetail2 product={product} />;
};

export default ProductPage;
