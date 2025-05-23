"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
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
  IoAddCircleOutline,
  IoCloseOutline,
} from "react-icons/io5"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const storeType = searchParams.get("type") || "regular"
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [product, setProduct] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
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
  const [newImages, setNewImages] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [removedImageIds, setRemovedImageIds] = useState([])

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

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await axios.get("https://app.vplaza.com.ng/api/v1/categories")

        if (response.data && response.data.categories) {
          // Filter categories by store type
          const filteredCategories = response.data.categories.filter((category) => category.store_type === storeType)
          setCategories(filteredCategories)
          console.log("Fetched categories for", storeType, "store:", filteredCategories)
        } else {
          console.error("Unexpected categories API response format:", response.data)
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [storeType])

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!params.id) return

      const token = localStorage.getItem("token")
      if (!token) return

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(`https://app.vplaza.com.ng/api/v1/products/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          const productData = response.data.data
          setProduct(productData)
          console.log("Fetched product data:", productData)

          // Initialize form data
          setFormData({
            name: productData.name || "",
            description: productData.description || "",
            price: productData.price || "",
            category_id: productData.category_id || "",
            images: productData.images || [],
          })

          // Initialize image previews
          if (productData.images && productData.images.length > 0) {
            const previews = productData.images.map((img) => ({
              id: img.id,
              url: fixImageUrl(img.url),
            }))
            setImagePreviews(previews)
          }
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err.response?.data?.message || "Failed to load product details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchProductData()
  }, [params.id, router])

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
    if (files.length === 0) return

    // Add to new images array
    setNewImages([...newImages, ...files])

    // Create previews
    const newPreviews = files.map((file) => {
      const reader = new FileReader()
      return new Promise((resolve) => {
        reader.onloadend = () => {
          resolve({
            id: `new-${Date.now()}-${file.name}`,
            url: reader.result,
            file,
          })
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(newPreviews).then((previews) => {
      setImagePreviews([...imagePreviews, ...previews])
    })
  }

  // Remove image from preview
  const removeImage = (id) => {
    // Check if it's an existing image or a new one
    if (id.toString().startsWith("new-")) {
      // Remove from new images and previews
      const newPreviewIndex = imagePreviews.findIndex((img) => img.id === id)
      if (newPreviewIndex !== -1) {
        const newPreviewsArray = [...imagePreviews]
        const removedPreview = newPreviewsArray.splice(newPreviewIndex, 1)[0]
        setImagePreviews(newPreviewsArray)

        // Also remove from newImages array
        const fileToRemove = removedPreview.file
        setNewImages(newImages.filter((file) => file !== fileToRemove))
      }
    } else {
      // It's an existing image, mark for removal on the server
      setRemovedImageIds([...removedImageIds, id])
      setImagePreviews(imagePreviews.filter((img) => img.id !== id))
    }
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

    if (!formData.price || isNaN(Number.parseFloat(formData.price)) || Number.parseFloat(formData.price) <= 0) {
      setErrorMessage("Valid product price is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (!formData.category_id) {
      setErrorMessage("Product category is required")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 3000)
      return
    }

    if (imagePreviews.length === 0) {
      setErrorMessage("At least one product image is required")
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
      setUpdating(true)

      // Create FormData object
      const form = new FormData()
      form.append("name", formData.name)
      form.append("description", formData.description)
      form.append("price", formData.price)
      form.append("category_id", formData.category_id)

      // Add new images
      newImages.forEach((file, index) => {
        form.append(`images[${index}]`, file)
      })

      // Add removed image IDs using the correct parameter name expected by the backend
      if (removedImageIds.length > 0) {
        removedImageIds.forEach((id) => {
          form.append("image_ids_to_delete[]", id)
        })

        // Log the image IDs being sent for deletion
        console.log("Image IDs to delete:", removedImageIds)
      }

      // Log the form data being sent
      console.log("Sending form data:", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        category_id: formData.category_id,
        storeType: storeType,
        newImagesCount: newImages.length,
        removedImageIds: removedImageIds,
      })

      // Use PUT method for update
      const response = await axios.post(`https://app.vplaza.com.ng/api/v1/products/${params.id}?_method=PUT`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      console.log("Update response:", response.data)

      if (response.data) {
        // Show success message
        setSuccessMessage("Product updated successfully!")
        setShowSuccessMessage(true)

        // Redirect after a short delay
        setTimeout(() => {
          router.push(`/store/products/${params.id}?type=${storeType}`)
        }, 1500)
      }
    } catch (err) {
      console.error("Error updating product:", err)
      setErrorMessage(err.response?.data?.message || "Failed to update product. Please try again.")
      setShowErrorMessage(true)
      setTimeout(() => setShowErrorMessage(false), 5000)
    } finally {
      setUpdating(false)
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-10">
        {/* Top Header - Mobile */}
        <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">
              Edit {storeType === "food" ? "Food " : ""}Product
            </h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">
                Edit {storeType === "food" ? "Food " : ""}Product
              </h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
              <div className="h-40 bg-gray-200 rounded-xl mb-6"></div>
              <div className="h-12 bg-gray-200 rounded-xl mb-4"></div>
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
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
          <div className="flex items-center justify-center mb-6">
            <IoAlertCircleOutline size={48} className="text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">Error Loading Product</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
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
          <h1 className="ml-4 text-lg font-semibold text-gray-800">
            Edit {storeType === "food" ? "Food " : ""}Product
          </h1>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">
              Edit {storeType === "food" ? "Food " : ""}Product
            </h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Edit {storeType === "food" ? "Food " : ""}Product
            </h2>

            <form onSubmit={handleSubmit}>
              {/* Product Images */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="flex flex-wrap gap-3 mb-3">
                  {imagePreviews.map((image) => (
                    <div
                      key={image.id}
                      className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt="Product preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                      >
                        <IoCloseOutline size={16} />
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
                <p className="text-xs text-gray-500">
                  Upload clear images of your product. You can add up to 5 images.
                </p>
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
                  placeholder={storeType === "food" ? "e.g., Jollof Rice" : "e.g., Wireless Headphones"}
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
                  placeholder={
                    storeType === "food"
                      ? "Describe your food product, ingredients, etc..."
                      : "Describe your product..."
                  }
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                  required
                ></textarea>
              </div>

              {/* Product Price */}
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

              {/* Product Category */}
              <div className="mb-6">
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                {loadingCategories ? (
                  <div className="w-full h-12 bg-gray-200 animate-pulse rounded-xl"></div>
                ) : categories.length > 0 ? (
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50 appearance-none"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id} className="capitalize">
                        {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-red-500 text-sm">No categories available for this store type.</div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-[#004AAD] text-white rounded-xl font-medium hover:bg-[#0056c7] transition-colors flex items-center justify-center"
                disabled={updating || loadingCategories}
              >
                {updating ? (
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
                    Updating Product...
                  </>
                ) : (
                  `Update ${storeType === "food" ? "Food " : ""}Product`
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
