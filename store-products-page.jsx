"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoStorefrontOutline,
  IoHomeOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoAddCircleOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoChevronForwardOutline,
  IoStarOutline,
} from "react-icons/io5"

const StoreProductsPage = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [store, setStore] = useState(null)
  const [products, setProducts] = useState([])
  const [hasStore, setHasStore] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Check if user has a store and fetch products
  useEffect(() => {
    const checkStoreAndProducts = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError(null)

        // First check if user has a store
        const storeResponse = await axios.get("https://app.vplaza.com.ng/api/v1/stores/user/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (storeResponse.data && storeResponse.data.data) {
          if (storeResponse.data.data.length > 0) {
            setStore(storeResponse.data.data[0])
            setHasStore(true)

            // Then fetch user's products
            const productsResponse = await axios.get("https://app.vplaza.com.ng/api/v1/products/user", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })

            if (productsResponse.data && productsResponse.data.data) {
              setProducts(productsResponse.data.data)
            }
          } else {
            setHasStore(false)
            router.push("/store")
          }
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error checking store or fetching products:", err)
        setError(err.response?.data?.message || "Failed to load store data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    checkStoreAndProducts()
  }, [router])

  // Fix image URL by removing the first https:// if there are two
  const fixImageUrl = (url) => {
    if (!url) return "/local-grocery-store.png"

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

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle delete confirmation
  const confirmDelete = (product) => {
    setProductToDelete(product)
    setShowDeleteConfirm(true)
  }

  // Handle product deletion
  const deleteProduct = async () => {
    if (!productToDelete) return

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setDeleting(true)

      await axios.delete(`https://app.vplaza.com.ng/api/v1/products/${productToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // Remove the deleted product from the list
      setProducts(products.filter((product) => product.id !== productToDelete.id))

      // Show success message
      setSuccessMessage("Product deleted successfully")
      setShowSuccessMessage(true)
      setTimeout(() => setShowSuccessMessage(false), 3000)

      // Close the confirmation dialog
      setShowDeleteConfirm(false)
      setProductToDelete(null)
    } catch (err) {
      console.error("Error deleting product:", err)
      alert(err.response?.data?.message || "Failed to delete product. Please try again.")
    } finally {
      setDeleting(false)
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Store Products</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Store Products</h1>
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Store Products</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Store Products</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <IoStorefrontOutline size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Error Loading Products</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.push("/store")}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Store
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
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-slideUp">
          <IoStorefrontOutline className="text-green-500 mr-2" size={20} />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-scaleUp">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false)
                  setProductToDelete(null)
                }}
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
          <div className="flex items-center">
            <button
              onClick={() => router.push("/store")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Store Products</h1>
          </div>
          <button
            onClick={() => router.push("/store/products/new")}
            className="p-2 rounded-full bg-[#004AAD] text-white"
          >
            <IoAddCircleOutline size={24} />
          </button>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/store")}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
              >
                <IoArrowBack size={20} />
                <span className="ml-1">Back</span>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Store Products</h1>
            </div>
            <button
              onClick={() => router.push("/store/products/new")}
              className="px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors flex items-center"
            >
              <IoAddCircleOutline size={20} className="mr-2" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Search and Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full py-2.5 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
              />
              <IoSearchOutline size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <button className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <IoFilterOutline size={20} className="text-gray-700" />
            </button>
          </div>

          {/* Store Info */}
          <div className="bg-white rounded-xl p-4 mb-6 flex items-center">
            <img
              src={fixImageUrl(store?.image_url) || "/placeholder.svg"}
              alt={store?.name}
              className="w-12 h-12 rounded-lg object-cover mr-4"
            />
            <div className="flex-1">
              <h2 className="font-medium text-gray-800">{store?.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{store?.type} Store</p>
            </div>
            <button
              onClick={() => router.push("/store")}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              View Store
            </button>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            // Empty Products State
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <IoStorefrontOutline size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Products Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                {searchQuery
                  ? "No products match your search. Try a different search term."
                  : "You haven't added any products to your store yet. Start adding products to showcase them to potential customers."}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => router.push("/store/products/new")}
                  className="px-6 py-3 bg-[#004AAD] text-white rounded-xl hover:bg-[#0056c7] transition-colors inline-flex items-center"
                >
                  <IoAddCircleOutline size={20} className="mr-2" />
                  Add Your First Product
                </button>
              )}
            </div>
          ) : (
            // Products Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div
                    className="h-48 relative cursor-pointer"
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
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/store/products/edit/${product.id}`)
                        }}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <IoPencilOutline className="text-gray-700" size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          confirmDelete(product)
                        }}
                        className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <IoTrashOutline className="text-red-500" size={16} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="text-white font-medium truncate">{product.name}</p>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-lg font-bold text-[#004AAD]">{formatPrice(product.price)}</p>
                      <div className="flex items-center text-yellow-400">
                        <IoStarOutline size={16} />
                        <span className="text-xs text-gray-600 ml-1">{product.average_rating || "0.0"}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 capitalize mb-3">Category: {product.category}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">{product.description}</p>
                    <button
                      onClick={() => router.push(`/store/products/${product.id}`)}
                      className="w-full py-2 border border-[#004AAD] text-[#004AAD] rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center"
                    >
                      View Details
                      <IoChevronForwardOutline className="ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#004AAD] text-white py-2 px-4 flex items-center justify-between z-20 shadow-lg">
        <button
          className="flex flex-col items-center justify-center w-16 py-1 bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/store")}
        >
          <IoStorefrontOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Store</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/wishlist")}
        >
          <IoHeartOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Wishlist</span>
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

export default StoreProductsPage
