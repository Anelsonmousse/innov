"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoStorefrontOutline,
  IoHomeOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoGridOutline,
  IoListOutline,
  IoStarSharp,
  IoStarHalfSharp,
  IoStarOutline,
  IoHeartSharp,
  IoRefreshOutline,
  IoMailOutline,
  IoLocationOutline,
  IoSchoolOutline,
  IoGlobeOutline,
  IoCheckmarkCircleOutline,
  IoChevronBackOutline,
  IoCloseOutline,
} from "react-icons/io5"

const CategoryProductsPage = () => {
  const router = useRouter()
  const params = useParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [sortBy, setSortBy] = useState("newest") // newest, price-low, price-high, popular
  const [showFilters, setShowFilters] = useState(false)
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pagination, setPagination] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  // Location selection state
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [universities, setUniversities] = useState([])
  const [loadingUniversities, setLoadingUniversities] = useState(false)
  const [universityError, setUniversityError] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Reset to default location when page loads
    setSelectedLocation(null)
  }, [])

  // Fetch universities when location modal is opened
  useEffect(() => {
    if (showLocationModal && universities.length === 0 && !loadingUniversities) {
      fetchUniversities()
    }

    // Focus search input when modal opens
    if (showLocationModal && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus()
      }, 100)
    }
  }, [showLocationModal])

  // Fetch universities from API
  const fetchUniversities = async () => {
    try {
      setLoadingUniversities(true)
      setUniversityError(null)

      const response = await axios.get("https://app.vplaza.com.ng/api/v1/universities")

      if (response.data && response.data.data) {
        setUniversities(response.data.data)
      } else {
        setUniversityError("Unexpected API response format")
      }
    } catch (err) {
      console.error("Error fetching universities:", err)
      setUniversityError("Failed to load universities. Please try again later.")
    } finally {
      setLoadingUniversities(false)
    }
  }

  // Handle university selection
  const handleSelectUniversity = (university) => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    const newLocation = {
      id: university.id,
      name: university.name,
      type: "university",
    }

    setSelectedLocation(newLocation)

    // Close the modal
    setShowLocationModal(false)

    // Reset to page 1 when changing location
    setCurrentPage(1)

    // Fetch products from the selected university with the current category
    fetchProductsByLocationAndCategory(university.id, params.id, 1)
  }

  // Handle selecting current location (country-based)
  const handleSelectCurrentLocation = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    // Clear selected location to use default
    setSelectedLocation(null)

    // Close the modal
    setShowLocationModal(false)

    // Reset to page 1 when changing location
    setCurrentPage(1)

    // Fetch products with default URL (just category)
    fetchProductsByCategory(params.id, 1)
  }

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

  // Fetch products by category ID
  const fetchProductsByCategory = async (categoryId, page = 1) => {
    if (!categoryId) return

    try {
      setLoading(true)
      setError(null)

      // Get token for authenticated requests
      const token = localStorage.getItem("token")
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}

      // Fetch products by category ID with pagination
      const response = await axios.get(
        `https://app.vplaza.com.ng/api/v1/products/category/${categoryId}?page=${page}`,
        config,
      )

      if (response.data && response.data.data) {
        setProducts(response.data.data)

        // Store pagination information
        setPagination({
          links: response.data.links,
          meta: response.data.meta,
        })

        // If we have products, set the category name from the first product
        if (response.data.data.length > 0) {
          setCategory({
            name: response.data.data[0].category,
            id: categoryId,
          })
        }
      } else {
        setError("Unexpected API response format")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.response?.data?.message || "Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch products by university and category
  const fetchProductsByLocationAndCategory = async (universityId, categoryId, page = 1) => {
    if (!universityId || !categoryId) return

    try {
      setLoading(true)
      setError(null)

      // Get token for authenticated requests
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      const config = { headers: { Authorization: `Bearer ${token}` } }

      // Fetch products by university and category with pagination
      const response = await axios.get(
        `https://app.vplaza.com.ng/api/v1/products/university/${universityId}/category/${categoryId}?page=${page}`,
        config,
      )

      if (response.data && response.data.data) {
        setProducts(response.data.data)

        // Store pagination information
        setPagination({
          links: response.data.links,
          meta: response.data.meta,
        })

        // If we have products, set the category name from the first product
        if (response.data.data.length > 0) {
          setCategory({
            name: response.data.data[0].category,
            id: categoryId,
          })
        }
      } else {
        setError("Unexpected API response format")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.response?.data?.message || "Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Fetch products based on current state
  useEffect(() => {
    if (!params.id) return

    if (selectedLocation && selectedLocation.type === "university") {
      fetchProductsByLocationAndCategory(selectedLocation.id, params.id, currentPage)
    } else {
      fetchProductsByCategory(params.id, currentPage)
    }
  }, [params.id, currentPage, selectedLocation])

  // Fetch wishlist items
  useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const response = await axios.get("https://app.vplaza.com.ng/api/v1/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          // Store just the IDs for easier checking
          const wishlistIds = response.data.data.map((item) => item.id)
          setWishlistItems(wishlistIds)
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err)
      }
    }

    if (isLoggedIn) {
      fetchWishlistItems()
    }
  }, [isLoggedIn])

  // Sort products based on sortBy state
  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number.parseFloat(a.price) - Number.parseFloat(b.price)
      case "price-high":
        return Number.parseFloat(b.price) - Number.parseFloat(a.price)
      case "popular":
        return (b.average_rating || 0) - (a.average_rating || 0)
      case "newest":
      default:
        // Assuming newer products have higher IDs or using created_at if available
        return b.id.localeCompare(a.id)
    }
  })

  // Add this helper function to check login and redirect if needed
  const checkLoginAndRedirect = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      router.push("/signin")
      return false
    }
    return true
  }

  // Handle product click - navigate to product detail page
  const handleProductClick = (e, productId) => {
    if (checkLoginAndRedirect(e)) {
      router.push(`/product/${productId}`)
    }
  }

  // Toggle wishlist status for a product
  const toggleWishlist = async (e, productId) => {
    e.stopPropagation() // Prevent navigating to product detail

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    setWishlistLoading(productId)

    try {
      if (wishlistItems.includes(productId)) {
        // Remove from wishlist
        const response = await axios.delete(`https://app.vplaza.com.ng/api/v1/wishlist/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 200 || response.status === 201) {
          setWishlistItems(wishlistItems.filter((id) => id !== productId))
        }
      } else {
        // Add to wishlist
        const response = await axios.post(
          "https://app.vplaza.com.ng/api/v1/wishlist",
          { product_id: productId },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (response.status === 200 || response.status === 201) {
          setWishlistItems([...wishlistItems, productId])
        }
      }
    } catch (err) {
      console.error("Error updating wishlist:", err)
    } finally {
      setWishlistLoading(false)
    }
  }

  // Handle page change
  const handlePageChange = (page) => {
    if (page !== currentPage) {
      setCurrentPage(page)
      // Scroll to top when changing pages
      window.scrollTo(0, 0)
    }
  }

  // Filter universities based on search query
  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase()),
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
        <span className="text-xs text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={() => setShowLocationModal(false)} className="mr-2 p-1 rounded-full hover:bg-gray-100">
                  <IoChevronBackOutline size={20} className="text-gray-700" />
                </button>
                <h3 className="text-lg font-semibold">Select Location</h3>
              </div>
              <button onClick={() => setShowLocationModal(false)} className="p-1 rounded-full hover:bg-gray-100">
                <IoCloseOutline size={24} className="text-gray-700" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <IoSearchOutline
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-y-auto flex-1">
              {/* Current Location Option */}
              <div
                className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                onClick={handleSelectCurrentLocation}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <IoGlobeOutline size={20} className="text-[#004AAD]" />
                  </div>
                  <div>
                    <p className="font-medium">Current Location</p>
                    <p className="text-sm text-gray-500">Products from Nigeria</p>
                  </div>
                </div>
                {!selectedLocation && <IoCheckmarkCircleOutline size={20} className="text-[#004AAD]" />}
              </div>

              {/* Universities List */}
              {loadingUniversities ? (
                <div className="p-8 text-center">
                  <div className="w-10 h-10 border-2 border-[#004AAD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading universities...</p>
                </div>
              ) : universityError ? (
                <div className="p-8 text-center">
                  <p className="text-red-500 mb-4">{universityError}</p>
                  <button onClick={fetchUniversities} className="px-4 py-2 bg-[#004AAD] text-white rounded-lg text-sm">
                    Retry
                  </button>
                </div>
              ) : filteredUniversities.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No universities found matching "{searchQuery}"</p>
                </div>
              ) : (
                filteredUniversities.map((university) => (
                  <div
                    key={university.id}
                    className="p-4 border-b border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectUniversity(university)}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <IoSchoolOutline size={20} className="text-[#004AAD]" />
                      </div>
                      <div>
                        <p className="font-medium">{university.name}</p>
                        <p className="text-sm text-gray-500">{university.country}</p>
                      </div>
                    </div>
                    {selectedLocation && selectedLocation.id === university.id && (
                      <IoCheckmarkCircleOutline size={20} className="text-[#004AAD]" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800 capitalize">
            {category ? category.name : "Category Products"}
          </h1>
          <div
            className="ml-auto flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
            onClick={(e) => {
              if (checkLoginAndRedirect(e)) {
                setShowLocationModal(true)
              }
            }}
          >
            <IoLocationOutline size={20} className="text-gray-700" />
            {selectedLocation && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#004AAD] rounded-full"></span>}
          </div>
        </div>

        {/* Selected Location Indicator - Mobile */}
        {selectedLocation && (
          <div className="mt-2 px-3 py-1.5 bg-blue-50 rounded-full flex items-center justify-between">
            <div className="flex items-center">
              <IoSchoolOutline size={16} className="text-[#004AAD] mr-1.5" />
              <span className="text-xs text-[#004AAD] font-medium truncate max-w-[200px]">{selectedLocation.name}</span>
            </div>
            <button onClick={handleSelectCurrentLocation} className="ml-2 text-xs text-[#004AAD] font-medium">
              Clear
            </button>
          </div>
        )}
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800 capitalize">
              {category ? category.name : "Category Products"}
            </h1>
            <div
              className="ml-auto flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#004AAD] transition-colors relative"
              onClick={(e) => {
                if (checkLoginAndRedirect(e)) {
                  setShowLocationModal(true)
                }
              }}
            >
              <IoLocationOutline size={20} />
              <span className="text-sm">
                {selectedLocation ? (
                  <span className="flex items-center">
                    <span className="truncate max-w-[120px]">{selectedLocation.name}</span>
                    <span className="ml-1 text-xs text-[#004AAD] font-medium">(Change)</span>
                  </span>
                ) : (
                  "Location"
                )}
              </span>
              {selectedLocation && <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#004AAD] rounded-full"></span>}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Location and Filter Info */}
        {selectedLocation && (
          <div className="mb-4 flex flex-wrap gap-2">
            <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-[#004AAD] rounded-full text-sm">
              <IoSchoolOutline size={16} className="mr-1.5" />
              <span className="font-medium">{selectedLocation.name}</span>
              <button onClick={handleSelectCurrentLocation} className="ml-2 hover:bg-blue-100 rounded-full p-0.5">
                <IoCloseOutline size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search in this category..."
              className="w-full py-2.5 pl-10 pr-4 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
            />
            <IoSearchOutline size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>

          <div className="flex items-center ml-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
            >
              <IoFilterOutline size={22} className="text-gray-700" />
              {showFilters && <span className="absolute top-0 right-0 w-2 h-2 bg-[#004AAD] rounded-full"></span>}
            </button>
            <div className="ml-2 flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid" ? "bg-[#004AAD] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IoGridOutline size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list" ? "bg-[#004AAD] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <IoListOutline size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Options - Conditionally Rendered */}
        {showFilters && (
          <div className="bg-white p-4 rounded-xl shadow-sm mb-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-800">Sort By</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => setSortBy("newest")}
                className={`py-2 px-3 rounded-lg text-sm ${
                  sortBy === "newest" ? "bg-[#004AAD] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => setSortBy("popular")}
                className={`py-2 px-3 rounded-lg text-sm ${
                  sortBy === "popular" ? "bg-[#004AAD] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Most Popular
              </button>
              <button
                onClick={() => setSortBy("price-low")}
                className={`py-2 px-3 rounded-lg text-sm ${
                  sortBy === "price-low" ? "bg-[#004AAD] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setSortBy("price-high")}
                className={`py-2 px-3 rounded-lg text-sm ${
                  sortBy === "price-high" ? "bg-[#004AAD] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Price: High to Low
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[...Array(8)].map((_, index) => (
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

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center justify-between">
            <p>{error}</p>
            <button
              onClick={() => {
                if (selectedLocation) {
                  fetchProductsByLocationAndCategory(selectedLocation.id, params.id, currentPage)
                } else {
                  fetchProductsByCategory(params.id, currentPage)
                }
              }}
              className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
            >
              <IoRefreshOutline size={18} className="mr-1" />
              Retry
            </button>
          </div>
        )}

        {/* No Products Found */}
        {!loading && !error && sortedProducts.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <IoStorefrontOutline size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-500 mb-6">
              {selectedLocation
                ? `We couldn't find any products in this category at ${selectedLocation.name}.`
                : "We couldn't find any products in this category."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors"
              >
                <IoArrowBack size={18} className="mr-2" />
                Go Back
              </button>
              {selectedLocation && (
                <button
                  onClick={handleSelectCurrentLocation}
                  className="inline-flex items-center px-4 py-2 bg-white border border-[#004AAD] text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <IoGlobeOutline size={18} className="mr-2" />
                  View All Products
                </button>
              )}
            </div>
          </div>
        )}

        {/* Products Grid View */}
        {!loading && !error && sortedProducts.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                onClick={(e) => handleProductClick(e, product.id)}
              >
                <div className="relative">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? fixImageUrl(product.images[0].url)
                        : "/diverse-products-still-life.png"
                    }
                    alt={product.name}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/diverse-products-still-life.png"
                    }}
                  />
                  <button
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                    onClick={(e) => toggleWishlist(e, product.id)}
                    disabled={wishlistLoading === product.id}
                  >
                    {wishlistLoading === product.id ? (
                      <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : wishlistItems.includes(product.id) ? (
                      <IoHeartSharp size={18} className="text-red-500" />
                    ) : (
                      <IoHeartOutline size={18} className="text-gray-700" />
                    )}
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
                  <p className="text-[#004AAD] font-bold mb-1">{formatPrice(product.price)}</p>
                  <RatingStars rating={product.average_rating || 0} />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 truncate max-w-[70%]">Store: {product.store}</p>
                    <button
                      className="text-xs bg-[#004AAD]/10 text-[#004AAD] px-2 py-1 rounded-full font-medium hover:bg-[#004AAD]/20 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleProductClick(e, product.id)
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products List View */}
        {!loading && !error && sortedProducts.length > 0 && viewMode === "list" && (
          <div className="space-y-4">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                onClick={(e) => handleProductClick(e, product.id)}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-48 h-40">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? fixImageUrl(product.images[0].url)
                          : "/diverse-products-still-life.png"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/diverse-products-still-life.png"
                      }}
                    />
                    <button
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                      onClick={(e) => toggleWishlist(e, product.id)}
                      disabled={wishlistLoading === product.id}
                    >
                      {wishlistLoading === product.id ? (
                        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : wishlistItems.includes(product.id) ? (
                        <IoHeartSharp size={18} className="text-red-500" />
                      ) : (
                        <IoHeartOutline size={18} className="text-gray-700" />
                      )}
                    </button>
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800 mb-1">{product.name}</h3>
                        <p className="text-[#004AAD] font-bold mb-2">{formatPrice(product.price)}</p>
                        <RatingStars rating={product.average_rating || 0} />
                      </div>
                      <button
                        className="text-sm bg-[#004AAD]/10 text-[#004AAD] px-3 py-1 rounded-full font-medium hover:bg-[#004AAD]/20 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleProductClick(e, product.id)
                        }}
                      >
                        View
                      </button>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {product.description || "No description available"}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Store: {product.store}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && pagination && pagination.meta && pagination.meta.last_page > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-1">
              {/* Previous Page Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              {pagination.meta.links
                .filter((link) => !link.label.includes("Previous") && !link.label.includes("Next"))
                .map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(Number.parseInt(link.label))}
                    className={`px-3 py-1 rounded-md ${
                      link.active ? "bg-[#004AAD] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}

              {/* Next Page Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.meta.last_page}
                className={`px-3 py-1 rounded-md ${
                  currentPage === pagination.meta.last_page
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && sortedProducts.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            {pagination && pagination.meta ? (
              <span>
                Showing {pagination.meta.from} to {pagination.meta.to} of {pagination.meta.total} products
              </span>
            ) : (
              <span>Showing {sortedProducts.length} products</span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#004AAD] text-white py-2 px-4 flex items-center justify-between z-20 shadow-lg">
        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/store")}
        >
          <IoStorefrontOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Store</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/request")}
        >
          <IoMailOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Request</span>
        </button>

        <button className="flex flex-col items-center justify-center -mt-6 relative" onClick={() => router.push("/")}>
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-[#004AAD]">
            <IoHomeOutline size={26} className="text-[#004AAD]" />
          </div>
          <span className="text-[10px] mt-1 font-light">Home</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors relative"
          onClick={() => router.push("/notifications")}
        >
          <div className="relative">
            <IoNotificationsOutline size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-[10px] mt-1 font-light">Alerts</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/profile")}
        >
          <IoPersonOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Profile</span>
        </button>
      </div>
    </div>
  )
}

export default CategoryProductsPage
