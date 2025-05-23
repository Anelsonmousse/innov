"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoTrashOutline,
  IoAddCircleOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircle,
  IoStorefrontOutline,
  IoHomeOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoPersonOutline,
  IoFastFoodOutline,
} from "react-icons/io5"

export default function NewFoodProductPage() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeStore, setActiveStore] = useState(null)
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    images: [],
  })

  // Image previews
  const [imagePreviews, setImagePreviews] = useState([])

  // Fallback categories in case API fails
  const fallbackCategories = [
    { id: "1", name: "Fast Food", store_type: "food" },
    { id: "2", name: "Snacks", store_type: "food" },
    { id: "3", name: "Drinks", store_type: "food" },
    { id: "4", name: "Desserts", store_type: "food" },
    { id: "5", name: "Local Dishes", store_type: "food" },
  ]

  // Fetch store information and categories on component mount
  useEffect(() => {
    console.log("NewFoodProductPage: Component mounted")
    const fetchStoreAndCategories = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        console.log("NewFoodProductPage: Fetching store information")

        // Fetch store information
        const storeResponse = await axios.get("https://app.vplaza.com.ng/api/v1/stores/user/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        let storeData = null
        if (storeResponse.data && storeResponse.data.data && storeResponse.data.data.length > 0) {
          // Find food store if available
          const foodStore = storeResponse.data.data.find((store) => store.type === "food")

          if (!foodStore) {
            // No food store found, redirect to regular store page
            console.log("NewFoodProductPage: No food store found, redirecting")
            router.push("/store/new")
            return
          }

          storeData = foodStore
          setActiveStore(storeData)
          console.log("NewFoodProductPage: Food store information fetched successfully", storeData)
        } else {
          console.log("NewFoodProductPage: No stores found, redirecting to store creation")
          router.push("/store/create")
          return
        }

        // Now that we have the store data, fetch categories
        console.log("NewFoodProductPage: Fetching categories")
        try {
          const categoriesResponse = await axios.get("https://app.vplaza.com.ng/api/v1/categories", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          console.log("NewFoodProductPage: Categories API response:", categoriesResponse.data)

          if (categoriesResponse.data && categoriesResponse.data.categories) {
            // Filter categories for food store
            const filteredCategories = categoriesResponse.data.categories.filter(
              (cat) => cat.store_type === "food" || cat.store_type === "all",
            )

            setCategories(filteredCategories)
            console.log("NewFoodProductPage: Categories fetched successfully", filteredCategories)
          } else {
            console.log("NewFoodProductPage: Using fallback categories due to unexpected API response format")
            setCategories(fallbackCategories)
          }
        } catch (categoriesError) {
          console.error("NewFoodProductPage: Error fetching categories:", categoriesError)
          console.log("NewFoodProductPage: Using fallback categories due to API error")
          setCategories(fallbackCategories)
        } finally {
          setLoadingCategories(false)
        }
      } catch (storeError) {
        console.error("NewFoodProductPage: Error fetching store information:", storeError)
        if (storeError.response && storeError.response.status === 404) {
          console.log("NewFoodProductPage: No stores found, redirecting to store creation")
          router.push("/store/create")
        } else {
          setErrorMessage("Failed to load store information. Please try again.")
          setShowErrorMessage(true)
          setTimeout(() => setShowErrorMessage(false), 3000)
          // Use fallback categories
          setCategories(fallbackCategories)
          setLoadingCategories(false)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStoreAndCategories()
  }, [router])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  // Handle image selection
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files)
    if (files.length === 0) return

    // Limit to 5 images
    if (formData.images.length + files.length > 5) {
      setErrorMessage("You can only upload up to 5 images")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    // Update form data with new images
    setFormData({
      ...formData,
      images: [...formData.images, ...files],
    })

    // Create previews for new images
    const newPreviews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews([...imagePreviews, ...newPreviews])
  }

  // Remove an image
  const removeImage = (index) => {
    const updatedImages = [...formData.images]
    updatedImages.splice(index, 1)

    const updatedPreviews = [...imagePreviews]
    URL.revokeObjectURL(updatedPreviews[index]) // Clean up the URL
    updatedPreviews.splice(index, 1)

    setFormData({
      ...formData,
      images: updatedImages,
    })
    setImagePreviews(updatedPreviews)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("NewFoodProductPage: Form submitted with data:", formData)

    // Validate form
    if (!formData.name.trim()) {
      setErrorMessage("Food name is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.description.trim()) {
      setErrorMessage("Food description is required")
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

    if (!formData.category_id) {
      setErrorMessage("Please select a category")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (formData.images.length === 0) {
      setErrorMessage("Please upload at least one image")
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
      setSubmitting(true)
      console.log("NewFoodProductPage: Creating FormData for submission")

      // Create FormData object
      const form = new FormData()
      form.append("name", formData.name)
      form.append("description", formData.description)
      form.append("price", formData.price)
      form.append("category_id", formData.category_id)
      form.append("store_id", activeStore.id)
      // form.append("preparation_time", formData.preparation_time)
      // form.append("is_available", formData.is_available ? "1" : "0")

      // Append images
      formData.images.forEach((image) => {
        form.append("images[]", image)
      })

      console.log("NewFoodProductPage: Submitting food product data to API")
      console.log("NewFoodProductPage: Store ID being used:", activeStore.id)
      console.log("NewFoodProductPage: Category ID being used:", formData.category_id)

      // Log the form data (for debugging)
      for (const pair of form.entries()) {
        console.log("NewFoodProductPage: Form data -", pair[0], pair[1])
      }

      const response = await axios.post("https://app.vplaza.com.ng/api/v1/products", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("NewFoodProductPage: API response:", response.data)

      if (response.data && response.data.data) {
        // Show success message
        setSuccessMessage("Food product added successfully!")
        setShowSuccessMessage(true)

        // Reset form after successful submission
        setFormData({
          name: "",
          description: "",
          price: "",
          category_id: "",
          images: [],
        })
        setImagePreviews([])

        // Redirect to products page after a short delay
        setTimeout(() => {
          router.push("/store/products")
        }, 2000)
      }
    } catch (err) {
      console.error("NewFoodProductPage: Error adding food product:", err)
      console.error("NewFoodProductPage: Error response:", err.response?.data)

      setErrorMessage(err.response?.data?.message || "Failed to add food product. Please try again.")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 5000)
    } finally {
      setSubmitting(false)
    }
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
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">Add Food Product</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-green-600"
            >
              <IoArrowBack size={20} />
              <span className="ml-1">Back</span>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Add Food Product</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center mb-6">
              <IoFastFoodOutline size={24} className="text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Food Product Information</h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Product Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Images</label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {/* Existing Images */}
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <IoTrashOutline size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add Image Button */}
                  {formData.images.length < 5 && (
                    <div
                      onClick={() => fileInputRef.current.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    >
                      <IoAddCircleOutline size={24} className="text-gray-400 mb-1" />
                      <span className="text-xs text-gray-500">Add Image</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                <p className="text-xs text-gray-500 mt-2">Upload up to 5 images (PNG, JPG, JPEG)</p>
              </div>

              {/* Food Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter food name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 bg-gray-50"
                  required
                />
              </div>

              {/* Food Description */}
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your food product"
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 bg-gray-50"
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
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 bg-gray-50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Food Category
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-100 focus:border-green-400 bg-gray-50"
                  required
                >
                  <option value="">Select a category</option>
                  {loadingCategories ? (
                    <option value="" disabled>
                      Loading categories...
                    </option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                disabled={submitting}
              >
                {submitting ? (
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
                    Adding Food Product...
                  </>
                ) : (
                  <>
                    <IoFastFoodOutline size={20} className="mr-2" />
                    Add Food Product
                  </>
                )}
              </button>

              {/* Regular Product Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => router.push("/store/new")}
                  className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                >
                  <IoStorefrontOutline size={20} className="mr-2 text-[#004AAD]" />
                  Add Regular Product Instead
                </button>
              </div>
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
