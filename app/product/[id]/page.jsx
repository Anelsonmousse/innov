"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoHeartOutline,
  IoShareOutline,
  IoStarSharp,
  IoStarHalfSharp,
  IoStarOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCallOutline,
  IoLogoWhatsapp,
  IoInformationCircleOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoStorefrontOutline,
  IoSendOutline,
  IoPersonCircleOutline,
  IoTimeOutline,
  IoHeartSharp,
} from "react-icons/io5"
import { FaStore, FaTag } from "react-icons/fa"

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewError, setReviewError] = useState(null)
  const [userRating, setUserRating] = useState(0)
  const [userComment, setUserComment] = useState("")
  const [submittingReview, setSubmittingReview] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)

  // Add these state variables inside the component
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Fix image URL by removing the first https:// if there are two
  const fixImageUrl = (url) => {
    if (!url) return "/diverse-products-still-life.png"

    // Check if the URL contains a double https://
    const doubleHttpsIndex = url.indexOf("https://", url.indexOf("https://") + 1)

    if (doubleHttpsIndex !== -1) {
      // Return only the part from the second https:// onwards
      return url.substring(doubleHttpsIndex)
    }

    return url
  }

  // Format phone number for WhatsApp link
  const formatWhatsAppNumber = (phoneNumber) => {
    if (!phoneNumber) return ""

    // Remove any non-digit characters
    const digitsOnly = phoneNumber.replace(/\D/g, "")

    // If the number doesn't start with a country code, add Nigeria's code (234)
    if (digitsOnly.startsWith("0")) {
      return "234" + digitsOnly.substring(1)
    } else if (!digitsOnly.startsWith("234")) {
      return "234" + digitsOnly
    }

    return digitsOnly
  }

  // Generate WhatsApp message link
  const generateWhatsAppLink = (phoneNumber, productName) => {
    const formattedNumber = formatWhatsAppNumber(phoneNumber)
    const message = encodeURIComponent(`Hello, I'm interested in your product: ${productName} i saw on Vplaza for ${product.price} `)
    return `https://wa.me/${formattedNumber}?text=${message}`
  }

  // Check if user is logged in and redirect if not
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    }
  }, [router])

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.id) return

      const token = localStorage.getItem("token")
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`https://app.vplaza.com.ng/api/v1/products/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          setProduct(response.data.data)
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err.response?.data?.message || "Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [params.id, router])

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!params.id) return

      const token = localStorage.getItem("token")
      if (!token) return

      try {
        setLoadingReviews(true)
        setReviewError(null)

        const response = await axios.get(`https://app.vplaza.com.ng/api/v1/reviews/product/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          setReviews(response.data.data)
        } else {
          setReviewError("Failed to load reviews")
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
        setReviewError("Failed to load reviews. Please try again later.")
      } finally {
        setLoadingReviews(false)
      }
    }

    if (!loading && product) {
      fetchReviews()
    }
  }, [params.id, loading, product])

  // Add this effect to check if product is in wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!product || !product.id) return

      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const response = await axios.get("https://app.vplaza.com.ng/api/v1/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          const isProductInWishlist = response.data.data.some((item) => item.id === product.id)
          setIsInWishlist(isProductInWishlist)
        }
      } catch (err) {
        console.error("Error checking wishlist status:", err)
      }
    }

    checkWishlistStatus()
  }, [product])

  // Format price with commas
  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  // Handle image navigation
  const nextImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1))
    }
  }

  const prevImage = () => {
    if (product?.images?.length > 0) {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1))
    }
  }

  // Handle WhatsApp message
  const handleMessageSeller = () => {
    if (!product || !product.user || !product.user.phone) return

    // No need to simulate - we'll directly open WhatsApp
    window.open(generateWhatsAppLink(product.user.phone, product.name), "_blank")
  }

  // Add this function to toggle wishlist status
  const toggleWishlist = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setWishlistLoading(true)

      if (isInWishlist) {
        // Remove from wishlist
        const response = await axios.delete(`https://app.vplaza.com.ng/api/v1/wishlist/${product.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 200 || response.status === 201) {
          setIsInWishlist(false)
          setSuccessMessage("Removed from wishlist")
          setShowSuccessMessage(true)
        }
      } else {
        // Add to wishlist
        const response = await axios.post(
          "https://app.vplaza.com.ng/api/v1/wishlist",
          { product_id: product.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.status === 200 || response.status === 201) {
          setIsInWishlist(true)
          setSuccessMessage("Added to wishlist")
          setShowSuccessMessage(true)
        }
      }

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 3000)
    } catch (err) {
      console.error("Error updating wishlist:", err)
      alert(err.response?.data?.message || "Failed to update wishlist. Please try again.")
    } finally {
      setWishlistLoading(false)
    }
  }

  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault()

    if (userRating === 0) {
      alert("Please select a rating")
      return
    }

    if (!userComment.trim()) {
      alert("Please enter a comment")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setSubmittingReview(true)

      const response = await axios.post(
        "https://app.vplaza.com.ng/api/v1/reviews",
        {
          product_id: params.id,
          rating: userRating,
          comment: userComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data && response.data.data) {
        // Add the new review to the reviews list
        setReviews([response.data.data, ...reviews])

        // Reset form
        setUserRating(0)
        setUserComment("")
        setShowReviewForm(false)

        // Show success message
        setSuccessMessage("Review submitted successfully!")
        setShowSuccessMessage(true)

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 3000)
      }
    } catch (err) {
      console.error("Error submitting review:", err)
      alert(err.response?.data?.message || "Failed to submit review. Please try again later.")
    } finally {
      setSubmittingReview(false)
    }
  }

  // Rating stars component
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <IoStarSharp key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <IoStarHalfSharp className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <IoStarOutline key={`empty-${i}`} className="text-yellow-400" />
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  // Interactive rating selector component
  const RatingSelector = ({ rating, setRating }) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className="text-2xl focus:outline-none transition-colors"
          >
            {star <= rating ? (
              <IoStarSharp className="text-yellow-400" />
            ) : (
              <IoStarOutline className="text-gray-300 hover:text-yellow-200" />
            )}
          </button>
        ))}
      </div>
    )
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-10">
        {/* Top Header - Mobile */}
        <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Product Details</h1>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center py-4">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
              >
                <IoArrowBack size={20} />
                <span className="ml-1">Back</span>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Product Details</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Image Section - Skeleton */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              <div className="bg-gray-200 rounded-2xl w-full h-80 lg:h-96 animate-pulse"></div>
              <div className="flex justify-center mt-4 gap-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* Details Section - Skeleton */}
            <div className="lg:w-1/2">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>

              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-6 animate-pulse"></div>

              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6 animate-pulse"></div>

              <div className="h-12 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <IoAlertCircleOutline size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">Error Loading Product</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // If product data is loaded
  if (product) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-10">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp">
            <IoCheckmarkCircle className="text-green-500 mr-2" size={20} />
            <span>{successMessage || "Action completed successfully!"}</span>
          </div>
        )}

        {/* Top Header - Mobile */}
        <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="text-lg font-semibold text-gray-800">Product Details</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <IoShareOutline size={22} className="text-gray-700" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={toggleWishlist}
                disabled={wishlistLoading}
              >
                {wishlistLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                ) : isInWishlist ? (
                  <IoHeartSharp size={22} className="text-red-500" />
                ) : (
                  <IoHeartOutline size={22} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <button
                  onClick={() => router.back()}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
                >
                  <IoArrowBack size={20} />
                  <span className="ml-1">Back</span>
                </button>
                <h1 className="ml-4 text-xl font-semibold text-gray-800">Product Details</h1>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-gray-700">
                  <IoShareOutline size={20} />
                  <span className="ml-1">Share</span>
                </button>
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-gray-700"
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                >
                  {wishlistLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                  ) : isInWishlist ? (
                    <IoHeartSharp size={20} className="text-red-500" />
                  ) : (
                    <IoHeartOutline size={20} className="text-gray-700" />
                  )}
                  <span className="ml-1">Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:gap-8">
            {/* Image Section */}
            <div className="lg:w-1/2 mb-6 lg:mb-0">
              {/* Main Image with Navigation */}
              <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm">
                <img
                  src={
                    product.images && product.images.length > 0
                      ? fixImageUrl(product.images[currentImageIndex].url)
                      : "/diverse-products-still-life.png"
                  }
                  alt={product.name}
                  className="w-full h-80 lg:h-96 object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/diverse-products-still-life.png"
                  }}
                />

                {/* Image Navigation Arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <IoChevronBackOutline size={24} className="text-gray-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-md hover:bg-white transition-colors"
                    >
                      <IoChevronForwardOutline size={24} className="text-gray-700" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex justify-center mt-4 gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 ${
                        currentImageIndex === index ? "border-[#004AAD]" : "border-transparent"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={fixImageUrl(image.url) || "/placeholder.svg"}
                        alt={`${product.name} - view ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/diverse-products-still-life.png"
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="lg:w-1/2">
              {/* Product Name and Price */}
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
              <p className="text-2xl font-bold text-[#004AAD] mb-4">{formatPrice(product.price)}</p>

              {/* Rating */}
              <div className="mb-4">
                <RatingStars rating={product.average_rating || 0} />
              </div>

              {/* Store and Category */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <FaStore className="text-[#004AAD] mr-2" />
                  <span className="text-sm font-medium">{product.store}</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></div>
                <div className="flex items-center text-gray-700">
                  <FaTag className="text-[#004AAD] mr-2" />
                  <span className="text-sm font-medium capitalize">{product.category}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
                </div>
              </div>

              {/* Seller Information - Now Clickable */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Seller Information</h2>
                <div
                  className="bg-white p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => window.open(generateWhatsAppLink(product.user.phone, product.name), "_blank")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                      <IoStorefrontOutline size={24} className="text-[#004AAD]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{product.store}</p>
                      <p className="text-xs text-gray-500">View all seller's products</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={generateWhatsAppLink(product.user.phone, product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold transition-all bg-[#25D366] hover:bg-[#1fb959] hover:shadow-md"
                >
                  <IoLogoWhatsapp size={20} />
                  Message Seller
                </a>
                <button className="flex-1 py-3 px-6 rounded-xl border-2 border-[#004AAD] text-[#004AAD] font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                  <IoCallOutline size={20} />
                  Call Seller
                </button>
              </div>

              {/* Delivery Information */}
              <div className="mt-6 bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                <IoInformationCircleOutline size={20} className="text-[#004AAD] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-[#004AAD]">Safety Tip:</span> Please inspect the product
                    physically before making any payment to ensure it meets your expectations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors text-sm font-medium"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 animate-fadeIn">
                <h3 className="text-lg font-medium text-gray-800 mb-3">Your Review</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <RatingSelector rating={userRating} setRating={setUserRating} />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      rows="3"
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                      required
                    ></textarea>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                        submittingReview ? "bg-gray-400 cursor-not-allowed" : "bg-[#004AAD] hover:bg-[#0056c7]"
                      }`}
                    >
                      {submittingReview ? (
                        <>
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <IoSendOutline />
                          Submit Review
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="animate-pulse flex justify-center items-center">
                  <div className="h-4 w-4 bg-blue-400 rounded-full mr-2"></div>
                  <div className="h-4 w-4 bg-blue-400 rounded-full mr-2 animate-pulse-delay-200"></div>
                  <div className="h-4 w-4 bg-blue-400 rounded-full animate-pulse-delay-400"></div>
                </div>
                <p className="mt-2 text-gray-500">Loading reviews...</p>
              </div>
            ) : reviewError ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
                <p>{reviewError}</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <IoStarOutline size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h3>
                <p className="text-gray-500 mb-4">Be the first to review this product!</p>
                {!showReviewForm && (
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors text-sm font-medium"
                  >
                    Write a Review
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <IoPersonCircleOutline size={20} className="text-[#004AAD]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{review.user.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="text-sm">
                                {i < review.rating ? (
                                  <IoStarSharp className="text-yellow-400" />
                                ) : (
                                  <IoStarOutline className="text-gray-300" />
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <IoTimeOutline className="mr-1" />
                        <span>{review.created_at}</span>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white py-3 px-4 flex items-center gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <a
            href={`tel:${product.user.phone}`}
            className="w-12 h-12 rounded-full border-2 border-[#004AAD] flex items-center justify-center"
          >
            <IoCallOutline size={22} className="text-[#004AAD]" />
          </a>
          <a
            href={generateWhatsAppLink(product.user.phone, product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center bg-[#25D366]"
          >
            <IoLogoWhatsapp size={20} className="mr-2" />
            Message on WhatsApp
          </a>
        </div>
      </div>
    )
  }

  // Fallback
  return null
}
