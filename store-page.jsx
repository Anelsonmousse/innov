"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoStorefrontOutline,
  IoHomeOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoAddCircleOutline,
  IoImageOutline,
  IoFastFoodOutline,
  IoShirtOutline,
  IoCheckmarkDoneCircleOutline,
  IoStarOutline,
  IoTimeOutline,
  IoPencilOutline,
  IoChevronForwardOutline,
  IoChevronDownOutline,
  IoMailOutline,
} from "react-icons/io5"

// This is a completely empty component to replace the original store switcher
// It will effectively hide the dropdown in the header
export const StoreTypeSwitcher = () => {
  return null
}

const StorePage = () => {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stores, setStores] = useState([])
  const [activeStore, setActiveStore] = useState(null)
  const [hasStore, setHasStore] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [creating, setCreating] = useState(false)
  const [products, setProducts] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // Form data for store creation
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "regular",
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)

  // Fix image URL by removing the first https:// if there are two
  const fixImageUrl = (url) => {
    if (!url) return "/local-grocery-store.png"

    try {
      // Check if the URL contains a double https://
      const doubleHttpsIndex = url.indexOf("https://", url.indexOf("https://") + 1)

      if (doubleHttpsIndex !== -1) {
        // Return only the part from the second https:// onwards
        return url.substring(doubleHttpsIndex)
      }

      return url
    } catch (error) {
      console.error("Error fixing image URL:", error)
      return "/local-grocery-store.png"
    }
  }

  // Safely load image with fallback
  const getImageUrl = (imageObj, fallbackUrl = "/local-grocery-store.png") => {
    try {
      if (!imageObj || !imageObj.url) return fallbackUrl
      return fixImageUrl(imageObj.url)
    } catch (error) {
      console.error("Error getting image URL:", error)
      return fallbackUrl
    }
  }

  // Check if user has stores
  useEffect(() => {
    const checkStores = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("https://app.vplaza.com.ng/api/v1/stores/user/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          if (response.data.data.length > 0) {
            setStores(response.data.data)

            // Set the active store (prefer regular store if available)
            const regularStore = response.data.data.find((store) => store.type === "regular")
            const activeStore = regularStore || response.data.data[0]
            setActiveStore(activeStore)
            setHasStore(true)

            // Fetch products for the active store
            fetchProducts(activeStore)
          } else {
            setHasStore(false)
          }
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error checking store:", err)
        setError(err.response?.data?.message || "Failed to check store status. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    checkStores()
  }, [router])

  // Fetch products for a specific store
  const fetchProducts = async (store) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const productsResponse = await axios.get("https://app.vplaza.com.ng/api/v1/products/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (productsResponse.data && productsResponse.data.data) {
        // Filter products by store
        const storeProducts = productsResponse.data.data.filter((product) => product.store === store.name)
        setProducts(storeProducts)
      }
    } catch (productErr) {
      console.error("Error fetching products:", productErr)
    }
  }

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
      })

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle store type selection
  const handleTypeSelect = (type) => {
    setFormData({
      ...formData,
      type,
    })
  }

  // Switch active store
  const switchStore = (store) => {
    setActiveStore(store)
    fetchProducts(store)
  }

  // Check if user can create a new store type
  const canCreateNewStoreType = () => {
    if (!stores || stores.length === 0) return true

    // Check if user has both store types
    const hasRegularStore = stores.some((store) => store.type === "regular")
    const hasFoodStore = stores.some((store) => store.type === "food")

    // User can create a new store if they don't have both types
    return !(hasRegularStore && hasFoodStore)
  }

  // Get available store type to create
  const getAvailableStoreType = () => {
    if (!stores || stores.length === 0) return "regular"

    const hasRegularStore = stores.some((store) => store.type === "regular")
    return hasRegularStore ? "food" : "regular"
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setErrorMessage("Store name is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.description.trim()) {
      setErrorMessage("Store description is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.image) {
      setErrorMessage("Store image is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setCreating(true)

      // Create FormData object
      const form = new FormData()
      form.append("name", formData.name)
      form.append("description", formData.description)
      form.append("type", formData.type)
      form.append("image", formData.image)

      const response = await axios.post("https://app.vplaza.com.ng/api/v1/stores", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.data && response.data.data) {
        // Add the new store to the stores array
        const newStore = response.data.data
        const updatedStores = [...stores, newStore]
        setStores(updatedStores)
        setActiveStore(newStore)
        setHasStore(true)
        setShowCreateForm(false)

        // Reset form data
        setFormData({
          name: "",
          description: "",
          type: "regular",
          image: null,
        })
        setImagePreview(null)

        // Show success message
        setSuccessMessage("Store created successfully!")
        setShowSuccessMessage(true)
        setTimeout(() => setShowSuccessMessage(false), 3000)

        // Fetch products for the new store
        fetchProducts(newStore)
      }
    } catch (err) {
      console.error("Error creating store:", err)
      setErrorMessage(err.response?.data?.message || "Failed to create store. Please try again.")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 5000)
    } finally {
      setCreating(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Header - Mobile */}
        <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">My Store</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">My Store</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mb-8"></div>
            <div className="w-full max-w-md">
              <div className="h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-12 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
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
        {/* Top Header - Mobile */}
        <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">My Store</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">My Store</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <IoAlertCircleOutline size={32} className="text-red-500" />
            </div>
            <h2 className="text-xl font-medium text-gray-800 mb-4">Error Loading Store</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
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
      </div>
    )
  }

  const formatPrice = (price) => {
    return Number.parseFloat(price).toLocaleString("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp">
          <IoCheckmarkCircle className="text-green-500 mr-2" size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {showErrorMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp">
          <IoAlertCircleOutline className="text-red-500 mr-2" size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">My Store</h1>
          </div>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">My Store</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
        {hasStore && activeStore && stores.length > 1 && (
          <div className="mb-6 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-3 relative z-30">
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg"
                >
                  <div className="flex items-center">
                    {activeStore.type === "food" ? (
                      <IoFastFoodOutline size={18} className="text-green-600 mr-2" />
                    ) : (
                      <IoStorefrontOutline size={18} className="text-green-600 mr-2" />
                    )}
                    <span className="font-medium capitalize">{activeStore.type} Store</span>
                  </div>
                  <IoChevronDownOutline size={16} className="text-gray-500" />
                </button>

                {isOpen && (
                  <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                    {stores.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => {
                          switchStore(store)
                          setIsOpen(false)
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left hover:bg-gray-50 ${
                          activeStore?.id === store.id ? "bg-blue-50" : ""
                        }`}
                      >
                        {store.type === "food" ? (
                          <IoFastFoodOutline size={18} className="text-green-600 mr-2" />
                        ) : (
                          <IoStorefrontOutline size={18} className="text-green-600 mr-2" />
                        )}
                        <span className="capitalize">{store.type} Store</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {hasStore && activeStore ? (
          // User has a store - Show store details
          <div className="max-w-7xl mx-auto lg:flex lg:gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block lg:w-1/4 min-w-[250px]">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                  <IoStorefrontOutline className="mr-2 text-[#004AAD]" />
                  Store Management
                </h3>

                <nav className="space-y-1">
                  <a href="/store" className="flex items-center p-3 rounded-lg bg-blue-50 text-[#004AAD] font-medium">
                    <IoHomeOutline className="mr-3" size={18} />
                    Dashboard
                  </a>
                  <a href="/store/products" className="flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <IoStorefrontOutline className="mr-3" size={18} />
                    Products
                  </a>
                </nav>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <button
                    onClick={() => router.push("/store/new")}
                    className="w-full py-2 bg-[#004AAD] text-white rounded-lg flex items-center justify-center"
                  >
                    <IoAddCircleOutline size={18} className="mr-2" />
                    Add New Product
                  </button>
                </div>

                {canCreateNewStoreType() && (
                  <div className="mt-3">
                    <button
                      onClick={() => {
                        const storeType = getAvailableStoreType()
                        router.push(`/store/create?type=${storeType}`)
                      }}
                      className="w-full py-2 bg-white border border-[#004AAD] text-[#004AAD] rounded-lg flex items-center justify-center hover:bg-blue-50 transition-colors"
                    >
                      <IoAddCircleOutline size={18} className="mr-2" />
                      Create {getAvailableStoreType() === "food" ? "Food" : "Regular"} Store
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:flex-1">
              <div className="max-w-5xl mx-auto">
                {/* Store Header */}
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-6 lg:mb-8">
                  <div className="h-40 lg:h-56 bg-gradient-to-r from-blue-500 to-blue-700 relative">
                    {/* Use a safer image loading approach with error handling */}
                    <img
                      src={activeStore.image_url ? fixImageUrl(activeStore.image_url) : "/local-grocery-store.png"}
                      alt={activeStore.name}
                      className="w-full h-full object-cover opacity-50"
                      onError={(e) => {
                        console.log("Image load error, using fallback")
                        e.target.onerror = null // Prevent infinite error loop
                        e.target.src = "/local-grocery-store.png"
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h1 className="text-2xl font-bold">{activeStore.name}</h1>
                      <div className="flex items-center text-sm">
                        <span className="capitalize mr-2">{activeStore.type} Store</span>
                        <span className="w-1 h-1 bg-white rounded-full mx-1"></span>
                        <span>{activeStore.university}</span>
                      </div>
                    </div>
                    <button
                    onClick={() => router.push(`/store/edit/${activeStore.id}`)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                      <IoPencilOutline className="text-white" size={18} />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-700">{activeStore.description}</p>
                    <div className="flex items-center mt-4 text-sm text-gray-600">
                      <div className="flex items-center mr-4">
                        <IoStarOutline className="mr-1" />
                        <span>0 Reviews</span>
                      </div>
                      <div className="flex items-center">
                        <IoTimeOutline className="mr-1" />
                        <span>Created recently</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <button
                    onClick={() => router.push("/store/new")}
                    className="bg-[#004AAD] text-white p-4 rounded-xl flex items-center justify-center hover:bg-[#0056c7] transition-colors"
                  >
                    <IoAddCircleOutline size={20} className="mr-2" />
                    <span>Add Product</span>
                  </button>
                  <button
                    onClick={() => router.push("/store/products")}
                    className="bg-white text-gray-800 p-4 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <IoStorefrontOutline size={20} className="mr-2 text-[#004AAD]" />
                    <span>View Products</span>
                  </button>

                  {canCreateNewStoreType() && (
                    <button
                      onClick={() => {
                        const storeType = getAvailableStoreType()
                        router.push(`/store/create?type=${storeType}`)
                      }}
                      className="bg-white text-gray-800 p-4 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 lg:col-span-2"
                    >
                      <IoAddCircleOutline size={20} className="mr-2 text-[#004AAD]" />
                      <span>Create {getAvailableStoreType() === "food" ? "Food" : "Regular"} Store</span>
                    </button>
                  )}
                </div>

                {/* Store Stats */}
                <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Total Products</h3>
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <IoStorefrontOutline size={24} className="text-[#004AAD]" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{products.length}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {products.length === 0
                        ? "Add products to your store"
                        : products.length === 1
                          ? "1 product in your store"
                          : `${products.length} products in your store`}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-700">Rating</h3>
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <IoStarOutline className="text-purple-600" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">0.0</p>
                    <p className="text-xs text-gray-500 mt-1">No reviews yet</p>
                  </div>
                </div>

                {products.length === 0 ? (
                  // Empty Products State
                  <div className="bg-white rounded-2xl p-8 lg:p-12 text-center shadow-sm">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <IoStorefrontOutline size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No Products Yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Your store is ready! Start adding products to showcase them to potential customers.
                    </p>
                    <button
                      onClick={() => router.push("/store/new")}
                      className="px-6 py-3 bg-[#004AAD] text-white rounded-xl hover:bg-[#0056c7] transition-colors inline-flex items-center"
                    >
                      <IoAddCircleOutline size={20} className="mr-2" />
                      Add Your First Product
                    </button>
                  </div>
                ) : (
                  // Products Grid
                  <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-medium text-gray-800">Your Products</h3>
                      <button
                        onClick={() => router.push("/store/products")}
                        className="text-[#004AAD] text-sm font-medium hover:underline flex items-center"
                      >
                        View All <IoChevronForwardOutline className="ml-1" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.slice(0, 3).map((product) => (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          {/* Product Image */}
                          <div
                            className="h-40 relative cursor-pointer"
                            onClick={() => router.push(`/store/products/${product.id}`)}
                          >
                            <img
                              src={
                                product.images && product.images.length > 0
                                  ? fixImageUrl(product.images[0].url)
                                  : "/placeholder.svg"
                              }
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/local-grocery-store.png"
                              }}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                              <p className="text-white font-medium truncate">{product.name}</p>
                            </div>
                          </div>

                          {/* Product Details */}
                          <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <p className="font-bold text-[#004AAD]">{formatPrice(product.price)}</p>
                              <div className="flex items-center text-yellow-400">
                                <IoStarOutline size={14} />
                                <span className="text-xs text-gray-600 ml-1">{product.average_rating || "0.0"}</span>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {products.length > 3 && (
                      <div className="mt-6 text-center">
                        <button
                          onClick={() => router.push("/store/products")}
                          className="px-6 py-2 border border-[#004AAD] text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors inline-flex items-center"
                        >
                          View All Products ({products.length})
                          <IoChevronForwardOutline className="ml-1" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : showCreateForm ? (
          // Show store creation form
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Create Your {formData.type === "food" ? "Food" : "Regular"} Store
                </h2>
                <button onClick={() => setShowCreateForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Store Image */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-32 h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Store Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center text-gray-500">
                        <IoImageOutline size={32} className="mb-2" />
                        <span className="text-xs text-center">Click to upload store image</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload a logo or banner for your store</p>
                </div>

                {/* Store Name */}
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your store name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                    required
                  />
                </div>

                {/* Store Description */}
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Store Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your store and what you sell"
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                    required
                  ></textarea>
                </div>

                {/* Store Type - Hidden if creating second store */}
                {!hasStore && (
                  <div className="mb-6 lg:mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Store Type</label>
                    <div className="grid grid-cols-2 gap-4 lg:gap-6">
                      <button
                        type="button"
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
                          formData.type === "regular"
                            ? "border-[#004AAD] bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => handleTypeSelect("regular")}
                      >
                        <IoShirtOutline
                          size={32}
                          className={formData.type === "regular" ? "text-[#004AAD]" : "text-gray-500"}
                        />
                        <span
                          className={`mt-2 font-medium ${
                            formData.type === "regular" ? "text-[#004AAD]" : "text-gray-700"
                          }`}
                        >
                          Regular Store
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Clothing, gadgets, etc.</span>
                      </button>

                      <button
                        type="button"
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-colors ${
                          formData.type === "food"
                            ? "border-[#004AAD] bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => handleTypeSelect("food")}
                      >
                        <IoFastFoodOutline
                          size={32}
                          className={formData.type === "food" ? "text-[#004AAD]" : "text-gray-500"}
                        />
                        <span
                          className={`mt-2 font-medium ${formData.type === "food" ? "text-[#004AAD]" : "text-gray-700"}`}
                        >
                          Food Store
                        </span>
                        <span className="text-xs text-gray-500 mt-1">Meals, snacks, etc.</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#004AAD] text-white rounded-xl font-medium hover:bg-[#0056c7] transition-colors flex items-center justify-center"
                  disabled={creating}
                >
                  {creating ? (
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
                      Creating Store...
                    </>
                  ) : (
                    `Create ${formData.type === "food" ? "Food" : "Regular"} Store`
                  )}
                </button>
              </form>
            </div>
          </div>
        ) : (
          // User doesn't have a store - Show store creation page
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm text-center">
              <div className="w-32 h-32 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <IoStorefrontOutline size={64} className="text-[#004AAD]" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Own Store</h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                Setting up your store on VPlaza allows you to showcase your products to thousands of students in your
                university.
              </p>

              {/* Pricing Info */}
              <div className="bg-blue-50 p-4 rounded-xl mb-8 inline-block">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-lg font-bold text-gray-800 line-through mr-2">₦1,000</span>
                  <span className="text-2xl font-bold text-[#004AAD]">FREE</span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">100% OFF</span> for a limited time!
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-10">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <IoCheckmarkDoneCircleOutline size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Increased Visibility</h3>
                  <p className="text-sm text-gray-600">Get discovered by students looking for products like yours</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <IoCheckmarkDoneCircleOutline size={24} className="text-[#004AAD]" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Professional Presence</h3>
                  <p className="text-sm text-gray-600">Build trust with a professional storefront for your business</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                    <IoCheckmarkDoneCircleOutline size={24} className="text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 mb-2">Easy Management</h3>
                  <p className="text-sm text-gray-600">Manage all your products and inquiries in one place</p>
                </div>
              </div>

              {/* Create Store Button */}
              <button
                onClick={() => router.push("/store/create?type=regular")}
                className="px-8 py-4 bg-[#004AAD] text-white rounded-xl font-medium hover:bg-[#0056c7] transition-colors inline-flex items-center"
              >
                <IoAddCircleOutline size={20} className="mr-2" />
                Create Your Store Now
              </button>
            </div>
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

export default StorePage
