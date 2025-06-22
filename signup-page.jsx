"use client"
import { useState, useRef, useEffect } from "react"
import { IoArrowBack, IoEyeOutline, IoEyeOffOutline, IoChevronDown, IoSearch, IoClose } from "react-icons/io5"
import { FaCheck, FaTimes, FaCamera, FaUserGraduate, FaUniversity, FaEnvelope, FaPhone, FaUser } from "react-icons/fa"
import { useRouter } from "next/navigation"
import axios from "axios"

const SignUpPage = () => {
  const fileInputRef = useRef(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    university_id: "",
    password: "",
    confirm_password: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formIsValid, setFormIsValid] = useState(false)
  const router = useRouter()

  // Universities state
  const [universities, setUniversities] = useState([])
  const [loadingUniversities, setLoadingUniversities] = useState(true)
  const [universityError, setUniversityError] = useState("")
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUniversity, setSelectedUniversity] = useState(null)

  const dropdownRef = useRef(null)

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    capital: false,
    special: false,
    match: false,
  })

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

  // Close dropdown when clicking outside
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

  // Update password validation states whenever password or confirm_password changes
  useEffect(() => {
    const { password, confirm_password } = formData
    setPasswordValidation({
      length: password.length >= 8,
      capital: /[A-Z]/.test(password),
      special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
      match: password === confirm_password && password !== "",
    })
  }, [formData.password, formData.confirm_password])

  // Check if form is valid whenever relevant state changes
  useEffect(() => {
    const { first_name, last_name, phone, email, university_id, password, confirm_password } = formData

    // Check if all text fields are filled
    const allFieldsFilled =
      first_name.trim() !== "" &&
      last_name.trim() !== "" &&
      phone.trim() !== "" &&
      email.trim() !== "" &&
      university_id.trim() !== ""

    // Check if password meets all requirements
    const passwordValid = passwordValidation.length && passwordValidation.capital && passwordValidation.special

    // Check if passwords match
    const passwordsMatch = password === confirm_password && password !== ""

    // Check if image is uploaded
    const imageUploaded = imageFile !== null

    // Set form validity
    setFormIsValid(allFieldsFilled && passwordValid && passwordsMatch && imageUploaded)
  }, [formData, passwordValidation, imageFile])

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Clear profile_picture error if it exists
      if (fieldErrors.profile_picture) {
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          profile_picture: null,
        }))
      }
    }
  }

  const handleUniversitySelect = (university) => {
    setSelectedUniversity(university)
    setFormData((prevData) => ({
      ...prevData,
      university_id: university.id,
    }))
    setShowUniversityDropdown(false)
    setSearchQuery("")

    // Clear university_id error if it exists
    if (fieldErrors.university_id) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        university_id: null,
      }))
    }
  }

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  const clearUniversitySelection = () => {
    setSelectedUniversity(null)
    setFormData((prevData) => ({
      ...prevData,
      university_id: "",
    }))
  }

  const filteredUniversities = Array.isArray(universities)
    ? universities.filter((university) => university.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    : []

  const validatePassword = (password) => {
    // Check for minimum length of 8 characters
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }

    // Check for at least one capital letter
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one capital letter"
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      return "Password must contain at least one special character"
    }

    return "" // Empty string means no error
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("") // Reset error messages on form submit
    setFieldErrors({}) // Reset field-specific errors

    // Validate password
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      return
    }

    // Validate password confirmation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match")
      return
    }

    // Check if image is selected
    if (!imageFile) {
      setError("Please select a profile image")
      return
    }

    // Check if university is selected
    if (!formData.university_id) {
      setError("Please select your university")
      return
    }

    setLoading(true)

    // Create a new FormData object for submission
    const form = new FormData()
    form.append("first_name", formData.first_name)
    form.append("last_name", formData.last_name)
    form.append("phone", formData.phone)
    form.append("email", formData.email)
    form.append("university_id", formData.university_id)
    form.append("password", formData.password)
    form.append("password_confirmation", formData.confirm_password)
    form.append("profile_picture", imageFile)

    try {
      // Updated endpoint URL
      const response = await axios.post("https://app.vplaza.com.ng/api/v1/register", form)

      console.log("Success:", response.data)

      // Check if the response is OK and contains the expected data
      if (response.status === 200 || response.status === 201) {
        // Store email in localStorage for verification page if needed
        if (response.data.user) {
          localStorage.setItem("registeredEmail", response.data.user)
        }

        // Show success message with OTP information
        alert('Registration successful! Please Login`)

        // Navigate to OTP verification page
        router.push("/signin")
      }
    } catch (error) {
      console.error("Error:", error)

      // Handle validation errors (422 status)
      if (error.response && error.response.status === 422) {
        const responseData = error.response.data

        // Set the main error message
        if (responseData.message) {
          setError(responseData.message)
        }

        // Handle field-specific errors
        if (responseData.errors) {
          const errors = {}

          // Process each field error
          Object.keys(responseData.errors).forEach((field) => {
            errors[field] = responseData.errors[field][0] // Get the first error message for each field
          })

          setFieldErrors(errors)
        }
      } else {
        // Handle other types of errors
        setError("Registration failed. Please try again later.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Get field error message
  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || null
  }

  // Validation indicator component
  const ValidationIndicator = ({ isValid, text }) => (
    <div className="flex items-center gap-2 text-xs">
      {isValid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
      <span className={isValid ? "text-green-500" : "text-gray-500"}>{text}</span>
    </div>
  )

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-10 pointer-events-none" />

      {/* Desktop and Mobile Layout */}
      <div className="flex flex-col lg:flex-row min-h-screen relative">
        {/* Left Side - Blue Section (Hidden on mobile, visible on desktop) */}
        <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#004AAD] to-[#0063e6] flex-col justify-center items-center p-8 text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white opacity-5"></div>
            <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-white opacity-5"></div>
            <div className="absolute top-1/3 right-20 w-24 h-24 rounded-full bg-white opacity-5"></div>
          </div>

          <div className="max-w-md mx-auto text-center relative z-10">
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center shadow-lg">
                <FaUserGraduate size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">Join the VPlaza Community</h1>
            <p className="text-xl mb-8 opacity-90">
              Connect with students, access resources, and stay updated with campus events
            </p>

            <div className="space-y-6 mt-10">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-white" />
                </div>
                <p className="text-lg">Connect with fellow students</p>
              </div>
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-white" />
                </div>
                <p className="text-lg">Access exclusive university resources</p>
              </div>
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FaCheck className="text-white" />
                </div>
                <p className="text-lg">Stay updated with campus events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header (Only visible on mobile) */}
          <div className="lg:hidden bg-gradient-to-r from-[#004AAD] to-[#0063e6] pt-4 w-full">
            <div className="flex items-center px-4 py-2">
              <button
                onClick={() => router.back()}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                disabled={loading}
              >
                <IoArrowBack color="white" size={24} />
              </button>
            </div>

            {/* Mobile Blue Section */}
            <div className="py-6 px-6 text-white mb-4">
              <h1 className="text-3xl font-bold">Create Account</h1>
              <p className="text-sm opacity-90 mt-2">Join our community of students</p>
            </div>
          </div>

          {/* Form Container */}
          <div
            className={`flex-1 ${
              // On mobile, we need the rounded top corners and white background
              // On desktop, we need full height white background
              "lg:bg-white bg-white lg:rounded-none rounded-tr-[30px] rounded-tl-[30px] lg:mt-0 -mt-5"
            } overflow-y-auto shadow-xl lg:shadow-none relative z-10`}
          >
            {/* Desktop Back Button (Only visible on desktop) */}
            <div className="hidden lg:flex items-center px-8 pt-8">
              <button
                onClick={() => router.push("/")}
                className="p-2 rounded-full text-[#004AAD] hover:bg-blue-50 transition-colors flex items-center"
                disabled={loading}
              >
                <IoArrowBack size={20} />
                <span className="ml-1">Back</span>
              </button>
            </div>

            {/* Form Content */}
            <div className="max-w-2xl mx-auto w-full px-6 py-8 lg:py-12">
              <h1 className="font-bold text-3xl text-[#004AAD] mb-2 lg:block hidden">Create Your Account</h1>
              <p className="text-gray-500 mb-8 lg:block hidden">Fill in your details to get started</p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {/* Profile Image Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-32 h-32 lg:w-36 lg:h-36 rounded-full flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50 hover:bg-gray-100 transition-all shadow-md relative group border-4 border-white"
                    style={{
                      boxShadow: "0 0 0 2px #e5e7eb, 0 0 0 4px #f3f4f6",
                    }}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Profile Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <FaCamera className="text-white text-2xl" />
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-[#004AAD]">
                        <FaCamera size={32} className="mb-2 text-blue-400" />
                        <span className="text-sm text-center text-blue-500 font-medium">Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/*"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-3">Click to upload profile image</p>
                  {getFieldError("profile_picture") && (
                    <p className="text-red-500 text-xs mt-1">{getFieldError("profile_picture")}</p>
                  )}
                </div>

                {/* Form Fields - Desktop 2 columns, Mobile 1 column */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
                  {/* First Name */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="first_name" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <FaUser className="text-blue-500" size={14} />
                      First Name
                    </label>
                    <div className="relative">
                      <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setFormData({
                            ...formData,
                            [name]: value,
                          })
                          if (fieldErrors[name]) {
                            setFieldErrors({
                              ...fieldErrors,
                              [name]: null,
                            })
                          }
                        }}
                        placeholder="Enter your first name"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          getFieldError("first_name")
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        required
                        disabled={loading}
                      />
                    </div>
                    {getFieldError("first_name") && (
                      <p className="text-red-500 text-xs">{getFieldError("first_name")}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="last_name" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <FaUser className="text-blue-500" size={14} />
                      Last Name
                    </label>
                    <div className="relative">
                      <input
                        id="last_name"
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setFormData({
                            ...formData,
                            [name]: value,
                          })
                          if (fieldErrors[name]) {
                            setFieldErrors({
                              ...fieldErrors,
                              [name]: null,
                            })
                          }
                        }}
                        placeholder="Enter your last name"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          getFieldError("last_name")
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        required
                        disabled={loading}
                      />
                    </div>
                    {getFieldError("last_name") && <p className="text-red-500 text-xs">{getFieldError("last_name")}</p>}
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <FaPhone className="text-blue-500" size={14} />
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setFormData({
                            ...formData,
                            [name]: value,
                          })
                          if (fieldErrors[name]) {
                            setFieldErrors({
                              ...fieldErrors,
                              [name]: null,
                            })
                          }
                        }}
                        placeholder="Enter your phone number"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          getFieldError("phone")
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        required
                        disabled={loading}
                      />
                    </div>
                    {getFieldError("phone") && <p className="text-red-500 text-xs">{getFieldError("phone")}</p>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <FaEnvelope className="text-blue-500" size={14} />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setFormData({
                            ...formData,
                            [name]: value,
                          })
                          if (fieldErrors[name]) {
                            setFieldErrors({
                              ...fieldErrors,
                              [name]: null,
                            })
                          }
                        }}
                        placeholder="Enter your email address"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          getFieldError("email")
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        required
                        disabled={loading}
                      />
                    </div>
                    {getFieldError("email") && <p className="text-red-500 text-xs">{getFieldError("email")}</p>}
                  </div>

                  {/* University Dropdown - Full width */}
                  <div className="flex flex-col space-y-1 lg:col-span-2">
                    <label htmlFor="university" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <FaUniversity className="text-blue-500" size={14} />
                      University
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      {/* Selected University Display */}
                      {selectedUniversity ? (
                        <div
                          className={`flex items-center justify-between px-4 py-3 border rounded-xl bg-gray-50 ${
                            getFieldError("university_id") ? "border-red-400" : "border-gray-200"
                          }`}
                        >
                          <span>{selectedUniversity.name}</span>
                          <button
                            type="button"
                            onClick={clearUniversitySelection}
                            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                            disabled={loading}
                          >
                            <IoClose size={18} />
                          </button>
                        </div>
                      ) : (
                        // University Selector
                        <div
                          className={`flex items-center justify-between px-4 py-3 border rounded-xl cursor-pointer bg-gray-50 hover:border-blue-400 transition-all ${
                            getFieldError("university_id") ? "border-red-400" : "border-gray-200"
                          }`}
                          onClick={() => !loading && setShowUniversityDropdown(!showUniversityDropdown)}
                        >
                          <span className={`${loadingUniversities ? "text-gray-400" : "text-gray-700"}`}>
                            {loadingUniversities ? "Loading universities..." : "Select your university"}
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
                              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                    {getFieldError("university_id") && (
                      <p className="text-red-500 text-xs">{getFieldError("university_id")}</p>
                    )}
                    {universityError && <p className="text-red-500 text-xs">{universityError}</p>}
                  </div>

                  {/* Password */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <span className="text-blue-500 font-bold text-sm">#</span>
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setFormData({
                            ...formData,
                            [name]: value,
                          })
                          if (fieldErrors[name]) {
                            setFieldErrors({
                              ...fieldErrors,
                              [name]: null,
                            })
                          }
                        }}
                        placeholder="Create a password"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          getFieldError("password")
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        required
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowPassword(!showPassword)
                          }}
                        >
                          {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                      </div>
                    </div>
                    {getFieldError("password") && <p className="text-red-500 text-xs">{getFieldError("password")}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col space-y-1">
                    <label
                      htmlFor="confirm_password"
                      className="text-sm font-medium text-gray-700 flex items-center gap-1.5"
                    >
                      <span className="text-blue-500 font-bold text-sm">#</span>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirm_password"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={(e) => {
                          const { name, value } = e.target
                          setFormData({
                            ...formData,
                            [name]: value,
                          })
                          if (fieldErrors[name]) {
                            setFieldErrors({
                              ...fieldErrors,
                              [name]: null,
                            })
                          }
                        }}
                        placeholder="Confirm your password"
                        className={`w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 ${
                          getFieldError("password_confirmation")
                            ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-100"
                            : "border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        }`}
                        required
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowConfirmPassword(!showConfirmPassword)
                          }}
                        >
                          {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                      </div>
                    </div>
                    {getFieldError("password_confirmation") && (
                      <p className="text-red-500 text-xs">{getFieldError("password_confirmation")}</p>
                    )}
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Password Requirements:</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <ValidationIndicator isValid={passwordValidation.length} text="At least 8 characters long" />
                    <ValidationIndicator
                      isValid={passwordValidation.capital}
                      text="Contains at least one capital letter"
                    />
                    <ValidationIndicator
                      isValid={passwordValidation.special}
                      text="Contains at least one special character"
                    />
                  </div>
                </div>

                {/* General Error Message */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm animate-fadeIn">
                    {error}
                  </div>
                )}

                {/* Submit Button - Disabled until form is valid */}
                <button
                  type="submit"
                  className={`text-white font-semibold py-3.5 px-4 rounded-xl mt-4 transition-all duration-200 transform ${
                    loading
                      ? "opacity-70 cursor-not-allowed bg-[#004AAD]"
                      : formIsValid
                        ? "bg-[#004AAD] hover:bg-[#0056c7] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                        : "bg-gray-400 cursor-not-allowed"
                  }`}
                  disabled={loading || !formIsValid}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
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
                      Processing...
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </button>

                {/* Form Completion Message */}
                {!formIsValid && !loading && (
                  <p className="text-center text-sm text-gray-500 mt-1 animate-fadeIn">
                    Please complete all fields to enable the Create Account button
                  </p>
                )}
              </form>

              {/* Footer Section */}
              <div className="flex items-center justify-center mt-8 text-sm">
                <span className="text-gray-600">Already have an account?</span>
                <button
                  onClick={() => {
                    if (!loading) router.push("/signin")
                  }}
                  className={`ml-2 text-[#004AAD] font-semibold hover:underline ${loading ? "pointer-events-none" : ""}`}
                  disabled={loading}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
