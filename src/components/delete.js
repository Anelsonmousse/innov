import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "./button";

const Delete = ({ productId, productName, productImage, amount, onClose }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const requestID = "rid_1983";
  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.vplaza.com.ng/products/deleteProduct",
        {
          product_id: productId,
          requestID,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        alert(response.data.message);
        // Remove the viewed product from local storage
        localStorage.removeItem("viewProduct");
        setIsDeleting(true);
        if (router.pathname === "/store/product") {
          window.location.reload();
        } else {
          router.push("/store/product");
        }
        onClose();
      } else {
        router.push("/signin");
      }
    } catch (err) {
      setError("Failed to delete product. Please try again.");
      setIsDeleting(false);
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="fixed p-4 bg-black bg-opacity-75 w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div className="bg-white py-6 px-8 gap-8 flex flex-col justify-center rounded-3xl min-h-16 w-full max-w-md">
        <h1 className="text-main font-sans font-bold text-lg text-center">
          Delete Item?
        </h1>

        <div className="flex gap-2 items-center">
          <img
            className="w-[60px] h-[60px] object-cover rounded-lg"
            src={productImage}
            alt={productName}
          />
          <div>
            <h2 className="text-sm font-sans font-bold">{productName}</h2>
            <p className="font-sans font-bold">
              ₦{parseInt(amount).toLocaleString()}
            </p>
          </div>
        </div>

        {error && <div className="text-red-500 text-center">{error}</div>}

        <div className="justify-between items-center flex">
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            className="font-sans font-bold"
          >
            {isDeleting ? "Deleting..." : "Yes"}
          </Button>
          <Button
            onClick={onClose}
            disabled={isDeleting}
            className="font-sans bg-white text-main shadow-lg font-bold"
          >
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
