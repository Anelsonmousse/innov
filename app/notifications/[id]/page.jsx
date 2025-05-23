"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoNotificationsOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoHomeOutline,
  IoStorefrontOutline,
  IoMailOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoCallOutline,
  IoLogoWhatsapp,
  IoInformationCircleOutline,
} from "react-icons/io5"

export default function NotificationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [notification, setNotification] = useState(null)
  const [productRequest, setProductRequest] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    const fetchNotificationDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError(null)

        // Fetch notification details
        const notificationResponse = await axios.get(`https://app.vplaza.com.ng/api/v1/notifications/${params.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (notificationResponse.data && notificationResponse.data.notification) {
          setNotification(notificationResponse.data.notification)

          // If it's a product request notification, fetch the product request details
          if (
            notificationResponse.data.notification.type === "ProductRequestedNotification" &&
            notificationResponse.data.notification.data.product_request_id
          ) {
            try {
              const productRequestResponse = await axios.get(
                `https://app.vplaza.com.ng/api/v1/product-requests/${notificationResponse.data.notification.data.product_request_id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                },
              )

              if (productRequestResponse.data && productRequestResponse.data.data) {
                setProductRequest(productRequestResponse.data.data)
              }
            } catch (productRequestErr) {
              console.error("Error fetching product request:", productRequestErr)
              setErrorMessage(
                productRequestErr.response?.data?.message ||
                  "Failed to load product request details. Please try again.",
              )
              setShowErrorMessage(true)
              setTimeout(() => setShowErrorMessage(false), 5000)
            }
          }
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching notification details:", err)
        setError(err.response?.data?.message || "Failed to load notification details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchNotificationDetails()
    }
  }, [params.id, router])

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Fix image URL by removing the first https:// if there are two
  const fixImageUrl = (url) => {
    if (!url) return "/placeholder.svg"

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
      return "/placeholder.svg"
    }
  }

  // Open WhatsApp with the user's phone number
  const openWhatsApp = (phone) => {
    // Format phone number (remove any non-digit characters)
    const formattedPhone = phone.replace(/\D/g, "")

    // If the phone number doesn't start with a country code, add Nigeria's country code (+234)
    let phoneWithCountryCode = formattedPhone
    if (!formattedPhone.startsWith("234") && formattedPhone.startsWith("0")) {
      // Replace the leading 0 with 234
      phoneWithCountryCode = `234${formattedPhone.substring(1)}`
    } else if (!formattedPhone.startsWith("234") && !formattedPhone.startsWith("+")) {
      // Add 234 prefix if no country code is present
      phoneWithCountryCode = `234${formattedPhone}`
    }

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneWithCountryCode}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notification Details</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Notification Details</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="mt-6 h-40 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notification Details</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Notification Details</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <IoAlertCircleOutline size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Error Loading Notification</h2>
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
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top Header - Mobile */}
        <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notification Details</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Notification Details</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <IoInformationCircleOutline size={48} className="text-[#004AAD]" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Notification Not Found</h2>
            <p className="text-gray-600 text-center mb-6">
              The notification you're looking for could not be found or may have been deleted.
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => router.push("/notifications")}
                className="px-4 py-2 bg-[#004AAD] text-white rounded-lg hover:bg-[#0056c7] transition-colors"
              >
                Back to Notifications
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
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <IoArrowBack size={24} className="text-gray-700" />
            </button>
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notification Details</h1>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Notification Details</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Notification Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-start mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <IoNotificationsOutline size={24} className="text-[#004AAD]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{notification.data.title}</h2>
                <div className="flex items-center text-sm text-gray-500">
                  <IoTimeOutline className="mr-1" />
                  <span>{formatDate(notification.created_at)}</span>
                </div>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{notification.data.message}</p>
          </div>

          {/* Product Request Details (if available) */}
          {productRequest && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Request Details</h3>

              {/* Product Information */}
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Product Name</h4>
                  <p className="text-gray-800">{productRequest.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="text-gray-800">{productRequest.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Category</h4>
                  <p className="text-gray-800 capitalize">
                    {productRequest.category?.name} ({productRequest.category?.store_type} store)
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Requested By</h4>
                  <p className="text-gray-800">{productRequest.user?.name}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500">Date Requested</h4>
                  <p className="text-gray-800">{formatDate(productRequest.created_at)}</p>
                </div>
              </div>

              {/* Product Images */}
              {productRequest.images && productRequest.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Product Images</h4>
                  <div className="relative">
                    <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={fixImageUrl(productRequest.images[activeImageIndex]?.url) || "/placeholder.svg"}
                        alt={`${productRequest.name} - Image ${activeImageIndex + 1}`}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    {/* Thumbnail Navigation (if multiple images) */}
                    {productRequest.images.length > 1 && (
                      <div className="flex mt-3 space-x-2 overflow-x-auto pb-2">
                        {productRequest.images.map((image, index) => (
                          <button
                            key={image.id}
                            onClick={() => setActiveImageIndex(index)}
                            className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                              activeImageIndex === index ? "border-[#004AAD]" : "border-transparent"
                            }`}
                          >
                            <img
                              src={fixImageUrl(image.url) || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/placeholder.svg"
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Buyer Button */}
              {productRequest.user?.phone && (
                <button
                  onClick={() => openWhatsApp(productRequest.user.phone)}
                  className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <IoLogoWhatsapp size={20} className="mr-2" />
                  Contact Buyer via WhatsApp
                </button>
              )}

              {/* Call Button (Alternative) */}
              {productRequest.user?.phone && (
                <a
                  href={`tel:${productRequest.user.phone}`}
                  className="w-full py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center mt-3"
                >
                  <IoCallOutline size={20} className="mr-2" />
                  Call Buyer
                </a>
              )}
            </div>
          )}
        </div>
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
          className="flex flex-col items-center justify-center w-16 py-1 bg-white/10 rounded-lg transition-colors relative"
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
