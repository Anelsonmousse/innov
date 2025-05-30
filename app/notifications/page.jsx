"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoNotificationsOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoChevronForward,
  IoHomeOutline,
  IoStorefrontOutline,
  IoMailOutline,
  IoPersonOutline,
  IoTimeOutline,
  IoEllipseSharp,
} from "react-icons/io5"

const NotificationsPage = () => {
  const router = useRouter()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("https://app.vplaza.com.ng/api/v1/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.notifications) {
          setNotifications(response.data.notifications)
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching notifications:", err)
        // Check for 401 error with specific message
        if (
          err.response &&
          err.response.status === 401 &&
          err.response.data &&
          err.response.data.message === "Unauthenticated."
        ) {
          // Clear token and redirect to signin
          localStorage.removeItem("token")
          router.push("/signin")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [router])

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now - date
    const diffInSecs = Math.floor(diffInMs / 1000)
    const diffInMins = Math.floor(diffInSecs / 60)
    const diffInHours = Math.floor(diffInMins / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInSecs < 60) {
      return "Just now"
    } else if (diffInMins < 60) {
      return `${diffInMins} ${diffInMins === 1 ? "minute" : "minutes"} ago`
    } else if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    } else if (diffInDays < 7) {
      return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    }
  }

  // Handle notification click
  const handleNotificationClick = (id) => {
    router.push(`/notifications/${id}`)
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notifications</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Notifications</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notifications</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Notifications</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <IoAlertCircleOutline size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Error Loading Notifications</h2>
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Notifications</h1>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Notifications</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {notifications.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <IoNotificationsOutline size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Notifications Yet</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                You don't have any notifications at the moment. We'll notify you when there's something new.
              </p>
            </div>
          ) : (
            // Notifications list
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow ${
                    !notification.read_at ? "border-l-4 border-[#004AAD]" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        !notification.read_at ? "bg-blue-100" : "bg-gray-100"
                      }`}
                    >
                      <IoNotificationsOutline
                        size={20}
                        className={!notification.read_at ? "text-[#004AAD]" : "text-gray-500"}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-gray-800">{notification.data.title}</h3>
                        {!notification.read_at && <IoEllipseSharp size={8} className="text-[#004AAD] animate-pulse" />}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{notification.data.message}</p>
                      <div className="flex items-center mt-2 text-xs text-gray-500">
                        <IoTimeOutline className="mr-1" />
                        <span>{formatDate(notification.created_at)}</span>
                      </div>
                    </div>
                    <IoChevronForward className="text-gray-400 ml-2 self-center" />
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

        <button className="flex flex-col items-center justify-center w-16 py-1 bg-white/10 rounded-lg transition-colors relative">
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

export default NotificationsPage
