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
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoTrashOutline,
  IoAddCircleOutline,
} from "react-icons/io5"

const AddProductPage = () => {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [store, setStore] = useState(null)
  const [hasStore, setHasStore] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [creating, setCreating] = useState(false)

  // Form data for product creation
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: [],
  })
  const [imagePreviews, setImagePreviews] = useState([])

  // Check if user has a store
  useEffect(() => {
    const checkStore = async () => {
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
            setStore(response.data.data[0])
            setHasStore(true)
          } else {
            setHasStore(false)
            router.push("/store")
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

    checkStore()
  }, [router])

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
    const files = Array.from(event.target.files)
    if (files.length > 0) {
      // Add new images to existing images
      setFormData({
        ...formData,
        images: [...formData.images, ...files],
      })

      // Create previews for new images
      const newPreviews = files.map((file) => URL.createObjectURL(file))
      setImagePreviews([...imagePreviews, ...newPreviews])
    }
  }

  // Remove image
  const removeImage = (index) => {
    const newImages = [...formData.images]
    newImages.splice(index, 1)

    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)

    setFormData({
      ...formData,
      images: newImages,
    })
    setImagePreviews(newPreviews)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setErrorMessage("Product name is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.description.trim()) {
      setErrorMessage("Product description is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.price || isNaN(formData.price) || Number.parseFloat(formData.price) <= 0) {
      setErrorMessage("Please enter a valid price")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.category) {
      setErrorMessage("Please select a category")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (formData.images.length === 0) {
      setErrorMessage("Please upload at least one product image")
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
      form.append("price", formData.price)
      form.append("category", formData.category)
      form.append("store_id", store.id)

      // Append each image
      formData.images.forEach((image, index) => {
        form.append(`images[${index}]`, image)
      })

      // This would be the actual API endpoint in a real implementation
      // const response = await axios.post("https://app.vplaza.com.ng/api/v1/products", form, {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "multipart/form-data",
      //   },
      // })

      // For now, we'll simulate a successful response
      setTimeout(() => {
        // Show success message
        setSuccessMessage("Product added successfully!")
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
          // Navigate to products page
          router.push("/store/products")
        }, 2000)
      }, 1500)
    } catch (err) {
      console.error("Error adding product:", err)
      setErrorMessage(err.response?.data?.message || "Failed to add product. Please try again.")
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Add Product</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Add Product</h1>
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Add Product</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Add Product</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <IoAlertCircleOutline size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Error Loading Store</h2>
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
        <div className="flex items-center">
          <button
            onClick={() => router.push("/store/products")}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">Add Product</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.push("/store/products")}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
            >
              <IoArrowBack size={20} />
              <span className="ml-1">Back</span>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Add Product</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Add New Product</h2>

            <form onSubmit={handleSubmit}>
              {/* Product Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <IoTrashOutline size={14} />
                      </button>
                    </div>
                  ))}
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <IoAddCircleOutline size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Image</span>
                  </div>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                <p className="text-xs text-gray-500">Upload up to 5 images of your product</p>
              </div>

              {/* Product Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                  required
                />
              </div>

              {/* Product Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your product"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                  required
                ></textarea>
              </div>

              {/* Price */}
              <div className="mb-4">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₦)
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price in Naira"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="books">Books</option>
                  <option value="furniture">Furniture</option>
                  <option value="food">Food</option>
                  <option value="services">Services</option>
                  <option value="other">Other</option>
                </select>
              </div>

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
                    Adding Product...
                  </>
                ) : (
                  "Add Product"
                )}
              </button>
            </form>
          </div>
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

export default AddProductPage
