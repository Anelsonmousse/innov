"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  IoArrowBack,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoInformationCircleOutline,
  IoStarSharp,
  IoStarHalfSharp,
  IoStarOutline,
  IoPencilOutline,
  IoTrashOutline,
} from "react-icons/io5"
import { FaStore, FaTag } from "react-icons/fa"
import axios from "axios"

export default function StoreProductPage() {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

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

  // Format price with commas
  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
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

        console.log("Fetching product with ID:", params.id)
        const response = await axios.get(`https://app.vplaza.com.ng/api/v1/products/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          setProduct(response.data.data)
          console.log("Product data received:", response.data.data)
        } else {
          console.error("Unexpected API response format:", response.data)
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

  // Handle product deletion
  const deleteProduct = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setDeleting(true)

      await axios.delete(`https://app.vplaza.com.ng/api/v1/products/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Show success message
      setSuccessMessage("Product deleted successfully")
      setShowSuccessMessage(true)

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/store/products")
      }, 1500)
    } catch (err) {
      console.error("Error deleting product:", err)
      alert(err.response?.data?.message || "Failed to delete product. Please try again.")
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
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

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scaleUp">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{product.name}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteProduct}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Deleting...
                    </>
                  ) : (
                    <>
                      <IoTrashOutline className="mr-1" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
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
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => router.push(`/store/products/edit/${params.id}`)}
              >
                <IoPencilOutline size={22} className="text-gray-700" />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <IoTrashOutline size={22} className="text-red-500" />
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
                <button
                  className="px-4 py-2 border border-[#004AAD] text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors flex items-center"
                  onClick={() => router.push(`/store/products/edit/${params.id}`)}
                >
                  <IoPencilOutline size={18} className="mr-2" />
                  Edit Product
                </button>
                <button
                  className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <IoTrashOutline size={18} className="mr-2" />
                  Delete Product
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
                      key={image.id || index}
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

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => router.push(`/store/products/edit/${params.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-white font-semibold transition-all bg-[#004AAD] hover:bg-[#0056c7] hover:shadow-md"
                >
                  <IoPencilOutline size={20} />
                  Edit Product
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex-1 py-3 px-6 rounded-xl border-2 border-red-500 text-red-500 font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                >
                  <IoTrashOutline size={20} />
                  Delete Product
                </button>
              </div>

              {/* Product Info */}
              <div className="mt-6 bg-blue-50 p-4 rounded-xl flex items-start gap-3">
                <IoInformationCircleOutline size={20} className="text-[#004AAD] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-[#004AAD]">Product Status:</span> Active and visible to all users.
                    Edit or delete this product using the buttons above.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Reviews</h2>
            </div>

            {/* Empty Reviews State */}
            <div className="bg-white rounded-xl p-6 text-center border border-gray-200">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <IoStarOutline size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h3>
              <p className="text-gray-500 mb-4">This product hasn't received any reviews yet.</p>
            </div>
          </div>
        </div>

        {/* Mobile Bottom Action Bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white py-3 px-4 flex items-center gap-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <button
            onClick={() => router.push(`/store/products/edit/${params.id}`)}
            className="flex-1 py-3 rounded-xl text-white font-semibold transition-all flex items-center justify-center bg-[#004AAD]"
          >
            <IoPencilOutline size={20} className="mr-2" />
            Edit Product
          </button>
        </div>
      </div>
    )
  }

  // Fallback
  return null
}
