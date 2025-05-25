"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Upload, Loader2, Store } from "lucide-react"
import Link from "next/link"

export default function EditStorePage() {
  const router = useRouter()
  const params = useParams()
  const [store, setStore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  })

  const [imagePreview, setImagePreview] = useState("")

  useEffect(() => {
    fetchStore()
  }, [params.id])

  const fetchStore = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      const response = await fetch(`https://app.vplaza.com.ng/api/v1/stores/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const result = await response.json()
        const storeData = result.data
        setStore(storeData)
        setFormData({
          name: storeData.name || "",
          description: storeData.description || "",
          image: null,
        })
        setImagePreview(storeData.image_url || "")
      } else {
        setError("Failed to fetch store details")
      }
    } catch (error) {
      console.error("Error fetching store:", error)
      setError("An error occurred while fetching store details")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      const submitData = new FormData()
      submitData.append("name", formData.name)
      submitData.append("description", formData.description)
      submitData.append("_method", "PUT")

      if (formData.image) {
        submitData.append("image", formData.image)
      }

      const response = await fetch(`https://app.vplaza.com.ng/api/v1/stores/${params.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      })

      if (response.ok) {
        const result = await response.json()
        setSuccess("Store updated successfully!")

        // Update local store data
        setStore(result.data)
        setImagePreview(result.data.image_url || "")

        // Redirect after a short delay
        setTimeout(() => {
          router.push("/store")
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.message || "Failed to update store")
      }
    } catch (error) {
      console.error("Error updating store:", error)
      setError("An error occurred while updating the store")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading store details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/store" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Store</h1>
                <p className="text-sm text-gray-600">Update your store information</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-600">
              <Store className="h-5 w-5" />
              <span className="text-sm font-medium">{store?.type === "food" ? "Food Store" : "Regular Store"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            {/* Store Info Header */}
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Store Information</h2>
              <p className="text-sm text-gray-600">
                Update your store details to help customers find and connect with your business.
              </p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Store Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Store Image</label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                      {imagePreview ? (
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Store preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Upload a new image to change your store photo. Recommended size: 400x400px
                    </p>
                  </div>
                </div>
              </div>

              {/* Store Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your store name"
                />
              </div>

              {/* Store Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Describe your store and what you sell..."
                />
              </div>

              {/* Store Details (Read-only) */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Store Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Store ID:</span>
                    <span className="ml-2 text-gray-900 font-mono">{store?.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Store Type:</span>
                    <span className="ml-2 text-gray-900 capitalize">{store?.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Owner:</span>
                    <span className="ml-2 text-gray-900">{store?.user?.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">University:</span>
                    <span className="ml-2 text-gray-900">{store?.university}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                <Link
                  href="/store"
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <span>Update Store</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
