"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Store, Utensils, Upload, X, Loader2 } from "lucide-react"

export default function CreateStorePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const storeType = searchParams.get("type") || "regular"

  const [storeName, setStoreName] = useState("")
  const [storeDescription, setStoreDescription] = useState("")
  const [storeImage, setStoreImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setStoreImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setStoreImage(null)
    setImagePreview("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!storeName.trim()) {
      setError("Store name is required")
      return
    }

    if (!storeImage) {
      setError("Store image is required")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Create FormData object with CORRECT field names
      const formData = new FormData()
      formData.append("name", storeName) // This is correct
      formData.append("description", storeDescription) // This is correct
      formData.append("image", storeImage) // This is correct
      formData.append("type", storeType) // FIXED: Changed from "store_type" to "type"

      // Log the data being sent
      console.log("Creating store with type:", storeType)
      console.log("Store name:", storeName)
      console.log("Store description:", storeDescription)
      console.log("Store image file:", storeImage)

      // Log FormData entries (note: can't directly console.log FormData contents)
      console.log("FormData contents:")
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + (pair[0] === "image" ? "File object" : pair[1]))
      }

      // Log the endpoint
      const endpoint = "https://app.vplaza.com.ng/api/v1/stores"
      console.log("Sending request to endpoint:", endpoint)

      // Log the token (partially masked for security)
      const token = localStorage.getItem("token")
      console.log("Using token:", token ? `${token.substring(0, 10)}...` : "No token found")

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      // Log the raw response
      console.log("Response status:", response.status)
      console.log("Response status text:", response.statusText)

      const data = await response.json()

      // Log the parsed response data
      console.log("Response data:", data)

      if (response.ok) {
        console.log("Store created successfully, redirecting to:", `/store?type=${storeType}`)
        // Store created successfully, redirect to store page
        router.push(`/store?type=${storeType}`)
      } else {
        console.error("Error creating store:", data.message || "Unknown error")
        setError(data.message || "Failed to create store")
      }
    } catch (error) {
      console.error("Exception during store creation:", error)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="flex items-center mb-6">
        <Link href="/store" className="mr-4">
          <ArrowLeft className="h-6 w-6 text-gray-700" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Create {storeType === "food" ? "Food" : "Regular"} Store</h1>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex items-center mb-2">
            {storeType === "food" ? (
              <Utensils className="h-5 w-5 mr-2 text-green-600" />
            ) : (
              <Store className="h-5 w-5 mr-2 text-green-600" />
            )}
            <h2 className="text-lg font-medium text-gray-800">
              {storeType === "food" ? "Food Store Details" : "Store Details"}
            </h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            {storeType === "food"
              ? "Create your food store to start selling meals, snacks, and beverages."
              : "Create your store to start selling products and services."}
          </p>

          <div className="mb-4">
            <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
              Store Name*
            </label>
            <input
              id="storeName"
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder={storeType === "food" ? "e.g., Sarah's Kitchen" : "e.g., Tech Gadgets"}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Store Description
            </label>
            <textarea
              id="storeDescription"
              value={storeDescription}
              onChange={(e) => setStoreDescription(e.target.value)}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              placeholder={
                storeType === "food" ? "Describe what kind of food you sell..." : "Describe what you sell..."
              }
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Image*</label>

            {imagePreview ? (
              <div className="relative w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Store preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/store"
            className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Creating...
              </span>
            ) : (
              "Create Store"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
