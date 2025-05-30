"use client"
import { useState, useRef, useEffect } from "react"
import { IoArrowBack, IoEyeOutline, IoEyeOffOutline } from "react-icons/io5"
import { FaEnvelope, FaLock, FaBusinessTime } from "react-icons/fa"
import { PiShoppingCartFill } from "react-icons/pi"
import { useRouter } from "next/navigation"
import axios from "axios"

const SignInPage = () => {
  const router = useRouter()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Focus the email input on component mount
  useEffect(() => {
    if (emailRef.current) {
      emailRef.current.focus()
    }

    // Check if user just reset their password
    const passwordResetSuccess = sessionStorage.getItem("passwordResetSuccess")
    if (passwordResetSuccess) {
      setSuccessMessage("Password reset successful! You can now log in with your new password.")
      sessionStorage.removeItem("passwordResetSuccess")
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError("")

    const email = emailRef.current.value
    const password = passwordRef.current.value

    const form = new FormData()
    form.append("email", email)
    form.append("password", password)

    try {
      const response = await axios.post("https://app.vplaza.com.ng/api/v1/login", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      // Check if the response is OK and contains the expected data
      if ((response.status === 200 || response.status === 201) && response.data.status === "success") {
        // Store the token and user data
        localStorage.setItem("token", response.data.data.access_token)
        localStorage.setItem("email", response.data.data.user)
        localStorage.setItem("university", response.data.data.university)
        localStorage.setItem("token_type", response.data.data.token_type)

        console.log("Success:", response.data)
        router.push("/")
      } else {
        console.log("Failed:", response.data)
        setError(response.data.message || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)

      // Check if there's a specific error message from the API
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      } else {
        setError("Login failed. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

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
                <PiShoppingCartFill size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">Welcome Back!</h1>
            <p className="text-xl mb-8 opacity-90">
              Login to access your VPlaza account and connect with your local community
            </p>

            <div className="space-y-6 mt-10">
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-white" />
                </div>
                <p className="text-lg">Access your messages and notifications</p>
              </div>
              <div className="flex items-center space-x-4 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <FaBusinessTime className="text-white" />
                </div>
                <p className="text-lg">Top Deals for you</p>
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
              <h1 className="text-3xl font-bold">Login</h1>
              <p className="text-sm opacity-90 mt-2">Welcome back to VPlaza</p>
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
            <div className="max-w-md mx-auto w-full px-6 py-8 lg:py-12 flex flex-col justify-between  lg:min-h-0">
              <div>
                <h1 className="font-bold text-3xl text-[#004AAD] mb-2 lg:block hidden">Login</h1>
                <p className="text-gray-500 mb-8 lg:block hidden">Welcome back! Please enter your details</p>

                {/* Success Message */}
                {successMessage && (
                  <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-sm animate-fadeIn">
                    {successMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-8 lg:mt-0">
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
                        ref={emailRef}
                        placeholder="Enter your email address"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col space-y-1">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                      <FaLock className="text-blue-500" size={14} />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        ref={passwordRef}
                        placeholder="Enter your password"
                        className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-all duration-200 border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-50 focus:border-blue-400"
                        required
                        disabled={loading}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <button
                          type="button"
                          className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => router.push("/forgot-password")}
                      className="text-sm font-medium text-[#004AAD] hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm animate-fadeIn">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`text-white font-semibold py-3.5 px-4 rounded-xl mt-4 transition-all duration-200 transform ${
                      loading
                        ? "opacity-70 cursor-not-allowed bg-[#004AAD]"
                        : "bg-[#004AAD] hover:bg-[#0056c7] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                    }`}
                    disabled={loading}
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
                        Signing In...
                      </div>
                    ) : (
                      "Login"
                    )}
                  </button>
                </form>
              </div>

              {/* Footer Section */}
              <div className="flex items-center justify-center mt-8 text-sm">
                <span className="text-gray-600">Don't have an account?</span>
                <button
                  onClick={() => {
                    if (!loading) router.push("/signup")
                  }}
                  className={`ml-2 text-[#004AAD] font-semibold hover:underline ${
                    loading ? "pointer-events-none" : ""
                  }`}
                  disabled={loading}
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
