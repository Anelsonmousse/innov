"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { IoCloudUploadOutline, IoCheckmarkCircle, IoAlertCircle, IoCloseCircleOutline, IoImageOutline } from "react-icons/io5"

export default function CompactRequestForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category_id: "",
  })
  const [images, setImages] = useState([])
  const [imageFiles, setImageFiles] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingCategories, setFetchingCategories] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setFetchingCategories(true)
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/signin")
          return
        }

        const response = await fetch("https://app.vplaza.com.ng/api/v1/categories", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()
        console.log("Categories fetched:", data)

        if (data && data.categories) {
          setCategories(data.categories)
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories. Please try again later.")
      } finally {
        setFetchingCategories(false)
      }
    }

    fetchCategories()
  }, [router])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle file selection
  const handleFileSelect = (e) => {
    const files = e.target.files
    handleFiles(files)
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }

  // Process selected files
  const handleFiles = (files) => {
    const newImageFiles = [...imageFiles]
    const newImagePreviews = [...images]

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.match("image.*")) {
        setError("Only image files are allowed")
        continue
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        continue
      }

      newImageFiles.push(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        newImagePreviews.push(e.target.result)
        setImages([...newImagePreviews])
      }
      reader.readAsDataURL(file)
    }

    setImageFiles(newImageFiles)
    setError(null)
  }

  // Remove image
  const removeImage = (index) => {
    const newImageFiles = [...imageFiles]
    const newImagePreviews = [...images]

    newImageFiles.splice(index, 1)
    newImagePreviews.splice(index, 1)

    setImageFiles(newImageFiles)
    setImages(newImagePreviews)
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError("Product name is required")
      return
    }

    if (!formData.description.trim() || formData.description.length < 10) {
      setError("Please provide a detailed description (at least 10 characters)")
      return
    }

    if (!formData.category_id) {
      setError("Please select a category")
      return
    }

    if (imageFiles.length === 0) {
      setError("Please upload at least one image")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      const form = new FormData()
      form.append("name", formData.name)
      form.append("description", formData.description)
      form.append("category_id", formData.category_id)

      imageFiles.forEach((file) => {
        form.append("images[]", file)
      })

      console.log("Submitting request with data:", {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
        images: `${imageFiles.length} images`,
      })

      const response = await fetch("https://app.vplaza.com.ng/api/v1/product-requests", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      })

      const data = await response.json()
      console.log("Request response:", data)

      if (response.ok) {
        setSuccess(true)
        setFormData({
          name: "",
          description: "",
          category_id: "",
        })
        setImages([])
        setImageFiles([])

        setTimeout(() => {
          setSuccess(false)
        }, 3000)
      } else {
        setError(data.message || "Failed to submit request. Please try again.")
      }
    } catch (err) {
      console.error("Error submitting request:", err)
      setError("An error occurred. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 max-w-2xl mx-auto">
      {/* Success Message */}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start">
          <IoCheckmarkCircle className="text-green-500 text-lg flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-green-800 text-sm">Request Submitted!</h3>
            <p className="text-green-700 text-xs mt-1">
              Sellers in your area will be notified.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
          <IoAlertCircle className="text-red-500 text-lg flex-shrink-0 mt-0.5 mr-2" />
          <div>
            <h3 className="font-medium text-red-800 text-sm">Error</h3>
            <p className="text-red-700 text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Categories */}
      {fetchingCategories ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
          <p className="text-gray-600 text-sm">Loading categories...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-sm">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="What product are you looking for?"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm"
              required
            />
          </div>

          {/* Category Selection */}
          <div>
            <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2 text-sm">
              Category*
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all bg-white text-sm"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2 text-sm">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product in detail..."
              rows="3"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none text-sm"
              required
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-gray-500">
                {formData.description.length}/500 characters
              </p>
              {formData.description.length < 10 && formData.description.length > 0 && (
                <span className="text-red-500 text-xs">Min 10 characters</span>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2 text-sm">Product Images*</label>

            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center transition-all ${
                dragActive 
                  ? "border-blue-400 bg-blue-50" 
                  : "border-gray-300 hover:border-blue-300"
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                multiple
                accept="image/*"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center">
                <IoCloudUploadOutline className="text-2xl text-gray-400 mb-2" />
                <p className="text-gray-700 text-sm mb-1">
                  Drop images here or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-blue-600 font-medium hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500">JPG, PNG, GIF • Max 5MB each</p>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <IoImageOutline className="mr-1" />
                  {images.length} {images.length === 1 ? "image" : "images"}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all text-sm ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#004AAD] hover:bg-[#0056c7] hover:shadow-md"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}