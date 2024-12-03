"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { FaPencilAlt, FaStar, FaTrash } from "react-icons/fa";
import Button from "@/components/button";
import Delete from "@/components/delete";

const page = () => {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  const [productData, setProductData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const storedProduct = localStorage.getItem("viewProduct");
    if (storedProduct) {
      setProductData(JSON.parse(storedProduct));
    }
  }, []);

  const getValidImages = () => {
    if (!productData) return [];
    return [
      productData.details.product_img1,
      productData.details.product_img2,
      productData.details.product_img3,
      productData.details.product_img4,
      productData.details.product_img5,
    ].filter((img) => img && img !== "0");
  };

  const handleImageNavigation = (direction) => {
    const images = getValidImages();
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setModalImage(images[(currentImageIndex + 1) % images.length]);
    } else {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
      setModalImage(
        images[(currentImageIndex - 1 + images.length) % images.length]
      );
    }
  };

  const handleImageClick = (imageUrl, index) => {
    setModalImage(imageUrl);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage("");
    document.body.style.overflow = "unset";
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleEdit = () => {
    localStorage.setItem("editProduct", JSON.stringify(productData));
    router.push("/editproduct");
  };

  const handleDelete = () => {
    setDeleteModal(true);
  };

  // Touch handlers
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0) {
      handleImageNavigation("next");
    } else {
      handleImageNavigation("prev");
    }
  };

  if (!productData) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  const {
    details: { product_name, product_img1, amount, product_desc, product_id },
    average_r,
    shopDetails,
    reviews = [],
  } = productData;

  const sortedReviews = [...reviews]
    .sort((a, b) => b.id - a.id)
    .slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  return (
    <main className="grid min-h-screen grid-cols-12 items-start lg:pt-8">
      {/* Product Images Section */}
      <section className="col-span-12 lg:col-start-1 lg:col-end-8 lg:p-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnail Images */}
          <div className="flex items-center justify-between px-4 lg:flex-col gap-2">
            <div className="flex lg:flex-col overflow-x-auto lg:overflow-y-auto gap-2">
              {getValidImages()
                .slice(1)
                .map((img, index) => (
                  <div
                    key={index}
                    onClick={() => handleImageClick(img, index)}
                    className="shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={img}
                      alt={`Product view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
            </div>
            <FaTrash
              onClick={handleDelete}
              size={24}
              className="fill-main cursor-pointer"
            />
          </div>

          {/* Main Image */}
          <div className="relative aspect-square w-full">
            <img
              src={product_img1}
              alt={product_name}
              className="w-full h-full object-cover rounded-lg"
              onClick={() => handleImageClick(product_img1, 0)}
            />
            <div className="absolute top-4 left-4 lg:hidden">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <IoArrowBack size={24} />
              </button>
            </div>
            <Button
              onClick={handleEdit}
              className="absolute top-4 right-4 flex gap-1 px-2 py-1 text-sm items-center"
            >
              <FaPencilAlt size={12} /> Edit
            </Button>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="col-span-12 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:col-start-8 px-4 pt-3 lg:p-6 lg:pt-8 lg:col-end-12">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4">{product_name}</h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <FaStar className="text-yellow-400" />
              <span className="ml-1">{Math.floor(average_r.average)}</span>
            </div>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
              Seller
            </span>
          </div>
          <span className="text-2xl font-bold text-main">
            ₦{parseInt(amount).toLocaleString()}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="font-bold mb-2">Description</h2>
          <p className="text-gray-600">{product_desc}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">Reviews ({reviews.length})</h2>

          {sortedReviews.length > 0 ? (
            <>
              {sortedReviews.map((review, index) => (
                <div
                  key={index}
                  className="my-4 border-b border-black py-2 border-opacity-10 flex gap-2"
                >
                  <div className="w-8 h-8 shrink-0 relative">
                    <img
                      className="rounded-full"
                      src={review.img}
                      alt={review.username}
                    />
                  </div>
                  <div>
                    <span className="font-medium">{review.username}</span>
                    <div className="flex gap-1 mb-2">
                      {Array.from({ length: parseInt(review.rating) }).map(
                        (_, i) => (
                          <FaStar
                            key={i}
                            className="text-yellow-400"
                            size={12}
                          />
                        )
                      )}
                    </div>
                    <p className="text-gray-600">{review.desc}</p>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-main text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage === totalPages - 1}
                    className="px-4 py-2 bg-main text-white rounded-lg disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500">No reviews yet</p>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
          onClick={handleBackgroundClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white text-3xl p-2 z-10 hover:bg-gray-800 rounded-full"
            >
              &times;
            </button>
            <img
              className="max-w-3xl max-h-3xl object-contain"
              src={modalImage}
              alt="Enlarged Product"
            />

            {/* Navigation Arrows */}
            <button
              onClick={() => handleImageNavigation("prev")}
              className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-3xl hover:bg-gray-800 rounded-full p-2"
            >
              &#8592;
            </button>
            <button
              onClick={() => handleImageNavigation("next")}
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-3xl hover:bg-gray-800 rounded-full p-2"
            >
              &#8594;
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <Delete
          productId={product_id}
          productName={product_name}
          productImage={product_img1}
          amount={amount}
          onClose={() => setDeleteModal(false)}
        />
      )}
    </main>
  );
};

export default page;
