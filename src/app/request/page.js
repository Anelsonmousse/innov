"use client"

import { useState, useEffect } from "react"
import { IoArrowBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function ProductRequestForm() {
    const router = useRouter();
  const [formData, setFormData] = useState({
    productName: "",
    estimatedPrice: "",
    whatsappNumber: "",
    description: "",
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errors, setErrors] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    // Check if product name is empty
    if (!formData.productName.trim()) {
      newErrors.productName = "Product name is required"
    }

    // Check if estimated price is empty
    if (!formData.estimatedPrice.trim()) {
      newErrors.estimatedPrice = "Estimated price is required"
    }

    // Check if WhatsApp number is valid (exactly 11 digits)
    if (!formData.whatsappNumber.trim()) {
      newErrors.whatsappNumber = "WhatsApp number is required"
    } else if (!/^\d{11}$/.test(formData.whatsappNumber)) {
      newErrors.whatsappNumber = "WhatsApp number must be exactly 11 digits"
    }

    // Check if description is empty
    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    // Check if file is selected
    if (!selectedFile) {
      newErrors.productImage = "Product image is required"
    }

    setErrors(newErrors)

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    // Special handling for WhatsApp number to ensure only digits
    if (name === "whatsappNumber") {
      const digitsOnly = value.replace(/\D/g, "")
      setFormData({
        ...formData,
        [name]: digitsOnly,
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result)
      }
      fileReader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Validate form on submission
    const isValid = validateForm()

    if (isValid) {
      // Show the "Coming Soon" popup instead of submitting
      setShowPopup(true)
    }
  }

  // Close the popup and reset form if needed
  const handleClosePopup = () => {
    setShowPopup(false)
    // Uncomment below to reset form after closing popup
    // resetForm()
  }

  // Reset form function
  const resetForm = () => {
    setFormData({
      productName: "",
      estimatedPrice: "",
      whatsappNumber: "",
      description: "",
    })
    setSelectedFile(null)
    setPreviewUrl(null)
    setErrors({})
    setFormSubmitted(false)
  }

  // Only show errors if the form has been submitted
  const showError = (fieldName) => {
    return formSubmitted && errors[fieldName] ? <p className="mt-1 text-xs text-red-500">{errors[fieldName]}</p> : null
  }

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && showPopup) {
        setShowPopup(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => window.removeEventListener("keydown", handleEscKey)
  }, [showPopup])

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg relative">
      {/* Title */}
      <div className=" flex flex-row border-b py-4">
      <button> 
                            <IoArrowBack
                                onClick={() => {
                                  router.push("/");
                                }}
                                color="black"
                                size={24}
                                className="cursor-pointer ml-4"
                              />
                        </button>
        <h2 className="text-2xl w-full font-bold text-center">Request Product</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
            
          <label htmlFor="productName" className="block text-sm font-medium mb-1">
            Product name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Givenchy Bag"
            className={`w-full p-3 bg-[#f0f7ff] rounded-md border ${
              formSubmitted && errors.productName ? "border-red-500" : "border-gray-200"
            }`}
          />
          {showError("productName")}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="estimatedPrice" className="block text-sm font-medium mb-1">
              Estimated Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="estimatedPrice"
              name="estimatedPrice"
              value={formData.estimatedPrice}
              onChange={handleInputChange}
              placeholder="Expected Amount"
              className={`w-full p-3 bg-[#f0f7ff] rounded-md border ${
                formSubmitted && errors.estimatedPrice ? "border-red-500" : "border-gray-200"
              }`}
            />
            {showError("estimatedPrice")}
          </div>
          <div className="flex-1">
            <label htmlFor="whatsappNumber" className="block text-sm font-medium mb-1">
              WhatsApp Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="whatsappNumber"
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleInputChange}
              placeholder="11 digits only"
              maxLength={11}
              className={`w-full p-3 bg-[#f0f7ff] rounded-md border ${
                formSubmitted && errors.whatsappNumber ? "border-red-500" : "border-gray-200"
              }`}
            />
            {showError("whatsappNumber")}
          </div>
        </div>

        <div className="mb-4">
          <div
            className={`border-2 border-dashed ${
              formSubmitted && errors.productImage ? "border-red-500" : "border-blue-300"
            } rounded-md p-6 flex flex-col items-center justify-center bg-[#f0f7ff]`}
          >
            {previewUrl ? (
              <div className="mb-4 relative">
                <img src={previewUrl || "/placeholder.svg"} alt="Product preview" className="max-h-40 rounded" />
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl(null)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-blue-700 mb-2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            )}
            <p className="text-blue-700 mb-3 text-center">
              {previewUrl ? "Change image of product" : "Upload image of product"}{" "}
              <span className="text-red-500">*</span>
            </p>
            <label
              htmlFor="productImage"
              className="cursor-pointer bg-white border border-blue-700 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-50"
            >
              Browse files
            </label>
            <input
              type="file"
              id="productImage"
              name="productImage"
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            {showError("productImage")}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Add Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="5"
            className={`w-full p-3 bg-[#f0f7ff] rounded-md border ${
              formSubmitted && errors.description ? "border-red-500" : "border-gray-200"
            } resize-none`}
          ></textarea>
          {showError("description")}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-700 text-white py-4 rounded-md font-medium hover:bg-blue-800 transition-colors"
        >
          Make Request
        </button>
      </form>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden animate-fadeIn">
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Coming Soon</h3>
                <button onClick={handleClosePopup} className="text-white hover:text-gray-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-8 h-8 text-blue-600"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-center text-gray-700 mb-4">
                This feature is currently under development and will be available soon. Thank you for your patience!
              </p>
              <div className="flex justify-center">
                <button
                  onClick={handleClosePopup}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

