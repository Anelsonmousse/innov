"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { IoCloudUploadOutline, IoCheckmarkCircle, IoAlertCircle, IoCloseCircleOutline } from "react-icons/io5"

export default function RequestForm() {
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

      // Check file type
      if (!file.type.match("image.*")) {
        setError("Only image files are allowed")
        continue
      }

      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB")
        continue
      }

      // Add to files array
      newImageFiles.push(file)

      // Create preview
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

    // Validate form
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

      // Create form data
      const form = new FormData()
      form.append("name", formData.name)
      form.append("description", formData.description)
      form.append("category_id", formData.category_id)

      // Add images
      imageFiles.forEach((file) => {
        form.append("images[]", file)
      })

      console.log("Submitting request with data:", {
        name: formData.name,
        description: formData.description,
        category_id: formData.category_id,
        images: `${imageFiles.length} images`,
      })

      // Send request
      const response = await fetch("https://app.vplaza.com.ng/api/v1/product-requests", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          // No Content-Type header as it's set automatically with FormData
        },
      })

      const data = await response.json()
      console.log("Request response:", data)

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setFormData({
          name: "",
          description: "",
          category_id: "",
        })
        setImages([])
        setImageFiles([])

        // Show success message for 3 seconds
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4 flex items-start">
          <IoCheckmarkCircle className="text-green-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-green-800">Request Submitted Successfully!</h3>
            <p className="text-green-700 text-sm mt-1">
              Your product request has been submitted. Sellers in your proximity will be notified.
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex items-start">
          <IoAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5 mr-3" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Categories */}
      {fetchingCategories ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-10 h-10 border-4 border-[#004AAD] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading categories...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-6">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] transition-all"
              required
            />
          </div>

          {/* Product Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the product you're looking for in detail..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] transition-all"
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
              {formData.description.length < 10 && formData.description.length > 0 && (
                <span className="text-red-500 ml-2">(Minimum 10 characters required)</span>
              )}
            </p>
          </div>

          {/* Category Selection */}
          <div className="mb-6">
            <label htmlFor="category_id" className="block text-gray-700 font-medium mb-2">
              Category*
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#004AAD] transition-all bg-white"
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

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Product Images*</label>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center ${
                dragActive ? "border-[#004AAD] bg-blue-50" : "border-gray-300"
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
                <IoCloudUploadOutline className="text-4xl text-gray-400 mb-2" />
                <p className="text-gray-700 mb-2">
                  Drag & drop images here, or{" "}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="text-[#004AAD] font-medium hover:underline"
                  >
                    browse
                  </button>
                </p>
                <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (Max 5MB per image)</p>
              </div>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {images.length} {images.length === 1 ? "image" : "images"} selected:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-70 hover:opacity-100 transition-opacity"
                      >
                        <IoCloseCircleOutline className="text-red-500 text-lg" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg font-medium text-white transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#004AAD] hover:bg-[#0056c7] hover:shadow-md"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting Request...
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
