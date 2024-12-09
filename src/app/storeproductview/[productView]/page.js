"use client"; // Since you're using client-side hooks

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios"; // Import Axios
import ProductDetail2 from "@/components/ProductDetail2"; // Product Detail Component
import Loader from "@/components/loader"; // Import the Loader component

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

const ProductPage2 = () => {
  const { productView } = useParams(); // Use 'productView' to match the dynamic route
  console.log("Product View (Product ID):", productView); // Log to verify the parameter
  
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productView) return; // Ensure 'productView' is available before fetching

    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(productView); // Pass 'productView' as the product ID
        setProduct(fetchedProduct); // Set product data
      } catch (err) {
        setError(err.message); // Set error if fetch fails
      }
    };

    fetchProduct();
  }, [productView]); // Fetch when the 'productView' changes

  if (error) {
    return <div>Error loading product details: {error}</div>;
  }

  if (!product) {
    return <Loader />; // Show loader while product details are loading
  }

  return <ProductDetail2 product={product} />;
};

export default ProductPage2;
