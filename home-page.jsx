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
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [universities, setUniversities] = useState([])
  const [loadingUniversities, setLoadingUniversities] = useState(false)
  const [universityError, setUniversityError] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)
  const FOOD_CATEGORY_ID = "0196f23e-a0e8-7201-a8d3-42042967e78e"
  const categories = [
    {
      id: "0196f23e-f015-719a-846a-1d602ee50705",
      name: "Gadgets",
      subtitle: "Hardware Technologies",
      count: "Products",
      image: "/gadget-image.jpg",
    },
    {
      id: FOOD_CATEGORY_ID,
      name: "Food",
      subtitle: "Nourishing",
      count: "Items",
      image: "/food-image.jpg",
    },
    {
      id: "90890ab0-4e75-40fa-abcc-3fea9b651360",
      name: "Women",
      subtitle: "Quality",
      count: "Items",
      image: "/diverse-clothing-rack.png",
    },
    {
      id: "941ed023-1ec9-4f17-afe5-a2c5b504fa4d",
      name: "Perfume",
      subtitle: "Fragrance",
      count: "Items",
      image: "/perfume-image.jpg",
    },
  ]
  const [wishlistItems, setWishlistItems] = useState([])
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showPriceFilter, setShowPriceFilter] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
    setSelectedLocation(null)
  }, [])

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
    setIsIOS(isIOSDevice)
    
    // Check if we should show the install prompt
    const shouldShowPrompt = () => {
      const lastShown = localStorage.getItem('pwa-prompt-last-shown')
      const promptDismissed = localStorage.getItem('pwa-prompt-dismissed')
      
      // Don't show if user permanently dismissed it
      if (promptDismissed === 'true') {
        return false
      }
      
      // Show if never shown before
      if (!lastShown) {
        return true
      }
      
      // Show again after 7 days (7 * 24 * 60 * 60 * 1000 milliseconds)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      return parseInt(lastShown) < sevenDaysAgo
    }
    
    if (!isIOSDevice) {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        
        if (shouldShowPrompt()) {
          setTimeout(() => {
            setShowInstallPrompt(true)
            localStorage.setItem('pwa-prompt-last-shown', Date.now().toString())
          }, 3000)
        }
      }
      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    } else {
      // For iOS devices
      if (shouldShowPrompt()) {
        setTimeout(() => {
          setShowInstallPrompt(true)
          localStorage.setItem('pwa-prompt-last-shown', Date.now().toString())
        }, 3000)
      }
    }
  }, [])

  useEffect(() => {
    if (showLocationModal && universities.length === 0 && !loadingUniversities) {
      fetchUniversities()
    }
    if (showLocationModal && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100)
    }
  }, [showLocationModal])

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

  const handleSelectUniversity = (university) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    setSelectedLocation({ id: university.id, name: university.name, type: "university" })
    setSelectedCategory(null)
    setShowLocationModal(false)
    const config = { headers: { Authorization: `Bearer ${token}` } }
    fetchProducts(`https://app.vplaza.com.ng/api/v1/products/university/${university.id}/regular`, config)
  }

  const handleSelectCurrentLocation = () => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    setSelectedLocation(null)
    setSelectedCategory(null)
    setShowLocationModal(false)
    const config = { headers: { Authorization: `Bearer ${token}` } }
    fetchProducts(null, config)
  }

  useEffect(() => {
    const fetchWishlistItems = async () => {
      const token = localStorage.getItem("token")
      if (!token) return
      try {
        const response = await axios.get("https://app.vplaza.com.ng/api/v1/wishlist", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.data && response.data.data) {
          setWishlistItems(response.data.data.map((item) => item.id))
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err)
        if (err.response?.status === 401 && err.response.data?.message === "Unauthenticated.") {
          localStorage.removeItem("token")
          setIsLoggedIn(false)
          router.push("/signin")
        }
      }
    }
    if (isLoggedIn) fetchWishlistItems()
  }, [isLoggedIn])

  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log(`User response to the install prompt: ${outcome}`)
      setDeferredPrompt(null)
      
      // If user accepted, don't show again
      if (outcome === 'accepted') {
        localStorage.setItem('pwa-prompt-dismissed', 'true')
      }
    }
    setShowInstallPrompt(false)
  }

  const fixImageUrl = (url) => {
    if (!url) return "/diverse-products-still-life.png"
    const doubleHttpsIndex = url.indexOf("https://", url.indexOf("https://") + 1)
    return doubleHttpsIndex !== -1 ? url.substring(doubleHttpsIndex) : url
  }

  const fetchProducts = async (url = null, customConfig = null) => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      const isUserLoggedIn = !!token
      if (!url) {
        if (selectedLocation && selectedLocation.type === "university") {
          url = selectedCategory
            ? `https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/category/${selectedCategory.id}`
            : `https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/regular`
        } else {
          url = isUserLoggedIn
            ? "https://app.vplaza.com.ng/api/v1/products/type/regular"
            : "https://app.vplaza.com.ng/api/v1/products/country/Nigeria"
        }
      }
      const config = customConfig || (isUserLoggedIn ? { headers: { Authorization: `Bearer ${token}` } } : {})
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
      const params = new URLSearchParams()
      if (searchKeyword.trim()) params.append("keyword", searchKeyword.trim())
      if (minPrice) params.append("min_price", minPrice)
      if (maxPrice) params.append("max_price", maxPrice)
      const url = `https://app.vplaza.com.ng/api/v1/products/search?${params.toString()}`
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
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

  const clearSearch = () => {
    setSearchKeyword("")
    setMinPrice("")
    setMaxPrice("")
    setIsSearching(false)
    setShowPriceFilter(false)
    fetchProducts()
  }

  const handleCategorySelect = (category) => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    const newCategory = selectedCategory?.id === category.id ? null : { id: category.id, name: category.name }
    setSelectedCategory(newCategory)
    const config = { headers: { Authorization: `Bearer ${token}` } }
    if (selectedLocation && selectedLocation.type === "university") {
      if (newCategory) {
        fetchProducts(
          `https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/category/${category.id}`,
          config
        )
      } else {
        fetchProducts(`https://app.vplaza.com.ng/api/v1/products/university/${selectedLocation.id}/regular`, config)
      }
    }
  }

  const handleCategoryClick = (e, categoryId) => {
    if (checkLoginAndRedirect(e)) {
      if (selectedLocation && selectedLocation.type === "university") {
        const category = categories.find((cat) => cat.id === categoryId)
        if (category) handleCategorySelect(category)
      } else {
        router.push(`/category/${categoryId}`)
      }
    }
  }

  const loadMoreProducts = async () => {
    if (!nextPageUrl || loadingMore) return
    try {
      setLoadingMore(true)
      setError(null)
      const token = localStorage.getItem("token")
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      const response = await axios.get(nextPageUrl, config)
      if (response.data && response.data.data) {
        setProducts((prev) => [...prev, ...response.data.data])
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

  const checkLoginAndRedirect = (e) => {
    if (!isLoggedIn) {
      e.preventDefault()
      router.push("/signin")
      return false
    }
    return true
  }

  const handleProductClick = (e, productId) => {
  router.push(`/product/${productId}`)
}

  useEffect(() => {
    fetchProducts()
  }, [])

  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <IoStarSharp key={`full-${i}`} className="text-yellow-400 text-xs" />
        ))}
        {hasHalfStar && <IoStarHalfSharp className="text-yellow-400 text-xs" />}
        {[...Array(emptyStars)].map((_, i) => (
          <IoStarOutline key={`empty-${i}`} className="text-yellow-400 text-xs" />
        ))}
        <span className="text-xs text-gray-500 ml-1">{rating}</span>
      </div>
    )
  }

  const toggleWishlist = async (e, productId) => {
    e.stopPropagation()
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }
    setWishlistLoading(productId)
    try {
      if (wishlistItems.includes(productId)) {
        const response = await axios.delete(`https://app.vplaza.com.ng/api/v1/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 200 || response.status === 201) {
          setWishlistItems(wishlistItems.filter((id) => id !== productId))
        }
      } else {
        const response = await axios.post(
          "https://app.vplaza.com.ng/api/v1/wishlist",
          { product_id: productId },
          { headers: { Authorization: `Bearer ${token}` } }
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

  const filteredUniversities = universities.filter((university) =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100 pb-16 lg:pb-0 font-sans">
      {/* Location Selection Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 transition-opacity duration-300">
          <div className="bg-white rounded-xl w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl transform transition-transform duration-300 scale-100">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <IoChevronBackOutline size={18} className="text-gray-600" />
                </button>
                <h3 className="text-base font-semibold text-gray-900">Choose Location</h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <IoCloseOutline size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search universities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-9 pr-9 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
                <IoSearchOutline
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IoCloseOutline size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <div
                className="px-4 py-3 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={handleSelectCurrentLocation}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <IoGlobeOutline size={18} className="text-[#004AAD]" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Current Location</p>
                    <p className="text-xs text-gray-500">Products from Nigeria</p>
                  </div>
                </div>
                {!selectedLocation && <IoCheckmarkCircleOutline size={18} className="text-[#004AAD]" />}
              </div>
              {loadingUniversities ? (
                <div className="p-6 text-center">
                  <div className="w-8 h-8 border-2 border-[#004AAD] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-gray-500 text-sm">Loading universities...</p>
                </div>
              ) : universityError ? (
                <div className="p-6 text-center">
                  <p className="text-red-500 text-sm mb-3">{universityError}</p>
                  <button
                    onClick={fetchUniversities}
                    className="px-3 py-1.5 bg-[#004AAD] text-white rounded-lg text-sm hover:bg-[#0056c7] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredUniversities.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 text-sm">No universities found matching "{searchQuery}"</p>
                </div>
              ) : (
                filteredUniversities.map((university) => (
                  <div
                    key={university.id}
                    className="px-4 py-3 border-b border-gray-200 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleSelectUniversity(university)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                        <IoSchoolOutline size={18} className="text-[#004AAD]" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{university.name}</p>
                        <p className="text-xs text-gray-500">{university.country}</p>
                      </div>
                    </div>
                    {selectedLocation?.id === university.id && (
                      <IoCheckmarkCircleOutline size={18} className="text-[#004AAD]" />
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
        <div className="fixed bottom-3 left-3 right-3 lg:max-w-sm lg:left-auto lg:right-3 bg-white rounded-xl shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="bg-[#004AAD] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IoInformationCircleOutline size={18} className="text-white" />
              <h3 className="text-white font-semibold text-sm">Install VPlaza App</h3>
            </div>
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <IoCloseOutline size={18} className="text-white" />
            </button>
          </div>
          <div className="p-4">
            {isIOS ? (
              <div>
                <p className="text-xs text-gray-700 mb-3">Install this app on your iPhone:</p>
                <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold">1</span>
                    </div>
                    <p className="text-xs">Tap <IoShareOutline className="inline" /> at the bottom</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold">2</span>
                    </div>
                    <p className="text-xs">Select <span className="font-medium">Add to Home Screen</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold">3</span>
                    </div>
                    <p className="text-xs">Tap <span className="font-medium">Add</span> in the top right</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs text-gray-700 mb-3">Install for a better experience:</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IoDownloadOutline size={18} className="text-[#004AAD]" />
                    <span className="text-xs font-medium">App-like experience</span>
                  </div>
                  <button
                    onClick={handleInstallClick}
                    className="px-3 py-1.5 bg-[#004AAD] text-white rounded-lg text-xs font-medium hover:bg-[#0056c7] transition-colors"
                  >
                    Install
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => {
                  localStorage.setItem('pwa-prompt-dismissed', 'true')
                  setShowInstallPrompt(false)
                }}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Don't show again
              </button>
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-3 shadow-md sticky top-0 z-30">
        <div className="flex items-center justify-between gap-2">
          <button
            className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={(e) => checkLoginAndRedirect(e) && router.push("/wishlist")}
          >
            <IoHeartOutline size={18} className="text-gray-700" />
          </button>
          <div className="flex-1 relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onClick={(e) => !isLoggedIn && (e.preventDefault(), router.push("/signin"))}
                className="w-full py-2.5 pl-9 pr-9 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
              <IoSearchOutline
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              {searchKeyword && (
                <button
                  onClick={() => isLoggedIn && clearSearch()}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <IoCloseOutline size={18} />
                </button>
              )}
            </div>
          </div>
          <button
            className="relative p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            onClick={(e) => checkLoginAndRedirect(e) && setShowLocationModal(true)}
          >
            <IoLocationOutline size={18} className="text-gray-700" />
            {selectedLocation && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#004AAD] rounded-full"></span>
            )}
          </button>
        </div>
        {selectedLocation && (
          <div className="mt-2 flex items-center justify-between bg-blue-50 rounded-lg px-2 py-1.5">
            <div className="flex items-center gap-1.5">
              <IoSchoolOutline size={14} className="text-[#004AAD]" />
              <span className="text-xs text-[#004AAD] font-medium truncate max-w-[180px]">
                {selectedLocation.name}
              </span>
            </div>
            <button
              onClick={handleSelectCurrentLocation}
              className="text-xs text-[#004AAD] font-medium hover:underline"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-[#004AAD]">VPlaza</h1>
            <div className="flex-1 max-w-lg mx-6 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onClick={(e) => !isLoggedIn && (e.preventDefault(), router.push("/signin"))}
                  className="w-full py-2.5 pl-10 pr-10 bg-gray-50 rounded-lg text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                />
                <IoSearchOutline
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                {searchKeyword && (
                  <button
                    onClick={() => isLoggedIn && clearSearch()}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <IoCloseOutline size={18} />
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#004AAD] transition-colors relative"
                onClick={(e) => checkLoginAndRedirect(e) && setShowLocationModal(true)}
              >
                <IoLocationOutline size={18} />
                <span className="text-sm font-medium">
                  {selectedLocation ? (
                    <span className="flex items-center">
                      <span className="truncate max-w-[100px]">{selectedLocation.name}</span>
                      <span className="ml-1 text-xs text-[#004AAD]">(Change)</span>
                    </span>
                  ) : (
                    "Location"
                  )}
                </span>
                {selectedLocation && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#004AAD] rounded-full"></span>
                )}
              </button>
              <button
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#004AAD] transition-colors"
                onClick={(e) => checkLoginAndRedirect(e) && router.push("/wishlist")}
              >
                <IoHeartOutline size={18} />
                <span className="text-sm font-medium">Wishlist</span>
              </button>
              <button
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#004AAD] transition-colors"
                onClick={(e) => checkLoginAndRedirect(e) && router.push("/request")}
              >
                <IoMailOutline size={18} />
                <span className="text-sm font-medium">Request</span>
              </button>
              <button
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#004AAD] transition-colors relative"
                onClick={(e) => checkLoginAndRedirect(e) && router.push("/notifications")}
              >
                <div className="relative">
                  <IoNotificationsOutline size={18} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <span className="text-sm font-medium">Notifications</span>
              </button>
              <button
                className="flex items-center gap-1.5 text-gray-700 hover:text-[#004AAD] transition-colors"
                onClick={(e) => checkLoginAndRedirect(e) && router.push("/store")}
              >
                <IoStorefrontOutline size={18} />
                <span className="text-sm font-medium">Store</span>
              </button>
              {isLoggedIn ? (
                <button
                  className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-300 transition-all"
                  onClick={() => router.push("/profile")}
                >
                  <img src="/diverse-group.png" alt="Profile" className="w-full h-full object-cover" />
                </button>
              ) : (
                <button
                  onClick={() => router.push("/signup")}
                  className="px-3 py-1.5 bg-[#004AAD] text-white rounded-lg text-sm font-medium hover:bg-[#0056c7] transition-colors"
                >
                  Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 lg:px-6 py-6">
        {/* Categories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Explore Categories</h2>
            <button
              onClick={(e) => (isLoggedIn ? router.push("/categories") : router.push("/signin"))}
              className="flex items-center text-sm font-medium text-[#004AAD] hover:bg-blue-50 px-2 py-1 rounded-lg transition-all"
            >
              See More
              <IoChevronForwardOutline size={14} className="ml-1" />
            </button>
          </div>
          <div className="lg:hidden">
            <div className="relative">
              <div className="grid grid-cols-2 gap-3">
                {categories
                  .filter((category) => category.id !== "941ed023-1ec9-4f17-afe5-a2c5b504fa4d")
                  .map((category, index) => (
                    <div
                      key={category.id}
                      className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                        selectedCategory?.id === category.id ? "ring-2 ring-[#004AAD]" : ""
                      } ${index === 0 ? "col-span-2" : ""}`}
                      onClick={(e) => handleCategoryClick(e, category.id)}
                    >
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-base capitalize">{category.name}</h3>
                            <p className="text-white/90 text-xs">{category.subtitle}</p>
                          </div>
                          <div className="bg-[#004AAD]/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {category.count}
                          </div>
                        </div>
                      </div>
                      {selectedCategory?.id === category.id && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                          <IoCheckmarkCircleOutline size={16} className="text-[#004AAD]" />
                        </div>
                      )}
                      {category.id === FOOD_CATEGORY_ID && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                          <IoRestaurantOutline size={12} className="mr-1" />
                          <span>Food</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="grid grid-cols-4 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                      selectedCategory?.id === category.id ? "ring-2 ring-[#004AAD]" : ""
                    }`}
                    onClick={(e) => handleCategoryClick(e, category.id)}
                  >
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold text-lg capitalize">{category.name}</h3>
                          <p className="text-white/90 text-sm">{category.subtitle}</p>
                        </div>
                        <div className="bg-[#004AAD]/90 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full">
                          {category.count}
                        </div>
                      </div>
                    </div>
                    {selectedCategory?.id === category.id && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm">
                        <IoCheckmarkCircleOutline size={18} className="text-[#004AAD]" />
                      </div>
                    )}
                    {category.id === FOOD_CATEGORY_ID && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-sm px-2.5 py-1 rounded-full flex items-center">
                        <IoRestaurantOutline size={14} className="mr-1" />
                        <span>Food</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
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
                        className="ml-1.5 hover:bg-blue-100 rounded-full p-0.5"
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
                        className="ml-1.5 hover:bg-orange-100 rounded-full p-0.5"
                      >
                        <IoCloseOutline size={14} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={(e) => checkLoginAndRedirect(e) && setShowPriceFilter(!showPriceFilter)}
              className="p-1.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <IoFilterOutline size={18} className="text-gray-700" />
            </button>
          </div>

          {/* Price Filter */}
          {showPriceFilter && (
            <div className="mb-6 p-4 bg-white rounded-xl shadow-md animate-fade-in">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Filter by Price</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label htmlFor="min-price" className="block text-xs text-gray-600 mb-1">
                    Min Price
                  </label>
                  <input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="max-price" className="block text-xs text-gray-600 mb-1">
                    Max Price
                  </label>
                  <input
                    id="max-price"
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={(e) => checkLoginAndRedirect(e) && searchProducts()}
                    className="w-full px-3 py-2 bg-[#004AAD] text-white rounded-lg text-sm font-medium hover:bg-[#0056c7] transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Results Indicator */}
          {isSearching && (
            <div className="mb-6 flex items-center justify-between">
              <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-[#004AAD] rounded-lg text-xs font-medium">
                Search Results
                <button onClick={clearSearch} className="ml-1.5 hover:bg-blue-100 rounded-full p-0.5">
                  <IoCloseOutline size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 mb-6 flex items-center justify-between">
              <p className="text-xs">{error}</p>
              <button
                onClick={() => fetchProducts()}
                className="flex items-center text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
              >
                <IoRefreshOutline size={16} className="mr-1" />
                Retry
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md animate-pulse">
                  <div className="w-full h-36 bg-gray-200 rounded-t-xl"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!loading && (isSearching ? searchResults.length > 0 : products.length > 0) && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
                {(isSearching ? searchResults : products).map((product) => {
                  const isFood = selectedCategory?.id === FOOD_CATEGORY_ID
                  return (
                    <div
                      key={product.id}
                      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
                        isFood ? "border border-orange-100" : ""
                      }`}
                      onClick={(e) => handleProductClick(e, product.id)}
                    >
                      <div className="relative">
                        <img
                          src={
                            product.images?.length > 0
                              ? fixImageUrl(product.images[0].url)
                              : "/placeholder.svg?height=200&width=200&query=product"
                          }
                          alt={product.name}
                          className="w-full h-36 object-cover rounded-t-xl hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/diverse-products-still-life.png"
                          }}
                        />
                        <button
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                          onClick={(e) => toggleWishlist(e, product.id)}
                          disabled={wishlistLoading === product.id}
                        >
                          {wishlistLoading === product.id ? (
                            <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : wishlistItems.includes(product.id) ? (
                            <IoHeartSharp size={16} className="text-red-500" />
                          ) : (
                            <IoHeartOutline size={16} className="text-gray-700" />
                          )}
                        </button>
                        {isFood && (
                          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
                            <IoTimeOutline className="mr-1" size={12} />
                            <span>15-30 min</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/40 to-transparent rounded-b-xl"></div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 mb-1 truncate text-sm">{product.name}</h3>
                        <p className={`font-semibold text-sm ${isFood ? "text-orange-600" : "text-[#004AAD]"}`}>
                          {formatPrice(product.price)}
                        </p>
                        <RatingStars rating={product.average_rating || 0} />
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500 truncate max-w-[70%]">
                            {isFood ? "Restaurant: " : "Store: "}
                            {product.store}
                          </p>
                          <button
                            className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                              isFood
                                ? "bg-orange-50 text-orange-600 hover:bg-orange-100"
                                : "bg-blue-50 text-[#004AAD] hover:bg-blue-100"
                            }`}
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
              {nextPageUrl && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      loadingMore
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : selectedCategory?.id === FOOD_CATEGORY_ID
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-[#004AAD] text-white hover:bg-[#0056c7]"
                    }`}
                  >
                    {loadingMore ? (
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
                        Loading...
                      </>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* No Products Found */}
          {!loading && (isSearching ? searchResults.length === 0 : products.length === 0) && !error && (
            <div className="bg-white rounded-xl p-6 text-center shadow-md">
              <div
                className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center ${
                  selectedCategory?.id === FOOD_CATEGORY_ID ? "bg-orange-50" : "bg-gray-50"
                }`}
              >
                {selectedCategory?.id === FOOD_CATEGORY_ID ? (
                  <IoRestaurantOutline size={28} className="text-orange-400" />
                ) : (
                  <IoStorefrontOutline size={28} className="text-gray-400" />
                )}
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-4 text-xs">
                {isSearching
                  ? "No products match your search criteria."
                  : selectedLocation
                  ? `No products found from ${selectedLocation.name}.`
                  : "No products available at the moment."}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {isSearching ? (
                  <button
                    onClick={clearSearch}
                    className="inline-flex items-center px-3 py-1.5 bg-[#004AAD] text-white rounded-lg text-xs font-medium hover:bg-[#0056c7] transition-colors"
                  >
                    <IoRefreshOutline size={16} className="mr-1" />
                    Clear Search
                  </button>
                ) : (
                  <button
                    onClick={() => fetchProducts()}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedCategory?.id === FOOD_CATEGORY_ID
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-[#004AAD] text-white hover:bg-[#0056c7]"
                    }`}
                  >
                    <IoRefreshOutline size={16} className="mr-1" />
                    Refresh
                  </button>
                )}
                {selectedLocation && !isSearching && (
                  <button
                    onClick={handleSelectCurrentLocation}
                    className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      selectedCategory?.id === FOOD_CATEGORY_ID
                        ? "border-orange-500 text-orange-500 hover:bg-orange-50"
                        : "border-[#004AAD] text-[#004AAD] hover:bg-blue-50"
                    }`}
                  >
                    <IoGlobeOutline size={16} className="mr-1" />
                    View All Products
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="relative flex items-center justify-between bg-[#004AAD]/95 backdrop-blur-md rounded-xl shadow-xl py-2 px-3 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-xl"></div>
          <button
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
            onClick={(e) => checkLoginAndRedirect(e) && router.push("/store")}
          >
            <IoStorefrontOutline size={20} className="text-white" />
            <span className="text-xs mt-0.5 font-medium text-white/90">Store</span>
          </button>
          <button
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
            onClick={(e) => checkLoginAndRedirect(e) && router.push("/request")}
          >
            <IoMailOutline size={20} className="text-white" />
            <span className="text-xs mt-0.5 font-medium text-white/90">Request</span>
          </button>
          <button className="relative flex flex-col items-center -mt-6">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl border-3 border-[#004AAD] hover:scale-105 transition-transform">
              <IoHomeSharp size={24} className="text-[#004AAD]" />
            </div>
            <span className="text-xs mt-1 font-medium text-white/90">Home</span>
          </button>
          <button
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
            onClick={(e) => checkLoginAndRedirect(e) && router.push("/notifications")}
          >
            <div className="relative">
              <IoNotificationsOutline size={20} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white/50"></span>
            </div>
            <span className="text-xs mt-0.5 font-medium text-white/90">Alerts</span>
          </button>
          <button
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
            onClick={(e) => (isLoggedIn ? router.push("/profile") : router.push("/signin"))}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="/diverse-group.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs mt-0.5 font-medium text-white/90">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default HomePage
