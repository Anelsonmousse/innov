"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import {
  IoArrowBack,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoSchoolOutline,
  IoLockClosedOutline,
  IoHelpCircleOutline,
  IoShieldCheckmarkOutline,
  IoDocumentTextOutline,
  IoLogOutOutline,
  IoChevronForward,
  IoCamera,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoSettingsOutline,
  IoHeartOutline,
  IoStorefrontOutline,
  IoNotificationsOutline,
  IoHomeOutline,
  IoCloseOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoSearchOutline,
  IoCheckmarkOutline,
  IoCloseCircleOutline,
} from "react-icons/io5"
import { IoChevronDown } from "react-icons/io5"

const ProfilePage = () => {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [updating, setUpdating] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  // Universities state
  const [universities, setUniversities] = useState([])
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const [universityError, setUniversityError] = useState("")
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState(null)
  const dropdownRef = useRef(null)

  // Form data state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    university_id: "",
    profile_picture: null,
  })

  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState(null)

  // Password validation state
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    special: false,
    match: false,
  })

  // Fix image URL by removing the first https:// if there are two
  const fixImageUrl = (url) => {
    if (!url) return "/diverse-group.png"

    // Check if the URL contains a double https://
    const doubleHttpsIndex = url.indexOf("https://", url.indexOf("https://") + 1)

    if (doubleHttpsIndex !== -1) {
      // Return only the part from the second https:// onwards
      return url.substring(doubleHttpsIndex)
    }

    return url
  }

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/signin")
        return
      }

      try {
        setLoading(true)
        setError(null)

        const response = await axios.get("https://app.vplaza.com.ng/api/v1/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.data && response.data.data) {
          setUser(response.data.data)
          setFormData({
            first_name: response.data.data.first_name || "",
            last_name: response.data.data.last_name || "",
            email: response.data.data.email || "",
            phone: response.data.data.phone || "",
            university_id: response.data.data.university_id || "",
            profile_picture: null,
          })
        } else {
          setError("Unexpected API response format")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
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

    fetchUserProfile()
  }, [router])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })

    // Validate password as user types
    if (name === "new_password") {
      validatePassword(value, passwordData.confirm_password)
    } else if (name === "confirm_password") {
      validatePassword(passwordData.new_password, value)
    }
  }

  // Validate password
  const validatePassword = (password, confirmPassword) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      match: password === confirmPassword && confirmPassword !== "",
    }
    setPasswordValidation(validation)
  }

  // Handle profile picture change
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        profile_picture: file,
      })
    }
  }

  // Handle university selection
  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university)
    setFormData({
      ...formData,
      university_id: university.id,
    })
    setShowUniversityDropdown(false)
    setSearchQuery("")
  }

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Clear university selection
  const clearUniversitySelection = () => {
    setSelectedUniversity(null)
    setFormData({
      ...formData,
      university_id: "",
    })
  }

  // Filter universities based on search query
  const filteredUniversities = Array.isArray(universities)
    ? universities.filter((university) => university.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)
    setShowErrorMessage(false)

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    // Create FormData object for submission
    const form = new FormData()
    form.append("first_name", formData.first_name)
    form.append("last_name", formData.last_name)
    form.append("email", formData.email)
    form.append("phone", formData.phone)
    form.append("university_id", formData.university_id || "")

    // Only append profile picture if a new one was selected
    if (formData.profile_picture) {
      form.append("profile_picture", formData.profile_picture)
    }

    try {
      const response = await axios.post("https://app.vplaza.com.ng/api/v1/profile/update", form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (response.status === 200 || response.status === 201) {
        // Update the user state with the new data
        setUser({
          ...user,
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          university: selectedUniversity?.name || user?.university,
          // If we uploaded a new profile picture, we'd need to get the new URL from the response
          // For now, we'll keep the old one until we refresh the page
        })

        // Show success message
        setSuccessMessage("Profile updated successfully")
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 3000)

        // Exit edit mode
        setEditMode(false)

        // Refresh the profile data
        fetchUserProfile()
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setErrorMessage(err.response?.data?.message || "Failed to update profile. Please try again.")
      setShowErrorMessage(true)
      setTimeout(() => {
        setShowErrorMessage(false)
      }, 5000)
    } finally {
      setUpdating(false)
    }
  }

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError(null)

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordData.new_password.length < 8) {
      setPasswordError("Password must be at least 8 characters long")
      return
    }

    if (!/[A-Z]/.test(passwordData.new_password)) {
      setPasswordError("Password must contain at least one uppercase letter")
      return
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(passwordData.new_password)) {
      setPasswordError("Password must contain at least one special character")
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
      return
    }

    try {
      setUpdating(true)

      const response = await axios.post(
        "https://app.vplaza.com.ng/api/v1/change-password",
        {
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
          new_password_confirmation: passwordData.confirm_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.status === 200 || response.status === 201) {
        // Reset form
        setPasswordData({
          current_password: "",
          new_password: "",
          confirm_password: "",
        })

        // Reset validation
        setPasswordValidation({
          length: false,
          uppercase: false,
          special: false,
          match: false,
        })

        // Close modal
        setShowPasswordModal(false)

        // Show success message
        setSuccessMessage("Password changed successfully")
        setShowSuccessMessage(true)
        setTimeout(() => {
          setShowSuccessMessage(false)
        }, 3000)
      }
    } catch (err) {
      console.error("Error changing password:", err)
      setPasswordError(err.response?.data?.message || "Failed to change password. Please check your current password.")
    } finally {
      setUpdating(false)
    }
  }

  // Handle logout
  const handleLogout = () => {
    // Clear all localStorage items
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    localStorage.removeItem("university")
    localStorage.removeItem("token_type")

    // Redirect to sign in page
    router.push("/signin")
  }

  // Fetch user profile function for refreshing data
  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await axios.get("https://app.vplaza.com.ng/api/v1/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data && response.data.data) {
        setUser(response.data.data)
        setFormData({
          first_name: response.data.data.first_name || "",
          last_name: response.data.data.last_name || "",
          email: response.data.data.email || "",
          phone: response.data.data.phone || "",
          university_id: response.data.data.university_id || "",
          profile_picture: null,
        })
      }
    } catch (err) {
      console.error("Error refreshing profile:", err)
    }
  }

  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        setLoadingUniversities(true)
        const response = await axios.get("https://app.vplaza.com.ng/api/v1/universities")

        // Check the structure of the response and extract the array properly
        if (response.data && Array.isArray(response.data)) {
          setUniversities(response.data)
        } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
          // If the array is nested in a data property
          setUniversities(response.data.data)
        } else {
          console.error("Unexpected API response format:", response.data)
          setUniversities([]) // Set to empty array as fallback
          setUniversityError("Failed to load universities. Unexpected data format.")
        }

        setUniversityError("")
      } catch (error) {
        console.error("Error fetching universities:", error)
        setUniversityError("Failed to load universities. Please try again later.")
        setUniversities([]) // Ensure universities is an array even on error
      } finally {
        setLoadingUniversities(false)
      }
    }

    fetchUniversities()
  }, [])

  // Add this effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUniversityDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Add this effect to set selected university when user data is loaded
  useEffect(() => {
    if (user && universities.length > 0) {
      // Find the user's university in the universities array
      const userUniversity = universities.find((university) => university.name === user.university)

      if (userUniversity) {
        setSelectedUniversity(userUniversity)
        setFormData((prevFormData) => ({
          ...prevFormData,
          university_id: userUniversity.id,
        }))
      }
    }
  }, [user, universities])

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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Profile</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Profile</h1>
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Profile</h1>
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
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Profile</h1>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <IoAlertCircleOutline size={48} className="text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">Error Loading Profile</h2>
            <p className="text-gray-600 text-center mb-6">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
              <button
                onClick={() => fetchUserProfile()}
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
            <h1 className="ml-4 text-lg font-semibold text-gray-800">Profile</h1>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-1.5 bg-[#004AAD] text-white rounded-lg text-sm font-medium"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
              >
                <IoArrowBack size={20} />
                <span className="ml-1">Back</span>
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800">Profile</h1>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-5 py-2 bg-[#004AAD] text-white rounded-lg text-sm font-medium hover:bg-[#0056c7] transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="lg:flex lg:gap-8">
          {/* Left Column - Profile Info (Desktop) */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                  <img
                    src={fixImageUrl(user?.profile_picture_url) || "/placeholder.svg"}
                    alt={`${user?.first_name} ${user?.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/diverse-group.png"
                    }}
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{`${user?.first_name} ${user?.last_name}`}</h2>
                <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <IoSchoolOutline className="mr-1" />
                  <span>{user?.university}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Links</h3>
                <nav className="space-y-2">
                  <button
                    onClick={() => router.push("/wishlist")}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <IoHeartOutline className="mr-3 text-[#004AAD]" size={18} />
                    <span>My Wishlist</span>
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <IoHomeOutline className="mr-3 text-[#004AAD]" size={18} />
                    <span>Home</span>
                  </button>
                  <button
                    onClick={() => router.push("/store")}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <IoStorefrontOutline className="mr-3 text-[#004AAD]" size={18} />
                    <span>My Store</span>
                  </button>
                  <button
                    onClick={() => router.push("/notifications")}
                    className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <IoNotificationsOutline className="mr-3 text-[#004AAD]" size={18} />
                    <span>Notifications</span>
                  </button>
                </nav>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Settings</h3>
              <nav className="space-y-2">
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <IoLockClosedOutline className="mr-3 text-[#004AAD]" size={18} />
                  <span>Change Password</span>
                </button>
                <button
                  onClick={() => router.push("/help")}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <IoHelpCircleOutline className="mr-3 text-[#004AAD]" size={18} />
                  <span>Help Center</span>
                </button>
                <button
                  onClick={() => window.open("https://wa.me/2347073119777", "_blank")}
                  className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-green-50 transition-colors text-gray-700 group"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="mr-3 text-green-600"
                      width="18"
                      height="18"
                      fill="currentColor"
                    >
                      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.38 0-7.93 3.55-7.93 7.93a7.9 7.9 0 0 0 1.07 3.98L4 20l4.17-1.09a7.9 7.9 0 0 0 3.78.96h.01c4.38 0 7.93-3.55 7.93-7.93 0-2.12-.82-4.1-2.3-5.6l.01-.02zM12.05 18.2h-.01a6.56 6.56 0 0 1-3.35-.92l-.24-.14-2.48.65.66-2.42-.16-.25a6.57 6.57 0 0 1-1-3.49c0-3.64 2.96-6.6 6.6-6.6a6.56 6.56 0 0 1 4.66 1.93 6.57 6.57 0 0 1 1.93 4.67c0 3.64-2.96 6.6-6.6 6.6l-.01-.03zm3.62-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05a5.4 5.4 0 0 1-1.6-.99c-.59-.51-.99-1.15-1.1-1.34-.12-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.47-.16-.39-.33-.33-.45-.34-.11-.01-.25-.01-.38-.01-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.67 0 .98.72 1.94.82 2.08.1.13 1.4 2.13 3.39 2.99.47.2.84.33 1.13.42.48.15.91.13 1.25.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.19-.13-.4-.23z" />
                    </svg>
                    <span>Contact Support</span>
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-green-600 transition-colors">07073119777</div>
                </button>
                <button
                  onClick={() => router.push("/privacy")}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <IoShieldCheckmarkOutline className="mr-3 text-[#004AAD]" size={18} />
                  <span>Privacy Policy</span>
                </button>
                <button
                  onClick={() => router.push("/terms")}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <IoDocumentTextOutline className="mr-3 text-[#004AAD]" size={18} />
                  <span>Terms & Conditions</span>
                </button>
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center w-full p-2 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                >
                  <IoLogOutOutline className="mr-3" size={18} />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Profile Header - Mobile */}
            <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm mb-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md">
                  <img
                    src={fixImageUrl(user?.profile_picture_url) || "/placeholder.svg"}
                    alt={`${user?.first_name} ${user?.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "/diverse-group.png"
                    }}
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">{`${user?.first_name} ${user?.last_name}`}</h2>
                <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                <div className="flex items-center text-sm text-gray-600">
                  <IoSchoolOutline className="mr-1" />
                  <span>{user?.university}</span>
                </div>
              </div>
            </div>

            {/* Profile Form - Edit Mode */}
            {editMode ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
                  <button onClick={() => setEditMode(false)} className="text-gray-500 hover:text-gray-700 text-sm">
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img
                          src={
                            formData.profile_picture
                              ? URL.createObjectURL(formData.profile_picture)
                              : fixImageUrl(user?.profile_picture_url)
                          }
                          alt={`${user?.first_name} ${user?.last_name}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = "/diverse-group.png"
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 bg-[#004AAD] rounded-full flex items-center justify-center shadow-md border-2 border-white"
                      >
                        <IoCamera className="text-white" size={16} />
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <p className="text-xs text-gray-500 mt-2">Click to change profile picture</p>
                  </div>

                  <div className="space-y-4">
                    {/* First Name */}
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IoPersonOutline className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IoPersonOutline className="text-gray-500" />
                        </div>
                        <input
                          type="text"
                          id="last_name"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IoMailOutline className="text-gray-500" />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IoCallOutline className="text-gray-500" />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50"
                          required
                        />
                      </div>
                    </div>

                    {/* University Dropdown */}
                    <div>
                      <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                        University
                      </label>
                      <div className="relative" ref={dropdownRef}>
                        {/* Selected University Display */}
                        {selectedUniversity ? (
                          <div className="flex items-center justify-between px-4 py-3 border rounded-xl bg-gray-50 border-gray-200">
                            <span>{selectedUniversity.name}</span>
                            <button
                              type="button"
                              onClick={clearUniversitySelection}
                              className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                              disabled={updating}
                            >
                              <IoCloseOutline size={18} />
                            </button>
                          </div>
                        ) : (
                          // University Selector
                          <div
                            className="flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer bg-gray-50 hover:border-blue-400 transition-all border-gray-200"
                            onClick={() => !updating && setShowUniversityDropdown(!showUniversityDropdown)}
                          >
                            <span className={`${loadingUniversities ? "text-gray-400" : "text-gray-700"}`}>
                              {loadingUniversities
                                ? "Loading universities..."
                                : user?.university || "Select your university"}
                            </span>
                            <IoChevronDown
                              size={18}
                              className={`text-gray-500 transition-transform duration-200 ${
                                showUniversityDropdown ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        )}

                        {/* Dropdown Menu */}
                        {showUniversityDropdown && (
                          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-fadeIn">
                            {/* Search Input */}
                            <div className="sticky top-0 bg-white p-2 border-b border-gray-200">
                              <div className="relative">
                                <IoSearchOutline className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                  type="text"
                                  placeholder="Search universities..."
                                  value={searchQuery}
                                  onChange={handleSearchChange}
                                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                />
                              </div>
                            </div>

                            {/* University List */}
                            {loadingUniversities ? (
                              <div className="p-4 text-center text-gray-500">
                                <div className="animate-pulse flex justify-center items-center">
                                  <div className="h-4 w-4 bg-blue-400 rounded-full mr-2"></div>
                                  <div className="h-4 w-4 bg-blue-400 rounded-full mr-2 animate-pulse-delay-200"></div>
                                  <div className="h-4 w-4 bg-blue-400 rounded-full animate-pulse-delay-400"></div>
                                </div>
                                <p className="mt-2">Loading universities...</p>
                              </div>
                            ) : universityError ? (
                              <div className="p-4 text-center text-red-500">{universityError}</div>
                            ) : filteredUniversities.length === 0 ? (
                              <div className="p-4 text-center text-gray-500">No universities found</div>
                            ) : (
                              <ul className="py-1">
                                {filteredUniversities.map((university) => (
                                  <li
                                    key={university.id}
                                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
                                    onClick={() => handleUniversitySelect(university)}
                                  >
                                    {university.name}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 bg-[#004AAD] text-white rounded-xl font-medium hover:bg-[#0056c7] transition-colors flex items-center justify-center"
                        disabled={updating}
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
                            Updating...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            ) : (
              <>
                {/* Profile Information - View Mode */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className="text-[#004AAD] hover:underline text-sm hidden lg:block"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* First Name */}
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">First Name</span>
                      <div className="flex items-center mt-1">
                        <IoPersonOutline className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{user?.first_name}</span>
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Last Name</span>
                      <div className="flex items-center mt-1">
                        <IoPersonOutline className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{user?.last_name}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Email</span>
                      <div className="flex items-center mt-1">
                        <IoMailOutline className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{user?.email}</span>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Phone</span>
                      <div className="flex items-center mt-1">
                        <IoCallOutline className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{user?.phone}</span>
                      </div>
                    </div>

                    {/* University */}
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">University</span>
                      <div className="flex items-center mt-1">
                        <IoSchoolOutline className="text-gray-500 mr-2" />
                        <span className="text-gray-800">{user?.university}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Section - Mobile Only */}
                <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Settings</h2>

                  <div className="space-y-4">
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <IoLockClosedOutline className="text-[#004AAD] mr-3" size={20} />
                        <span className="text-gray-800">Change Password</span>
                      </div>
                      <IoChevronForward className="text-gray-400" />
                    </button>

                    <button
                      onClick={() => router.push("/help")}
                      className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <IoHelpCircleOutline className="text-[#004AAD] mr-3" size={20} />
                        <span className="text-gray-800">Help Center</span>
                      </div>
                      <IoChevronForward className="text-gray-400" />
                    </button>

                    <button
                      onClick={() => window.open("https://wa.me/2347073119777", "_blank")}
                      className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-xl hover:bg-green-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="mr-3 text-green-600"
                          width="20"
                          height="20"
                          fill="currentColor"
                        >
                          <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4c-4.38 0-7.93 3.55-7.93 7.93a7.9 7.9 0 0 0 1.07 3.98L4 20l4.17-1.09a7.9 7.9 0 0 0 3.78.96h.01c4.38 0 7.93-3.55 7.93-7.93 0-2.12-.82-4.1-2.3-5.6l.01-.02zM12.05 18.2h-.01a6.56 6.56 0 0 1-3.35-.92l-.24-.14-2.48.65.66-2.42-.16-.25a6.57 6.57 0 0 1-1-3.49c0-3.64 2.96-6.6 6.6-6.6a6.56 6.56 0 0 1 4.66 1.93 6.57 6.57 0 0 1 1.93 4.67c0 3.64-2.96 6.6-6.6 6.6l-.01-.03zm3.62-4.93c-.2-.1-1.17-.58-1.35-.64-.18-.07-.32-.1-.45.1-.13.2-.5.64-.62.77-.11.13-.23.15-.43.05a5.4 5.4 0 0 1-1.6-.99c-.59-.51-.99-1.15-1.1-1.34-.12-.2-.01-.3.09-.4.09-.09.2-.23.3-.35.1-.12.13-.2.2-.34.07-.13.03-.25-.02-.35-.05-.1-.45-1.08-.62-1.47-.16-.39-.33-.33-.45-.34-.11-.01-.25-.01-.38-.01-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.67 0 .98.72 1.94.82 2.08.1.13 1.4 2.13 3.39 2.99.47.2.84.33 1.13.42.48.15.91.13 1.25.08.38-.06 1.17-.48 1.33-.94.17-.46.17-.86.12-.94-.05-.08-.19-.13-.4-.23z" />
                        </svg>
                        <span className="text-gray-800">Contact Support</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">07073119777</span>
                        <IoChevronForward className="text-gray-400" />
                      </div>
                    </button>

                    <button
                      onClick={() => router.push("/privacy")}
                      className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <IoShieldCheckmarkOutline className="text-[#004AAD] mr-3" size={20} />
                        <span className="text-gray-800">Privacy Policy</span>
                      </div>
                      <IoChevronForward className="text-gray-400" />
                    </button>

                    <button
                      onClick={() => router.push("/terms")}
                      className="flex items-center justify-between w-full py-3 px-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <IoDocumentTextOutline className="text-[#004AAD] mr-3" size={20} />
                        <span className="text-gray-800">Terms & Conditions</span>
                      </div>
                      <IoChevronForward className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Quick Links - Mobile Only */}
                <div className="lg:hidden bg-white rounded-2xl p-6 shadow-sm mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => router.push("/wishlist")}
                      className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <IoHeartOutline className="text-[#004AAD] mb-2" size={24} />
                      <span className="text-sm text-gray-800">My Wishlist</span>
                    </button>

                    <button
                      onClick={() => router.push("/store")}
                      className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <IoStorefrontOutline className="text-[#004AAD] mb-2" size={24} />
                      <span className="text-sm text-gray-800">My Store</span>
                    </button>

                    <button
                      onClick={() => router.push("/notifications")}
                      className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <IoNotificationsOutline className="text-[#004AAD] mb-2" size={24} />
                      <span className="text-sm text-gray-800">Notifications</span>
                    </button>

                    <button
                      onClick={() => router.push("/")}
                      className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <IoHomeOutline className="text-[#004AAD] mb-2" size={24} />
                      <span className="text-sm text-gray-800">Home</span>
                    </button>
                  </div>
                </div>

                {/* Logout Button - Mobile Only */}
                <div className="lg:hidden">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
                  >
                    <IoLogOutOutline className="mr-2" size={20} />
                    Logout
                  </button>
                </div>
              </>
            )}

            {/* Additional Content for Desktop */}
            <div className="hidden lg:block">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Activity</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <IoSettingsOutline className="text-[#004AAD]" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Profile Updated</h3>
                          <p className="text-xs text-gray-500">Your profile information was last updated recently</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">Just now</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <IoCheckmarkCircle className="text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-800">Account Verified</h3>
                          <p className="text-xs text-gray-500">Your account has been verified</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoCloseOutline size={24} className="text-gray-500" />
              </button>
            </div>

            {passwordError && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{passwordError}</div>}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Current Password */}
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    id="current_password"
                    name="current_password"
                    value={passwordData.current_password}
                    onChange={handlePasswordChange}
                    className="block w-full pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50 px-4"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <IoEyeOffOutline className="text-gray-500" />
                    ) : (
                      <IoEyeOutline className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="new_password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="block w-full pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50 px-4"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <IoEyeOffOutline className="text-gray-500" />
                    ) : (
                      <IoEyeOutline className="text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-xs">
                    {passwordValidation.length ? (
                      <IoCheckmarkOutline className="text-green-500 mr-1" size={14} />
                    ) : (
                      <IoCloseCircleOutline className="text-gray-400 mr-1" size={14} />
                    )}
                    <span className={passwordValidation.length ? "text-green-600" : "text-gray-500"}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordValidation.uppercase ? (
                      <IoCheckmarkOutline className="text-green-500 mr-1" size={14} />
                    ) : (
                      <IoCloseCircleOutline className="text-gray-400 mr-1" size={14} />
                    )}
                    <span className={passwordValidation.uppercase ? "text-green-600" : "text-gray-500"}>
                      At least one uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center text-xs">
                    {passwordValidation.special ? (
                      <IoCheckmarkOutline className="text-green-500 mr-1" size={14} />
                    ) : (
                      <IoCloseCircleOutline className="text-gray-400 mr-1" size={14} />
                    )}
                    <span className={passwordValidation.special ? "text-green-600" : "text-gray-500"}>
                      At least one special character
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirm_password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="block w-full pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-gray-50 px-4"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <IoEyeOffOutline className="text-gray-500" />
                    ) : (
                      <IoEyeOutline className="text-gray-500" />
                    )}
                  </button>
                </div>
                {/* Password Match Indicator */}
                {passwordData.confirm_password && (
                  <div className="mt-1 flex items-center text-xs">
                    {passwordValidation.match ? (
                      <>
                        <IoCheckmarkOutline className="text-green-500 mr-1" size={14} />
                        <span className="text-green-600">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <IoCloseCircleOutline className="text-red-500 mr-1" size={14} />
                        <span className="text-red-600">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-[#004AAD] text-white rounded-xl font-medium hover:bg-[#0056c7] transition-colors flex items-center justify-center"
                  disabled={
                    updating ||
                    !passwordValidation.length ||
                    !passwordValidation.uppercase ||
                    !passwordValidation.special ||
                    !passwordValidation.match
                  }
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
                      Updating Password...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 animate-fadeIn">
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <IoLogOutOutline size={32} className="text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 text-center">Logout Confirmation</h2>
              <p className="text-gray-600 text-center mt-2">Are you sure you want to logout from your account?</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors relative"
          onClick={() => router.push("/notifications")}
        >
          <div className="relative">
            <IoNotificationsOutline size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-[10px] mt-1 font-light">Alerts</span>
        </button>

        <button className="flex flex-col items-center justify-center w-16 py-1 bg-white/10 rounded-lg transition-colors">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white">
            <img
              src={fixImageUrl(user?.profile_picture_url) || "/placeholder.svg"}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/diverse-group.png"
              }}
            />
          </div>
          <span className="text-[10px] mt-1 font-light">Profile</span>
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
