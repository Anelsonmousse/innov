"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoHeart, IoHeartOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import Button from "@/components/button";
import axios from "axios";

const page = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uname, setUname] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 5;
  const requestID = "rid_1983";

  // Touch handling for swipe gestures
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const productData = JSON.parse(localStorage.getItem('selectedProduct'));
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    if (productData) {
      setProduct(productData);
      setIsInWishlist(productData.inWishList === 1);
    }
    if (userData) {
      setUname(userData.username);
    }
  }, []);

  const getValidImages = () => {
    if (!product) return [];
    return [
      product.details.product_img1,
      product.details.product_img2,
      product.details.product_img3,
      product.details.product_img4,
      product.details.product_img5,
    ].filter(img => img && img !== "0");
  };

  const handleImageNavigation = (direction) => {
    const images = getValidImages();
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
      setModalImage(images[(currentImageIndex + 1) % images.length]);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
      setModalImage(images[(currentImageIndex - 1 + images.length) % images.length]);
    }
  };
  
  const handleImageClick = (imageUrl, index) => {
    setModalImage(imageUrl);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalImage("");
    document.body.style.overflow = 'unset';
  };

  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  const handleNextImage = () => {
    const images = getValidImages();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setModalImage(images[(currentImageIndex + 1) % images.length]);
  };

  const handlePrevImage = () => {
    const images = getValidImages();
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    setModalImage(images[(currentImageIndex - 1 + images.length) % images.length]);
  };

  const handleWheel = (e) => {
    if (e.deltaY < 0) {
      handlePrevImage();
    } else {
      handleNextImage();
    }
  };

  const handleKeyDown = (e) => {
    if (isModalOpen) {
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
      if (e.key === 'Escape') handleCloseModal();
    }
  };
  const getCallLink = (whatsappLink) => {
    // Define country codes for Nigeria (234) and Cyprus (357)
    const nigeriaCountryCode = '234';
    const cyprusCountryCode = '357';
  
    // Check if the string is a URL or a simple phone number
    if (whatsappLink.startsWith('https://wa.me/') || whatsappLink.startsWith('wa.me/')) {
      // Extract the phone number from the URL (skip the 'https://wa.me/' or 'wa.me/')
      const phoneNumber = whatsappLink.replace(/^https?:\/\/?wa\.me\//, '');
      
      // Return the correct URL for calling the number, using 'https:' prefix
      return `https://api.whatsapp.com/send/?phone=${phoneNumber}&text&type=phone_number&app_absent=0`;
    } else {
      // Check if it's a raw number, potentially with no country code
      const rawPhoneNumber = whatsappLink.replace(/[^0-9]/g, ''); // Remove non-numeric characters
  
      // If it's a Nigerian or Cypriot number, prepend the country code
      if (rawPhoneNumber.length === 10 && rawPhoneNumber.startsWith('0')) {
        // Assume Nigerian number if it starts with '0' (excluding country code)
        return `https://api.whatsapp.com/send/?phone=${nigeriaCountryCode}${rawPhoneNumber.slice(1)}&text&type=phone_number&app_absent=0`;
      } else if (rawPhoneNumber.length === 8 && rawPhoneNumber.startsWith('0')) {
        // Assume Cypriot number if it's a valid length and starts with '0'
        return `https://api.whatsapp.com/send/?phone=${cyprusCountryCode}${rawPhoneNumber.slice(1)}&text&type=phone_number&app_absent=0`;
      } else {
        // Default fallback, return the number with the 'wa.me' format without adding any country code
        return `https://api.whatsapp.com/send/?phone=${rawPhoneNumber}&text&type=phone_number&app_absent=0`;
      }
    }
  };
  
  const getMessageLink = (whatsappLink) => {
    // If the link is already in the 'wa.me' format, use it directly
    if (whatsappLink.startsWith('wa.me/')) {
      return `https://api.whatsapp.com/send/?phone=${whatsappLink.replace('wa.me/', '')}&text&type=phone_number&app_absent=0`;
    }
  
    // Otherwise, process the phone number to create the correct URL
    return getCallLink(whatsappLink);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex]);

  const handleNextReviews = () => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil((product.reviews?.length || 0) / reviewsPerPage) - 1));
  };

  const handlePrevReviews = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.touches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) < minSwipeDistance) return;
    
    if (distance > 0) {
      handleImageNavigation('next');
    } else {
      handleImageNavigation('prev');
    }
  };

  const toggleWishlist = async () => {
    if (!product) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const endpoint = isInWishlist
        ? "https://api.vplaza.com.ng/products/removeFromWishList"
        : "https://api.vplaza.com.ng/products/addToWishList";

      const response = await axios.post(
        endpoint,
        { product_id: product.details.product_id, requestID },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedProduct = {
          ...product,
          inWishList: isInWishlist ? 0 : 1
        };
        localStorage.setItem("selectedProduct", JSON.stringify(updatedProduct));
        setProduct(updatedProduct);
        setIsInWishlist(!isInWishlist);
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response?.data?.message === "signature verification failed") {
        router.push("/signin");
      }
      console.error("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedRating || !reviewText.trim()) {
      alert("Please provide both rating and review text");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://api.vplaza.com.ng/products/postReview",
        {
          product_id: product.details.product_id,
          rating: selectedRating,
          review: reviewText,
          requestID,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const newReview = {
          id: Date.now(),
          product_id: product.details.product_id,
          desc: reviewText,
          rating: selectedRating.toString(),
          username: uname,
          img: 'https://images.squarespace-cdn.com/content/v1/50eca855e4b0939ae8bb12d9/1414865529007-1CEXSGLSU78MIYH77PUX/image-asset.png',
        };

        const updatedProduct = {
          ...product,
          reviews: [...(product.reviews || []), newReview]
        };

        localStorage.setItem('selectedProduct', JSON.stringify(updatedProduct));
        setProduct(updatedProduct);
        setReviewText('');
        setSelectedRating(0);
        alert("Review posted successfully!");
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert("Failed to post review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-main"></div>
      </div>
    );
  }

  const sortedReviews = [...(product.reviews || [])]
    .sort((a, b) => b.id - a.id)
    .slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

  const totalPages = Math.ceil((product.reviews?.length || 0) / reviewsPerPage);

  return (
    <main className="grid min-h-screen grid-cols-12 items-start lg:pt-8">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-main"></div>
          </div>
        </div>
      )}

      {/* Product Images Section */}
      <section className="col-span-12 lg:col-span-7 p-4">
        <div className="flex flex-col-reverse lg:flex-row gap-4">
          {/* Thumbnail Images */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto">
            {getValidImages().slice(1).map((img, index) => (
              <div
                key={index}
                onClick={() => {
                  setModalImage(img);
                  setCurrentImageIndex(index);
                  setIsModalOpen(true);
                }}
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

          {/* Main Image */}
          <div className="relative aspect-square w-full">
            <img
              src={product.details.product_img1}
              alt={product.details.product_name}
              className="w-full h-full object-cover rounded-lg"
              onClick={() => {
                setModalImage(product.details.product_img1);
                setCurrentImageIndex(0);
                setIsModalOpen(true);
              }}
            />
            <div className="absolute top-4 left-4 lg:hidden">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
              >
                <IoArrowBack size={24} />
              </button>
            </div>
            <button
              onClick={toggleWishlist}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              {isInWishlist ? (
                <IoHeart size={24} className="text-red-500" />
              ) : (
                <IoHeartOutline size={24} />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="col-span-12 lg:col-span-5 p-4 lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4">
          {product.details.product_name}
        </h1>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <FaStar className="text-yellow-400" />
              <span className="ml-1">{Math.floor(product.average_r.average)}</span>
            </div>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
              {product.shopDetails.shop_name}
            </span>
          </div>
          <span className="text-2xl font-bold text-main">
            ₦{parseInt(product.details.amount).toLocaleString()}
          </span>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="font-bold mb-2">Description</h2>
          <p className="text-gray-600">{product.details.product_desc}</p>
        </div>

        {/* Reviews Section */}
        <div className="mb-8">
          <h2 className="font-bold mb-4">
            Reviews ({product.reviews?.length || 0})
          </h2>
          
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
                    {Array.from({ length: parseInt(review.rating) }).map((_, i) => (
                      <FaStar key={i} className="text-yellow-400" size={12} />
                    ))}
                  </div>
                  <p className="text-gray-600">{review.desc}</p>
               </div>
             </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-main text-white rounded-lg disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span>
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
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

        {/* Review Form */}
        <div className="flex flex-col">
          <h2 className="font-bold mb-4">Write a Review</h2>
          <div className="flex gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                size={24}
                className={`cursor-pointer ${
                  selectedRating > index ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setSelectedRating(index + 1)}
              />
            ))}
          </div>
          <textarea
            className="w-full p-3 border rounded-lg mb-4 resize-none"
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts about this product..."
          />
          <Button
              className="font-black text-main flex self-end items-center gap-2 mt-2"
              variant="plain"
              onClick={handleSubmitReview}
            >
              Submit
              <svg
                width="31"
                height="15"
                viewBox="0 0 31 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30.7071 8.20711C31.0976 7.81658 31.0976 7.18342 30.7071 6.79289L24.3431 0.428932C23.9526 0.0384078 23.3195 0.0384078 22.9289 0.428932C22.5384 0.819457 22.5384 1.45262 22.9289 1.84315L28.5858 7.5L22.9289 13.1569C22.5384 13.5474 22.5384 14.1805 22.9289 14.5711C23.3195 14.9616 23.9526 14.9616 24.3431 14.5711L30.7071 8.20711ZM0 8.5H30V6.5H0V8.5Z"
                  fill="#004AAD"
                />
              </svg>
            </Button>
        </div>

        {/* Contact Buttons */}
        <div className="flex gap-4">
  <Button
    className="flex-1 py-3"
    onClick={() => {
      const callLink = getCallLink(product.shopDetails.shop_whatsapp_link);
      window.location.href = `tel:${callLink}`;
    }}
  >
    Call Seller
  </Button>
  <Button
    variant="outline"
    className="flex-1 py-3 flex items-center justify-center gap-2"
    onClick={() => {
      const messageLink = getMessageLink(product.shopDetails.shop_whatsapp_link);
      window.location.href = messageLink;
    }}
  >
    <IoLogoWhatsapp size={24} />
    Message on WhatsApp
  </Button>
</div>
      </section>

      {/* Image Modal */}
      {isModalOpen && (
        <div
        className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
        onClick={handleBackgroundClick}
        onWheel={handleWheel}
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
                onClick={handlePrevImage}
                className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white text-3xl hover:bg-gray-800 rounded-full p-2"
              >
                &#8592;
              </button>
              <button
                onClick={handleNextImage}
                className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white text-3xl hover:bg-gray-800 rounded-full p-2"
              >
                &#8594;
              </button>
            </div>
          </div>
        )}
      </main>
    );
  };
  
  export default page;