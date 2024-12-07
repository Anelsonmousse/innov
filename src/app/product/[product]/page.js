"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios"; // Import Axios
import ProductDetail from "@/components/ProductDetail"; // Import the product detail component

// Fetch product details by ID
const fetchProductById = async (product_id) => {
  try {
    // Create FormData and append the necessary fields
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("requestID", "rid_1983"); // Add any other necessary fields here

    // Make the POST request using Axios
    const response = await axios.post(
      "https://api.vplaza.com.ng/products/ProductById",
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
  const product_id = useParams(); // Dynamically extract product_id from params
  console.log(product_id.product);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!product_id) return; // Ensure product_id exists before fetching
    const fetchProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(product_id.product);
        setProduct(fetchedProduct); // Update the state with fetched product data
      } catch (err) {
        setError(err.message); // Set the error state
      }
    };

    fetchProduct();
  }, [product_id]);

  if (error) {
    return <div>Error loading product details: {error}</div>;
  }

  if (!product) {
    return <div>Loading product details...</div>;
  }

  return <ProductDetail product={product} />;
};

export default ProductPage;
