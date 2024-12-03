"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack, IoHeart, IoHeartOutline, IoLogoWhatsapp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
// import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/button";
import axios from "axios";

const page = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uname, setUname] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [wishlistAction, setWishlistAction] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const reviewsPerPage = 5;
  const requestID = "rid_1983";

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

  const images = product ? [
    product.details.product_img1,
    product.details.product_img2,
    product.details.product_img3,
    product.details.product_img4,
    product.details.product_img5,
  ].filter(img => img !== "0") : [];

  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
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
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    setModalImage(images[(currentImageIndex + 1) % images.length]);
  };

  const handlePrevImage = () => {
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

  const toggleWishlist = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const storedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
      const isInWishlist = storedProduct?.inWishList === 1;
      setWishlistAction(isInWishlist ? "Removing from wishlist..." : "Adding to wishlist...");

      const endpoint = isInWishlist
        ? "https://api.vplaza.com.ng/products/removeFromWishList"
        : "https://api.vplaza.com.ng/products/addToWishList";

      const response = await axios.post(
        endpoint,
        {
          product_id: product.details.product_id,
          requestID,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedStatus = isInWishlist ? 0 : 1;
        const updatedProduct = { ...storedProduct, inWishList: updatedStatus };
        localStorage.setItem("selectedProduct", JSON.stringify(updatedProduct));
        alert(response.data.message);
        setIsInWishlist(updatedStatus === 1);
      } else if (response.data.message === "signature verification failed") {
        await router.push("/signin");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
  };

  const handleSubmitReview = async () => {
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Review posted..");
        const updatedProduct = {
          ...product,
          reviews: [
            ...(product.reviews && Array.isArray(product.reviews) ? product.reviews : []),
            {
              id: (product.reviews && Array.isArray(product.reviews) ? product.reviews.length : 0) + 1,
              product_id: product.details.product_id,
              desc: reviewText,
              rating: selectedRating.toString(),
              user_id: 'user829e662ff4b223aa4bb382bb8d0e9bd8',
              username: uname,
              img: 'https://images.squarespace-cdn.com/content/v1/50eca855e4b0939ae8bb12d9/1414865529007-1CEXSGLSU78MIYH77PUX/image-asset.png',
            }
          ]
        };
        localStorage.setItem('selectedProduct', JSON.stringify(updatedProduct));
        setProduct(updatedProduct);
        setReviewText('');
        setSelectedRating(0);
      } else if (response.data.message === "signature verification failed") {
        await router.push("/signin");
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen p-4">
        <div className="flex justify-center items-center h-[60vh]">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const sortedReviews = [...(product.reviews || [])]
    .sort((a, b) => b.id - a.id);
  
  const currentReviews = sortedReviews.slice(
    currentPage * reviewsPerPage,
    (currentPage + 1) * reviewsPerPage
  );

  const totalPages = Math.ceil((product.reviews?.length || 0) / reviewsPerPage);

  return (
    <main className="grid min-h-screen grid-cols-12 items-start lg:pt-8">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="loader">{wishlistAction || "Posting Review..."}</div>
        </div>
      )}

      <section className="col-span-12 lg:col-start-1 lg:col-end-8 lg:p-4 flex flex-col lg:flex-row gap-2">
        <div className="px-2 order-2 lg:order-1">
          <div className="flex lg:flex-col overflow-x-scroll lg:overflow-hidden gap-2">
            {Array.from({ length: 4}).map((_, index) => {
              const imageKey = `product_img${index + 2}`;
              const imageUrl = product.details[imageKey];

              return (
                imageUrl && imageUrl !== "0" && (
                  <div
                    key={imageKey}
                    className="aspect-square shrink-0 w-12 h-12 lg:w-16 lg:h-16 relative rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleImageClick(imageUrl, index + 1)}
                  >
                    <img
                      className="object-cover w-full h-full"
                      alt={`Product Image ${index + 2}`}
                      src={imageUrl}
                    />
                  </div>
                )
              );
            })}
          </div>
        </div>

        <div className="order-1 lg:order-2 lg:max-w-[90%] lg:w-full px-4 lg:pr-8 relative lg:rounded-md aspect-square lg:aspect-square overflow-hidden">
          <img
            className="object-cover w-full h-full cursor-pointer"
            alt="Product Image"
            src={product.details.product_img1}
            onClick={() => handleImageClick(product.details.product_img1, 0)}
          />
          <div className="absolute top-0 p-2 left-0 z-20 flex w-full lg:justify-end justify-between">
            <div className="p-2 cursor-pointer flex items-center justify-center rounded-full lg:hidden">
              <IoArrowBack
                onClick={() => router.back()}
                color="white"
                size={24}
              />
            </div>
            <div
              onClick={toggleWishlist}
              className="p-2 cursor-pointer justify-center items-center rounded-full"
            >
              {isInWishlist ? (
                <IoHeart size={20} className="fill-white" />
              ) : (
                <IoHeartOutline size={20} className="stroke-white" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="col-span-12 lg:sticky lg:top-0 lg:overflow-y-scroll max-h-screen lg:col-start-8 px-2 pt-3 lg:p-6 lg:pt-8 lg:col-end-12">
        <h1 className="font-bold mb-2 md:text-3xl">{product.details.product_name}</h1>
        <div className="relative">
          <p className="flex items-center text-xs gap-1">
            {Math.floor(product.average_r.average)}
            <span className="inline-block">
              <FaStar size={10} className="fill-[#FFF500]" />
            </span>
            <span className="text-xs bg-[#D9D9D9] px-1 rounded-sm py-[0.1rem]">
              {product.shopDetails.shop_name}
            </span>
          </p>
          <p className="absolute font-sans right-0 text-main font-semibold text-3xl top-0">
            ₦{parseInt(product.details.amount).toLocaleString()}
          </p>
        </div>

        <div className="mt-3">
          <h2 className="font-bold text-sm">Description</h2>
          <p className="text-sm">{product.details.product_desc}</p>
        </div>

        <div className="mt-3">
          <h2 className="font-bold text-sm mb-3">
            Reviews on seller <span className="opacity-60">({(product.reviews || []).length})</span>
          </h2>

          {product.reviews && product.reviews.length > 0 ? (
            <>
              {currentReviews.map(({ username, desc, rating, img }, index) => (
                <div
                  key={index}
                  className="my-4 border-b border-black py-2 border-opacity-10 flex gap-2"
                >
                  <div className="w-8 h-8 shrink-0 relative">
                    <img
                      className="rounded-full"
                      src={img}
                      alt="fan image"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{username}</p>
                    <p className="text-xs">{desc}</p>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: parseInt(rating) }).map((_, i) => (
                        <FaStar key={i} size={10} className="fill-[#FFF500]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 mb-6">
                  <button
                    onClick={handlePrevReviews}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 text-sm rounded-md ${
                      currentPage === 0
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-main text-white hover:bg-blue-700'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextReviews}
                    disabled={currentPage === totalPages - 1}
                    className={`px-4 py-2 text-sm rounded-md ${
                      currentPage === totalPages - 1
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-main text-white hover:bg-blue-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p>No reviews available</p>
          )}
        </div>

        <div className="flex flex-col">
          <p className="font-bold text-lg">Rate Product</p>
          <div className="flex gap-1 my-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <FaStar
                key={index}
                size={20}
                className={`${selectedRating > index ? 'fill-[#FFF500]' : 'fill-[#D9D9D9]'}`}
                onClick={() => handleRatingSelect(index + 1)}
                />
              ))}
            </div>
            <textarea
              className="border-black resize-none h-[97px] w-full border-opacity-60 border-[0.5px] rounded-xl p-2"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            ></textarea>
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
  
          <div className="w-full font-bold flex gap-1 mt-8 py-2">
            <Button
              className="px-4 shrink-0 text-xs"
              onClick={() => {
                window.location.href = `tel:${product.shopDetails.shop_whatsapp_link}`;
              }}
            >
              Call Seller
            </Button>
            <Button
              variant="outline"
              className="border-main px-4 py-2 flex items-center text-main text-xs shrink-0"
              onClick={() => {
                window.location.href = `https://wa.me/${product.shopDetails.shop_whatsapp_link}`;
              }}
            >
              <IoLogoWhatsapp
                size={22}
                className="fill-main mr-[0.1rem] inline-block align-middle"
              />
              Message on Whatsapp
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