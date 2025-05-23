"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoStorefrontOutline,
  IoSearchOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoChevronForwardOutline,
  IoLocationOutline,
  IoStarSharp,
  IoStarHalfSharp,
  IoStarOutline,
  IoHomeSharp,
  IoMailOutline,
  IoCloseOutline,
  IoInformationCircleOutline,
  IoDownloadOutline,
  IoShareOutline,
  IoRefreshOutline,
  IoHeartSharp,
  IoSchoolOutline,
  IoCheckmarkCircleOutline,
  IoChevronBackOutline,
  IoGlobeOutline,
  IoFilterOutline,
  IoRestaurantOutline,
  IoTimeOutline,
} from "react-icons/io5"

const HomePage = () => {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [nextPageUrl, setNextPageUrl] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Location selection state
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [universities, setUniversities] = useState([])
  const [loadingUniversities, setLoadingUniversities] = useState(false)
  const [universityError, setUniversityError] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)

  // Food category ID
  const FOOD_CATEGORY_ID = "0196f23e-a0e8-7201-a8d3-42042967e78e"

  // Hardcoded categories
  const categories = [
    {
      id: "0196f23e-f015-719a-846a-1d602ee50705",
      name: "Gadgets",
      subtitle: "Hardware Technologies",
      count: "23 Products",
      image: "/gadget-image.jpg",
    },
    {
      id: FOOD_CATEGORY_ID,
      name: "Food",
      subtitle: "Nurishing",
      count: "23 Items",
      image: "/food-image.jpg",
    },
    {
      id: "90890ab0-4e75-40fa-abcc-3fea9b651360",
      name: "Women",
      subtitle: "Quality",
      count: "23 Items",
      image: "/diverse-clothing-rack.png",
    },
    {
      id: "941ed023-1ec9-4f17-afe5-a2c5b504fa4d",
      name: "Perfume",
      subtitle: "Fragrance",
      count: "15 Items",
      image: "/perfume-image.jpg",
    },
  ]

  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)

  // Add a new state for the selected category
  const [selectedCategory, setSelectedCategory] = useState(null)

  // Search state
  const [searchKeyword, setSearchKeyword] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Reset to default location when page loads
    setSelectedLocation(null)
  }, [])

  // Check if the app can be installed (PWA)
  useEffect(() => {
    // Detect iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)

    // For non-iOS devices, listen for beforeinstallprompt
    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault()
        // Stash the event so it can be triggered later
        setDeferredPrompt(e)
        // Show the install prompt after a delay
        setTimeout(() => {
          setShowInstallPrompt(true)
        }, 3000)
      }

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      }
    } else {
      // For iOS, just show the install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true)
      }, 3000)
    }
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

    setSelectedLocation({
      id: university.id,
      name: university.name,
      type: "university",
    })

    // Reset category selection when changing university
    setSelectedCategory(null)

    // Close the modal
    setShowLocationModal(false)

    // Fetch products from the selected university with authentication token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    fetchProducts(`https://app.vplaza.com.ng/api/v1/products/university/${university.id}/regular`, config)
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
    // Reset category selection
    setSelectedCategory(null)

    // Close the modal
    setShowLocationModal(false)

    // Fetch products with default URL and authentication token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    fetchProducts(null, config)
  }

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

  // Handle PWA installation
  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      // We've used the prompt, and can't use it again, so clear it
      setDeferredPrompt(null)
    }
    // Hide the install prompt regardless of outcome
    setShowInstallPrompt(false)
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

  // Update the fetchProducts function to handle category filtering
  const fetchProducts = async (url = null, customConfig = null) => {
    try {
      setLoading(true)
      setError(null)

      // Determine which URL to use based on login status, selected location, and selected category
      const token = localStorage.getItem("token")
      const isUserLoggedIn = !!token

      // If no specific URL is provided, use the appropriate default based on login status and selected location
      if (!url) {
        if (selectedLocation && selectedLocation.type === "university") {
          if (selectedCategory) {
            // If both university and category are selected, use the combined endpoint
            url = `https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/category/${selectedCategory.id}`
          } else {
            url = `https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/regular`
          }
        } else {
          url = isUserLoggedIn
            ? "https://app.vplaza.com.ng/api/v1/products/type/regular"
            : "https://app.vplaza.com.ng/api/v1/products/country/Nigeria"
        }
      }

      // Set up request config with headers if logged in
      const config = customConfig || {}
      if (!customConfig && isUserLoggedIn) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        }
      }

      const response = await axios.get(url, config)

      if (response.data && response.data.data) {
        setProducts(response.data.data)
        setNextPageUrl(response.data.links.next)
      } else {
        setError("Unexpected API response format")
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Failed to load products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Search products using the search endpoint
  const searchProducts = async () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setIsSearching(true)

      // Build query parameters
      const params = new URLSearchParams()
      if (searchKeyword.trim()) {
        params.append("keyword", searchKeyword.trim())
      }
      if (minPrice) {
        params.append("min_price", minPrice)
      }
      if (maxPrice) {
        params.append("max_price", maxPrice)
      }

      const url = `https://app.vplaza.com.ng/api/v1/products/search?${params.toString()}`

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && response.data.data) {
        setSearchResults(response.data.data)
        setNextPageUrl(response.data.links?.next || null)
      } else {
        setError("Unexpected API response format")
      }
    } catch (err) {
      console.error("Error searching products:", err)
      setError(err.response?.data?.message || "Failed to search products. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  // Clear search and return to regular product listing
  const clearSearch = () => {
    setSearchKeyword("")
    setMinPrice("")
    setMaxPrice("")
    setIsSearching(false)
    setShowPriceFilter(false)
    fetchProducts()
  }

  // Add a function to handle category selection
  const handleCategorySelect = (category) => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    // If the same category is selected, deselect it
    if (selectedCategory && selectedCategory.id === category.id) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory({
        id: category.id,
        name: category.name,
      })
    }

    // Fetch products with the new category filter
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }

    // If we have both university and category selected
    if (selectedLocation && selectedLocation.type === "university") {
      if (category && selectedCategory?.id !== category.id) {
        fetchProducts(
          `https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/category/${category.id}`,
          config,
        )
      } else {
        // If category was deselected, fetch all products from the university
        fetchProducts(`https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/regular`, config)
      }
    }
  }

  // Update the handleCategoryClick function to handle category filtering
  const handleCategoryClick = (e, categoryId) => {
    if (checkLoginAndRedirect(e)) {
      // If we have a university selected, filter by category within that university
      if (selectedLocation && selectedLocation.type === "university") {
        const category = categories.find((cat) => cat.id === categoryId)
        if (category) {
          handleCategorySelect(category)
        }
      } else {
        // Otherwise navigate to the category page
        router.push(`/category/${categoryId}`)
      }
    }
  }

  // Replace the existing loadMoreProducts function with this updated version
  const loadMoreProducts = async () => {
    if (!nextPageUrl || loadingMore) return

    try {
      setLoadingMore(true)
      setError(null)

      // Get token for authenticated requests
      const token = localStorage.getItem("token")
      const isUserLoggedIn = !!token

      // Set up request config with headers if logged in
      const config = {}
      if (isUserLoggedIn) {
        config.headers = {
          Authorization: `Bearer ${token}`,
        }
      }

      const response = await axios.get(nextPageUrl, config)

      if (response.data && response.data.data) {
        setProducts((prevProducts) => [...prevProducts, ...response.data.data])
        setNextPageUrl(response.data.links.next)
      } else {
        setError("Unexpected API response format")
      }
    } catch (err) {
      console.error("Error fetching more products:", err)
      setError("Failed to load more products. Please try again later.")
    } finally {
      setLoadingMore(false)
    }
  }

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

  // Handle category click - navigate to category products page

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, [])

  // Format price with commas
  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

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

  // Filter universities based on search query
  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get the food category
  const foodCategory = categories.find((category) => category.id === FOOD_CATEGORY_ID)

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

      {/* PWA Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-20 lg:bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md bg-white rounded-xl shadow-lg z-50 overflow-hidden animate-slideUp">
          <div className="bg-[#004AAD] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <IoInformationCircleOutline size={20} className="text-white mr-2" />
              <h3 className="text-white font-medium">Install VPlaza App</h3>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="text-white hover:bg-white/10 rounded-full p-1"
            >
              <IoCloseOutline size={20} />
            </button>
          </div>
          <div className="p-4">
            {isIOS ? (
              <div>
                <p className="text-sm text-gray-700 mb-3">Install this app on your iPhone for a better experience:</p>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <p className="text-sm">
                      Tap <IoShareOutline className="inline" /> at the bottom of your screen
                    </p>
                  </div>
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <p className="text-sm">
                      Scroll down and tap <span className="font-medium">Add to Home Screen</span>
                    </p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <p className="text-sm">
                      Tap <span className="font-medium">Add</span> in the top right corner
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-700 mb-3">Install this app on your device for a better experience:</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <IoDownloadOutline size={20} className="text-[#004AAD] mr-2" />
                    <span className="text-sm">Get app-like experience</span>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="bg-[#004AAD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0056c7] transition-colors"
                  >
                    Install
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowInstallPrompt(false)} className="text-gray-500 text-xs hover:underline">
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={(e) => {
              if (checkLoginAndRedirect(e)) {
                router.push("/wishlist")
              }
            }}
          >
            <IoHeartOutline size={20} className="text-gray-700" />
          </div>

          <div className="flex-1 relative">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (checkLoginAndRedirect(e)) {
                  searchProducts()
                }
              }}
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault()
                    router.push("/signin")
                  }
                }}
                className="w-full py-2.5 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <IoSearchOutline size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => {
                    if (isLoggedIn) {
                      clearSearch()
                    }
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <IoCloseOutline size={20} />
                </button>
              )}
            </form>
          </div>

          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#004AAD]">VPlaza</h1>
            </div>

            <div className="flex-1 max-w-xl mx-8 relative">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (checkLoginAndRedirect(e)) {
                    searchProducts()
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      e.preventDefault()
                      router.push("/signin")
                    }
                  }}
                  className="w-full py-2.5 pl-10 pr-4 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 border border-gray-200 transition-all"
                />
                <IoSearchOutline
                  size={20}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isLoggedIn) {
                        clearSearch()
                      }
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <IoCloseOutline size={20} />
                  </button>
                )}
              </form>
            </div>

            <div className="flex items-center gap-6">
              <div
                className="flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#004AAD] transition-colors relative"
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
                {selectedLocation && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#004AAD] rounded-full"></span>
                )}
              </div>
              <div
                className="flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#004AAD] transition-colors"
                onClick={(e) => {
                  if (checkLoginAndRedirect(e)) {
                    router.push("/wishlist")
                  }
                }}
              >
                <IoHeartOutline size={20} />
                <span className="text-sm">Wishlist</span>
              </div>
              <div
                className="flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#004AAD] transition-colors"
                onClick={(e) => {
                  if (checkLoginAndRedirect(e)) {
                    router.push("/request")
                  }
                }}
              >
                <IoMailOutline size={20} />
                <span className="text-sm">Request</span>
              </div>
              <div
                className="flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#004AAD] transition-colors"
                onClick={(e) => {
                  if (checkLoginAndRedirect(e)) {
                    router.push("/notifications")
                  }
                }}
              >
                <div className="relative">
                  <IoNotificationsOutline size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span className="text-sm">Notifications</span>
              </div>
              <div
                className="flex items-center gap-1 text-gray-700 cursor-pointer hover:text-[#004AAD] transition-colors"
                onClick={(e) => {
                  if (checkLoginAndRedirect(e)) {
                    router.push("/store")
                  }
                }}
              >
                <IoStorefrontOutline size={20} />
                <span className="text-sm">Store</span>
              </div>
              {isLoggedIn ? (
                <div
                  className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm cursor-pointer"
                  onClick={() => router.push("/profile")}
                >
                  <img src="/diverse-group.png" alt="Profile" className="w-full h-full object-cover" />
                </div>
              ) : (
                <button
                  onClick={() => router.push("/signup")}
                  className="bg-[#004AAD] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#0056c7] transition-colors"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
            <button
              onClick={(e) => {
                if (isLoggedIn) {
                  router.push("/categories")
                } else {
                  router.push("/signin")
                }
              }}
              className="text-[#004AAD] text-sm font-medium flex items-center hover:underline transition-all"
            >
              See More
              <IoChevronForwardOutline size={16} className="ml-1" />
            </button>
          </div>

          {/* Categories on Mobile */}
          <div className="lg:hidden bg-[#004AAD] rounded-2xl overflow-hidden shadow-md">
            <div className="p-3 pb-4">
              {/* First category (larger) */}
              <div
                className={`bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden mb-3 relative shadow-sm hover:shadow-md transition-all cursor-pointer ${
                  selectedCategory && selectedCategory.id === categories[0].id ? "ring-2 ring-white" : ""
                }`}
                onClick={(e) => handleCategoryClick(e, categories[0].id)}
              >
                <img
                  src={categories[0].image || "/placeholder.svg"}
                  alt={categories[0].name}
                  className="w-full h-32 object-cover opacity-80"
                />
                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-lg capitalize">{categories[0].name}</h3>
                    <p className="text-white/80 text-xs">{categories[0].subtitle}</p>
                  </div>
                  <p className="text-white/90 text-xs font-medium">{categories[0].count}</p>
                </div>
                {selectedCategory && selectedCategory.id === categories[0].id && (
                  <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                    <IoCheckmarkCircleOutline size={18} className="text-[#004AAD]" />
                  </div>
                )}
              </div>

              {/* Other categories (smaller grid) */}
              <div className="grid grid-cols-3 gap-3">
                {categories.slice(1).map((category) => (
                  <div
                    key={category.id}
                    className={`bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-all cursor-pointer ${
                      selectedCategory && selectedCategory.id === category.id ? "ring-2 ring-white" : ""
                    }`}
                    onClick={(e) => handleCategoryClick(e, category.id)}
                  >
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-24 object-cover opacity-80"
                    />
                    <div className="absolute inset-0 p-2 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-sm capitalize">{category.name}</h3>
                        <p className="text-white/80 text-xs">{category.subtitle}</p>
                      </div>
                      <p className="text-white/90 text-xs font-medium">{category.count}</p>
                    </div>
                    {selectedCategory && selectedCategory.id === category.id && (
                      <div className="absolute top-1 right-1 bg-white rounded-full p-0.5">
                        <IoCheckmarkCircleOutline size={16} className="text-[#004AAD]" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories on Desktop */}
          <div className="hidden lg:block">
            <div className="bg-[#004AAD] rounded-2xl overflow-hidden shadow-md">
              <div className="p-4 pb-5">
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`bg-white/20 backdrop-blur-sm rounded-xl overflow-hidden relative cursor-pointer hover:transform hover:scale-[1.02] transition-transform shadow-sm ${
                        selectedCategory && selectedCategory.id === category.id ? "ring-2 ring-white" : ""
                      }`}
                      onClick={(e) => handleCategoryClick(e, category.id)}
                    >
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-32 object-cover opacity-80"
                      />
                      <div className="absolute inset-0 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-semibold capitalize">{category.name}</h3>
                          <p className="text-white/80 text-xs">{category.subtitle}</p>
                        </div>
                        <p className="text-white/90 text-xs font-medium">{category.count}</p>
                      </div>
                      {selectedCategory && selectedCategory.id === category.id && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-0.5">
                          <IoCheckmarkCircleOutline size={18} className="text-[#004AAD]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Products
                {selectedLocation && (
                  <span className="text-sm font-normal text-gray-500 ml-2">from {selectedLocation.name}</span>
                )}
                {selectedCategory && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    {selectedLocation ? " in " : "in "}
                    {selectedCategory.name}
                  </span>
                )}
              </h2>
              {(selectedLocation || selectedCategory) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedLocation && (
                    <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-[#004AAD] rounded-full text-xs">
                      <span>{selectedLocation.name}</span>
                      <button
                        onClick={handleSelectCurrentLocation}
                        className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                      >
                        <IoCloseOutline size={14} />
                      </button>
                    </div>
                  )}
                  {selectedCategory && (
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        selectedCategory.id === FOOD_CATEGORY_ID
                          ? "bg-orange-50 text-orange-600"
                          : "bg-blue-50 text-[#004AAD]"
                      }`}
                    >
                      <span>{selectedCategory.name}</span>
                      <button
                        onClick={() => handleCategorySelect(selectedCategory)}
                        className="ml-1 hover:bg-orange-100 rounded-full p-0.5"
                      >
                        <IoCloseOutline size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={(e) => {
                if (checkLoginAndRedirect(e)) {
                  setShowPriceFilter(!showPriceFilter)
                }
              }}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <IoFilterOutline size={18} className="text-gray-700" />
            </button>
          </div>

          {/* Price Filter */}
          {showPriceFilter && (
            <div className="mb-6 p-4 bg-white rounded-xl shadow-sm animate-fadeIn">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Price Range</h3>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label htmlFor="min-price" className="block text-xs text-gray-500 mb-1">
                    Min Price
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="max-price" className="block text-xs text-gray-500 mb-1">
                    Max Price
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={(e) => {
                      if (checkLoginAndRedirect(e)) {
                        searchProducts()
                      }
                    }}
                    className="px-4 py-2 bg-[#004AAD] text-white rounded-lg text-sm hover:bg-[#0056c7] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Results Indicator */}
          {isSearching && (
            <div className="mb-4 flex items-center justify-between">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-[#004AAD] rounded-full text-sm">
                <span className="font-medium">Search Results</span>
                <button onClick={clearSearch} className="ml-2 hover:bg-blue-100 rounded-full p-0.5">
                  <IoCloseOutline size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center justify-between">
              <p>{error}</p>
              <button
                onClick={() => fetchProducts()}
                className="flex items-center text-sm font-medium text-red-600 hover:text-red-800"
              >
                <IoRefreshOutline size={18} className="mr-1" />
                Retry
              </button>
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

          {/* Products Grid - Mobile (2 columns) and Desktop (4 columns) */}
          {!loading && (isSearching ? searchResults.length > 0 : products.length > 0) && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {(isSearching ? searchResults : products).map((product) => {
                  // Check if this is a food product (based on selected category)
                  const isFood = selectedCategory && selectedCategory.id === FOOD_CATEGORY_ID

                  return (
                    <div
                      key={product.id}
                      className={`${
                        isFood
                          ? "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer border border-orange-100"
                          : "bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
                      }`}
                      onClick={(e) => handleProductClick(e, product.id)}
                    >
                      <div className="relative">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? fixImageUrl(product.images[0].url)
                              : "/placeholder.svg?height=200&width=200&query=product"
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

                        {/* Food-specific badge */}
                        {isFood && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                            <div className="flex items-center">
                              <IoTimeOutline className="mr-1" />
                              <span>15-30 min</span>
                            </div>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent"></div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-800 mb-1 truncate">{product.name}</h3>
                        <p className={`${isFood ? "text-orange-600" : "text-[#004AAD]"} font-bold mb-1`}>
                          {formatPrice(product.price)}
                        </p>
                        <RatingStars rating={product.average_rating || 0} />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 truncate max-w-[70%]">
                            {isFood ? "Restaurant: " : "Store: "}
                            {product.store}
                          </p>
                          <button
                            className={`text-xs ${
                              isFood
                                ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                                : "bg-[#004AAD]/10 text-[#004AAD] hover:bg-[#004AAD]/20"
                            } px-2 py-1 rounded-full font-medium transition-colors`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleProductClick(e, product.id)
                            }}
                          >
                            {isFood ? "Order" : "View"}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Load More Button */}
              {nextPageUrl && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className={`flex items-center justify-center px-6 py-3 rounded-xl transition-all ${
                      loadingMore
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : selectedCategory && selectedCategory.id === FOOD_CATEGORY_ID
                          ? "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md"
                          : "bg-[#004AAD] text-white hover:bg-[#0056c7] hover:shadow-md"
                    }`}
                  >
                    {loadingMore ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                        Loading More...
                      </>
                    ) : (
                      "Load More Products"
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Products Found */}
          {!loading && (isSearching ? searchResults.length === 0 : products.length === 0) && !error && (
            <div className="bg-white rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                {selectedCategory && selectedCategory.id === FOOD_CATEGORY_ID ? (
                  <IoRestaurantOutline size={32} className="text-orange-400" />
                ) : (
                  <IoStorefrontOutline size={32} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">
                {isSearching
                  ? "We couldn't find any products matching your search criteria."
                  : selectedLocation
                    ? `We couldn't find any products from ${selectedLocation.name}.`
                    : "We couldn't find any products at the moment."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {isSearching ? (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors"
                  >
                    <IoRefreshOutline size={18} className="mr-2" />
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => fetchProducts()}
                    className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory && selectedCategory.id === FOOD_CATEGORY_ID
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-[#004AAD] text-white hover:bg-[#0056c7]"
                    }`}
                  >
                    <IoRefreshOutline size={18} className="mr-2" />
                    Refresh
                  </button>
                )}
                {selectedLocation && !isSearching && (
                  <button
                    onClick={handleSelectCurrentLocation}
                    className={`inline-flex items-center px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedCategory && selectedCategory.id === FOOD_CATEGORY_ID
                        ? "border border-orange-500 text-orange-500"
                        : "border border-[#004AAD] text-[#004AAD]"
                    }`}
                  >
                    <IoGlobeOutline size={18} className="mr-2" />
                    View All Products
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#004AAD] text-white py-2 px-4 flex items-center justify-between z-20 shadow-lg">
        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={(e) => {
            if (checkLoginAndRedirect(e)) {
              router.push("/store")
            }
          }}
        >
          <IoStorefrontOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Store</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={(e) => {
            if (checkLoginAndRedirect(e)) {
              router.push("/request")
            }
          }}
        >
          <IoMailOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Request</span>
        </button>

        <button className="flex flex-col items-center justify-center -mt-6 relative">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-[#004AAD]">
            <IoHomeSharp size={26} className="text-[#004AAD]" />
          </div>
          <span className="text-[10px] mt-1 font-light">Home</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors relative"
          onClick={(e) => {
            if (checkLoginAndRedirect(e)) {
              router.push("/notifications")
            }
          }}
        >
          <div className="relative">
            <IoNotificationsOutline size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-[10px] mt-1 font-light">Alerts</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={(e) => (isLoggedIn ? router.push("/profile") : router.push("/signin"))}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
            <img src="/diverse-group.png" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <span className="text-[10px] mt-1 font-light">Profile</span>
        </button>
      </div>
    </div>
  )
}

export default HomePage
