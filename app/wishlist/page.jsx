"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoHeartSharp,
  IoSearchOutline,
  IoStarSharp,
  IoStarHalfSharp,
  IoStarOutline,
  IoEyeOutline,
  IoCheckmarkCircle,
  IoHeartDislikeOutline,
} from "react-icons/io5"

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingItemId, setRemovingItemId] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

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

  // Check if user is logged in and redirect if not
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    }
  }, [router])

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("https://app.vplaza.com.ng/api/v1/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          setWishlistItems(response.data.data)
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err)
        setError(err.response?.data?.message || "Failed to load wishlist. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchWishlistItems()
  }, [router])

  // Format price with commas
  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  // Handle removing item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      setRemovingItemId(productId)

      const response = await axios.delete(`https://app.vplaza.com.ng/api/v1/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200 || response.status === 201) {
        // Remove the item from the local state
        setWishlistItems(wishlistItems.filter((item) => item.id !== productId))

        // Show success message
        setSuccessMessage("Item removed from wishlist")
        setShowSuccessMessage(true)

        // Hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 3000)
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      alert(err.response?.data?.message || "Failed to remove item from wishlist. Please try again.")
    } finally {
      setRemovingItemId(null)
    }
  }

  // Handle view product details
  const handleViewProduct = (productId) => {
    router.push(`/product/${productId}`)
  }

  // Filter wishlist items based on search query
  const filteredWishlistItems = wishlistItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.store.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Rating stars component
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <IoStarSharp key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {hasHalfStar && <IoStarHalfSharp className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <IoStarOutline key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
        <span className="text-xs text-gray-600 ml-1">{rating}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-10">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp">
          <IoCheckmarkCircle className="text-green-500 mr-2" size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">My Wishlist</h1>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">My Wishlist</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search your wishlist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
          />
          <IoSearchOutline size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                <div className="w-full h-40 bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty Wishlist */}
        {!loading && wishlistItems.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <IoHeartDislikeOutline size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">Your Wishlist is Empty</h3>
            <p className="text-gray-500 mb-6">You haven't added any products to your wishlist yet.</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-[#004AAD] text-white rounded-xl hover:bg-[#0056c7] transition-colors"
            >
              Explore Products
            </button>
          </div>
        )}

        {/* Wishlist Items */}
        {!loading && wishlistItems.length > 0 && (
          <>
            {/* Wishlist Count */}
            <div className="mb-4">
              <p className="text-gray-600">
                {filteredWishlistItems.length} {filteredWishlistItems.length === 1 ? "item" : "items"} in your wishlist
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>

            {/* Wishlist Grid */}
            {filteredWishlistItems.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {filteredWishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                  >
                    <div className="relative">
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? fixImageUrl(item.images[0].url)
                            : "/placeholder.svg?height=200&width=200&query=product"
                        }
                        alt={item.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/diverse-products-still-life.png"
                        }}
                      />
                      <button
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        disabled={removingItemId === item.id}
                      >
                        {removingItemId === item.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <IoHeartSharp size={18} className="text-red-500" />
                        )}
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-gray-800 mb-1 truncate">{item.name}</h3>
                      <p className="text-[#004AAD] font-bold mb-1">{formatPrice(item.price)}</p>
                      <RatingStars rating={item.average_rating || 0} />
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-gray-500 truncate max-w-[70%]">Store: {item.store}</p>
                        <button
                          className="text-xs bg-[#004AAD]/10 text-[#004AAD] px-2 py-1 rounded-full font-medium hover:bg-[#004AAD]/20 transition-colors flex items-center gap-1"
                          onClick={() => handleViewProduct(item.id)}
                        >
                          <IoEyeOutline size={14} />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <IoSearchOutline size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No Matching Items</h3>
                <p className="text-gray-500 mb-4">No items in your wishlist match your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
