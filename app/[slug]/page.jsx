"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoStorefrontOutline,
  IoHomeOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoStarOutline,
  IoTimeOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoShareOutline,
  IoHeartOutline,
  IoHeart,
  IoGridOutline,
  IoListOutline,
  IoFilterOutline,
  IoSearchOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircle,
  IoCopyOutline,
  IoHomeSharp,
} from "react-icons/io5"

const StoreDetailPage = () => {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug
  const observerRef = useRef()

  // States
  const [loading, setLoading] = useState(true)
  const [storeLoading, setStoreLoading] = useState(true)
  const [productsLoading, setProductsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMoreProducts, setHasMoreProducts] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)
  const [viewMode, setViewMode] = useState("grid")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [showCopyMessage, setShowCopyMessage] = useState(false)
  const [favoriteProducts, setFavoriteProducts] = useState(new Set())

  // Fetch store details
  const fetchStore = async () => {
    try {
      setStoreLoading(true)
      setError(null)

      const response = await axios.get(`https://app.vplaza.com.ng/api/v1/stores/${slug}`)
      
      if (response.data && response.data.data) {
        setStore(response.data.data)
      } else {
        setError("Store not found")
      }
    } catch (err) {
      console.error("Error fetching store:", err)
      if (err.response && err.response.status === 404) {
        setError("Store not found")
      } else {
        setError("Failed to load store details")
      }
    } finally {
      setStoreLoading(false)
    }
  }

  // Fetch products with pagination
  const fetchProducts = async (page = 1, reset = false) => {
    if (!store?.id) return
    
    try {
      setProductsLoading(true)
      
      const response = await axios.get(
        `https://app.vplaza.com.ng/api/v1/products/store/${store.id}?page=${page}`
      )

      if (response.data && response.data.data) {
        const newProducts = response.data.data
        const meta = response.data.meta

        if (reset) {
          setProducts(newProducts)
        } else {
          setProducts(prev => [...prev, ...newProducts])
        }

        setTotalProducts(meta.total)
        setHasMoreProducts(meta.current_page < meta.last_page)
        setCurrentPage(meta.current_page)
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setProductsLoading(false)
      setLoading(false)
    }
  }

  // Infinite scroll observer
  const lastProductRef = useCallback(node => {
    if (productsLoading) return
    if (observerRef.current) observerRef.current.disconnect()
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreProducts && !productsLoading) {
        fetchProducts(currentPage + 1, false)
      }
    })
    
    if (node) observerRef.current.observe(node)
  }, [productsLoading, hasMoreProducts, currentPage])

  // Load store on component mount
  useEffect(() => {
    if (slug) {
      fetchStore()
    }
  }, [slug])

  // Load products when store is loaded
  useEffect(() => {
    if (store?.id) {
      fetchProducts(1, true)
    }
  }, [store?.id])

  // Handle share store
  const handleShareStore = async () => {
    const storeUrl = `https://www.vplaza.com.ng/${slug}`
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${store.name} - VPlaza Store`,
          text: `Check out ${store.name} on VPlaza!`,
          url: storeUrl,
        })
      } else {
        await navigator.clipboard.writeText(storeUrl)
        setShowCopyMessage(true)
        setTimeout(() => setShowCopyMessage(false), 2000)
      }
    } catch (error) {
      const tempInput = document.createElement('input')
      tempInput.value = storeUrl
      document.body.appendChild(tempInput)
      tempInput.select()
      document.execCommand('copy')
      document.body.removeChild(tempInput)
      
      setShowCopyMessage(true)
      setTimeout(() => setShowCopyMessage(false), 2000)
    }
  }

  // Handle favorite toggle
  const toggleFavorite = (productId) => {
    setFavoriteProducts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(productId)) {
        newSet.delete(productId)
      } else {
        newSet.add(productId)
      }
      return newSet
    })
  }

  // Format price
  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  // Get unique categories
  const getCategories = () => {
    const categories = products.map(product => product.category)
    return ["all", ...new Set(categories)]
  }

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Loading state
  if (loading || storeLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Store</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-2xl mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-4xl">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Store</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <IoAlertCircleOutline size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-4">{error}</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              The store you're looking for might have been moved or doesn't exist.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Home
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
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Copy Message */}
      {showCopyMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp">
          <IoCopyOutline className="text-blue-500 mr-2" size={20} />
          <span>Store link copied to clipboard!</span>
        </div>
      )}

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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">{store.name}</h1>
          </div>
        </div>
      </div>

      {/* Store Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="relative">
            {/* Store Cover */}
            <div className="h-32 lg:h-40 bg-gradient-to-r from-blue-500 to-blue-700 relative rounded-b-2xl overflow-hidden">
              <img
                src={store.image_url || "/local-grocery-store.png"}
                alt={store.name}
                className="w-full h-full object-cover opacity-50"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = "/local-grocery-store.png"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Share Button */}
              <button
                onClick={handleShareStore}
                className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <IoShareOutline className="text-white" size={16} />
              </button>
            </div>

            {/* Store Info */}
            <div className="relative -mt-8 px-4 pb-4">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">{store.name}</h1>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <span className="capitalize mr-3">{store.type} Store</span>
                      <div className="flex items-center">
                        <IoLocationOutline className="mr-1" size={12} />
                        <span className="truncate">{store.university}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{store.description}</p>
                    
                    {/* Store Stats & Actions Combined */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center">
                          <IoStorefrontOutline className="mr-1 text-[#004AAD]" size={14} />
                          <span className="font-medium">{totalProducts}</span>
                        </div>
                        <div className="flex items-center">
                          <IoStarOutline className="mr-1 text-yellow-500" size={14} />
                          <span className="font-medium">4.8</span>
                        </div>
                      </div>
                      
                      {/* Contact Actions */}
                      <div className="flex gap-2">
                        {store.user?.phone && (
                          <a
                            href={`tel:${store.user.phone}`}
                            className="flex items-center px-3 py-1.5 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors text-sm"
                          >
                            <IoCallOutline className="mr-1" size={14} />
                            <span>Call</span>
                          </a>
                        )}
                        <button
                          onClick={handleShareStore}
                          className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                        >
                          <IoShareOutline className="mr-1" size={14} />
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 lg:px-8 py-6">
        {/* Search and Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 capitalize"
            >
              {getCategories().map(category => (
                <option key={category} value={category} className="capitalize">
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-[#004AAD] text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
              >
                <IoGridOutline size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-[#004AAD] text-white" : "bg-white text-gray-600 hover:bg-gray-50"} transition-colors`}
              >
                <IoListOutline size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 && !productsLoading ? (
          <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <IoStorefrontOutline size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Products Found</h3>
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== "all" 
                ? "Try adjusting your search or filter criteria" 
                : "This store hasn't added any products yet"
              }
            </p>
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6" 
              : "space-y-4"
          }>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                ref={index === filteredProducts.length - 1 ? lastProductRef : null}
                className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                  viewMode === "list" ? "flex gap-4 p-4" : ""
                }`}
              >
                {/* Product Image */}
                <div 
                  className={`relative ${viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "h-48"} cursor-pointer`}
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <img
                    src={product.images?.[0]?.url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/local-grocery-store.png"
                    }}
                  />
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    {favoriteProducts.has(product.id) ? (
                      <IoHeart size={16} className="text-red-500" />
                    ) : (
                      <IoHeartOutline size={16} className="text-gray-600" />
                    )}
                  </button>

                  {viewMode === "grid" && (
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 cursor-pointer"
                      onClick={() => router.push(`/product/${product.id}`)}
                    >
                      <p className="text-white font-medium truncate">{product.name}</p>
                    </div>
                  )}
                </div>

                {/* Product Details */}
                <div 
                  className={`${viewMode === "list" ? "flex-1 cursor-pointer" : "p-3 cursor-pointer"}`}
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {viewMode === "list" && (
                    <h3 className="font-medium text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                  )}
                  
                  <div className={`flex items-center justify-between ${viewMode === "list" ? "mb-2" : "mb-1"}`}>
                    <p className="font-bold text-[#004AAD]">{formatPrice(product.price)}</p>
                    <div className="flex items-center text-yellow-400">
                      <IoStarOutline size={14} />
                      <span className="text-xs text-gray-600 ml-1">{product.average_rating || "0.0"}</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  
                  {viewMode === "list" && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading More Indicator */}
        {productsLoading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004AAD]"></div>
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="relative flex items-center justify-between bg-[#004AAD]/95 backdrop-blur-md rounded-xl shadow-xl py-2 px-3 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-xl"></div>
          
          <button
            onClick={() => router.push("/store")}
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
          >
            <IoStorefrontOutline size={20} className="text-white" />
            <span className="text-xs mt-0.5 font-medium text-white/90">Store</span>
          </button>
          
          <button
            onClick={() => router.push("/request")}
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
          >
            <IoMailOutline size={20} className="text-white" />
            <span className="text-xs mt-0.5 font-medium text-white/90">Request</span>
          </button>
          
          <button onClick={() => router.push("/")} className="relative flex flex-col items-center -mt-6">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl border-3 border-[#004AAD] hover:scale-105 transition-transform">
              <IoHomeSharp size={24} className="text-[#004AAD]" />
            </div>
            <span className="text-xs mt-1 font-medium text-white/90">Home</span>
          </button>
          
          <button
            onClick={() => router.push("/notifications")}
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
          >
            <div className="relative">
              <IoNotificationsOutline size={20} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white/50"></span>
            </div>
            <span className="text-xs mt-0.5 font-medium text-white/90">Alerts</span>
          </button>
          
          <button
            onClick={() => router.push("/profile")}
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
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

export default StoreDetailPage