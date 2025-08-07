"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoStorefrontOutline,
  IoHomeOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoFastFoodOutline,
  IoSearchOutline,
  IoCloseOutline,
  IoLaptopOutline,
  IoShirtOutline,
  IoDiamondOutline,
} from "react-icons/io5"

const CategoriesPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [activeTab, setActiveTab] = useState("regular")
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef(null)

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await axios.get("https://app.vplaza.com.ng/api/v1/categories", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (response.data && response.data.categories) {
          setCategories(response.data.categories)
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err.response?.data?.message || "Failed to load categories. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [router])

  // Filter categories by store type and search query
  const filteredCategories = categories.filter(
    (category) =>
      category.store_type === activeTab &&
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get category icon based on name
  const getCategoryIcon = (categoryName) => {
    const lowerName = categoryName.toLowerCase()
    if (lowerName.includes("food")) {
      return <IoFastFoodOutline size={24} className="text-orange-500 group-hover:scale-105 transition-transform" />
    } else if (lowerName.includes("gadget") || lowerName.includes("electronic")) {
      return <IoLaptopOutline size={24} className="text-[#004AAD] group-hover:scale-105 transition-transform" />
    } else if (lowerName.includes("women") || lowerName.includes("fashion")) {
      return <IoShirtOutline size={24} className="text-[#004AAD] group-hover:scale-105 transition-transform" />
    } else if (lowerName.includes("perfume")) {
      return <IoDiamondOutline size={24} className="text-[#004AAD] group-hover:scale-105 transition-transform" />
    }
    return <IoStorefrontOutline size={24} className="text-[#004AAD] group-hover:scale-105 transition-transform" />
  }

  // Get category badge for Food category
  const getCategoryBadge = (categoryName) => {
    if (activeTab === "food") {
      return (
        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
          <IoFastFoodOutline size={12} className="mr-1" />
          <span>Food</span>
        </div>
      )
    }
    return null
  }

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Clear search query
  const clearSearch = () => {
    setSearchQuery("")
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 lg:pb-0 font-sans">
      <style jsx>{`
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-3 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Go back"
            >
              <IoArrowBack size={16} className="text-gray-700" />
            </button>
            <h1 className="text-sm font-semibold text-gray-900">Categories</h1>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
              aria-label="Go back"
            >
              <IoArrowBack size={16} />
              <span className="ml-1 text-sm font-medium">Back</span>
            </button>
            <h1 className="ml-4 text-base font-semibold text-gray-900">Categories</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 lg:px-6 py-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-8 pr-8 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 transition-all"
              aria-label="Search categories"
            />
            <IoSearchOutline
              size={16}
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <IoCloseOutline size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Category Type Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          <button
            onClick={() => handleTabChange("regular")}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
              activeTab === "regular"
                ? "text-[#004AAD] border-b-2 border-[#004AAD]"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Show regular categories"
          >
            Regular
          </button>
          <button
            onClick={() => handleTabChange("food")}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors ${
              activeTab === "food"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="Show food categories"
          >
            Food
          </button>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-3 animate-pulse">
                <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100"></div>
                <div className="h-4 bg-gray-100 rounded w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-50 flex items-center justify-center">
              <IoStorefrontOutline size={24} className="text-red-500" />
            </div>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              aria-label="Retry loading categories"
            >
              Try Again
            </button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white p-6 rounded-lg text-center shadow-sm">
            <div
              className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                activeTab === "food" ? "bg-orange-50" : "bg-gray-50"
              }`}
            >
              {activeTab === "food" ? (
                <IoFastFoodOutline size={24} className="text-orange-500" />
              ) : (
                <IoStorefrontOutline size={24} className="text-[#004AAD]" />
              )}
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-500 text-sm mb-3">
              {searchQuery
                ? `No ${activeTab} categories match "${searchQuery}".`
                : `No ${activeTab} categories available.`}
            </p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-4 py-1.5 bg-[#004AAD] text-white rounded-lg text-sm font-medium hover:bg-[#0056c7] transition-colors"
                aria-label="Clear search"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                onClick={() => router.push(`/category/${category.id}`)}
                className={`group relative bg-white rounded-lg shadow-sm p-3 border transition-all duration-200 hover:shadow-md hover:-translate-y-1 animate-fade-in ${
                  activeTab === "food" ? "border-orange-200" : "border-blue-200"
                }`}
                aria-label={`View ${category.name} category`}
              >
                <div
                  className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                    activeTab === "food" ? "bg-orange-50" : "bg-blue-50"
                  }`}
                >
                  {getCategoryIcon(category.name)}
                </div>
                <p className="text-center font-medium text-sm lg:text-base text-gray-900 capitalize truncate">
                  {category.name}
                </p>
                {getCategoryBadge(category.name)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 bg-[#004AAD] text-white rounded-lg shadow-md py-2 px-3 z-30">
        <div className="flex items-center justify-between">
          <button
            className="flex flex-col items-center w-14 py-1 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => router.push("/store")}
            aria-label="Go to store"
          >
            <IoStorefrontOutline size={20} />
            <span className="text-[10px] mt-0.5 font-medium">Store</span>
          </button>
          <button
            className="flex flex-col items-center w-14 py-1 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => router.push("/wishlist")}
            aria-label="Go to wishlist"
          >
            <IoHeartOutline size={20} />
            <span className="text-[10px] mt-0.5 font-medium">Wishlist</span>
          </button>
          <button
            className="flex flex-col items-center -mt-5"
            onClick={() => router.push("/")}
            aria-label="Go to home"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-md border-2 border-[#004AAD]">
              <IoHomeOutline size={20} className="text-[#004AAD]" />
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Home</span>
          </button>
          <button
            className="flex flex-col items-center w-14 py-1 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => router.push("/notifications")}
            aria-label="Go to notifications"
          >
            <div className="relative">
              <IoNotificationsOutline size={20} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
            <span className="text-[10px] mt-0.5 font-medium">Alerts</span>
          </button>
          <button
            className="flex flex-col items-center w-14 py-1 hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => router.push("/profile")}
            aria-label="Go to profile"
          >
            <IoPersonOutline size={20} />
            <span className="text-[10px] mt-0.5 font-medium">Profile</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CategoriesPage