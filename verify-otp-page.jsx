"use client"
import { useState, useRef, useEffect } from "react"
import { IoArrowBack, IoMailOutline, IoCheckmarkCircle, IoAlertCircle } from "react-icons/io5"
import { useRouter } from "next/navigation"
import axios from "axios"

const VerifyOtpPage = () => {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [canResend, setCanResend] = useState(true)

  // Create refs for each input
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)]

  // Get email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email is found, redirect to signup
      router.push("/signup")
    }

    // Start with a 0 countdown so user can resend immediately if needed
    setCountdown(0)
    setCanResend(true)
  }, [router])

  // Handle countdown timer for resend button
  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [countdown])

  // Format countdown time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Create a new array with the updated value
    const newOtp = [...otp]
    newOtp[index] = value

    // Update state
    setOtp(newOtp)

    // Clear any previous errors
    if (error) setError("")

    // Auto-advance to next field if value is entered
    if (value !== "" && index < 5) {
      inputRefs[index + 1].current.focus()
    }
  }

  // Handle key down events for navigation between inputs
  const handleKeyDown = (index, e) => {
    // If backspace is pressed and current field is empty, focus previous field
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus()
    }

    // Arrow left/right navigation
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      inputRefs[index - 1].current.focus()
    }

    if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      inputRefs[index + 1].current.focus()
    }
  }

  // Handle paste event to distribute characters across fields
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is numeric and has correct length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.split("").slice(0, 6)
      const newOtp = [...otp]

      digits.forEach((digit, index) => {
        if (index < 6) {
          newOtp[index] = digit
        }
      })

      setOtp(newOtp)

      // Focus the next empty field or the last field
      const nextEmptyIndex = newOtp.findIndex((val) => val === "")
      if (nextEmptyIndex !== -1) {
        inputRefs[nextEmptyIndex].current.focus()
      } else {
        inputRefs[5].current.focus()
      }
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Check if OTP is complete
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    // Check if email is available
    if (!email) {
      setError("Email address is missing. Please go back to the registration page.")
      return
    }

    setLoading(true)
    setError("")

    try {
      console.log("Verifying OTP:", { email, otp: otpValue })

      const response = await axios.post("https://app.vplaza.com.ng/api/v1/verify-otp", {
        email,
        otp: otpValue,
      })

      console.log("Verification response:", response.data)

      if (response.status === 200 || response.status === 201) {
        setSuccess("Email verified successfully!")

        // Short delay before redirecting to sign-in
        setTimeout(() => {
          router.push("/signin")
        }, 1500)
      }
    } catch (error) {
      console.error("Verification error:", error)

      if (error.response) {
        // Handle specific error responses
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message)
        } else {
          setError("Failed to verify OTP. Please try again.")
        }
      } else {
        setError("Network error. Please check your connection and try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return

    // Check if email is available
    if (!email) {
      setError("Email address is missing. Please go back to the registration page.")
      return
    }

    setResendLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Resending OTP to:", email)

      const response = await axios.post("https://app.vplaza.com.ng/api/v1/resend-otp", {
        email,
      })

      console.log("Resend response:", response.data)

      if (response.status === 200 || response.status === 201) {
        setSuccess("OTP has been resent to your email!")

        // Start countdown timer (60 seconds)
        setCountdown(60)
        setCanResend(false)
      }
    } catch (error) {
      console.error("Resend error:", error)

      if (error.response) {
        // Handle specific error responses
        if (error.response.data && error.response.data.message) {
          setError(error.response.data.message)
        } else {
          setError("Failed to resend OTP. Please try again.")
        }
      } else {
        setError("Network error. Please check your connection and try again.")
      }
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">
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
          <h1 className="text-3xl font-bold">Verify Your Email</h1>
          <p className="text-sm opacity-90 mt-2">Enter the 6-digit code sent to your email</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 w-full max-w-md mx-auto">
        {/* Desktop Back Button (Only visible on desktop) */}
        <div className="hidden lg:flex self-start mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full text-[#004AAD] hover:bg-blue-50 transition-colors flex items-center"
            disabled={loading}
          >
            <IoArrowBack size={20} />
            <span className="ml-1">Back</span>
          </button>
        </div>

        {/* Card Container */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:mt-0 -mt-5 lg:rounded-2xl rounded-tr-[30px] rounded-tl-[30px]">
          {/* Desktop Title (Only visible on desktop) */}
          <div className="hidden lg:block mb-6">
            <h1 className="text-3xl font-bold text-[#004AAD]">Verify Your Email</h1>
            <p className="text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
          </div>

          {/* Email Display */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6 flex items-center">
            <IoMailOutline className="text-blue-500 mr-3 flex-shrink-0" size={24} />
            <div>
              <p className="text-sm text-gray-600">We've sent a verification code to:</p>
              <p className="font-medium text-[#004AAD]">{email || "your email address"}</p>
              <p className="text-xs text-gray-500 mt-1">Please check your inbox or spam folder for the OTP code</p>
            </div>
          </div>

          {/* OTP Input Form */}
          <form onSubmit={handleSubmit}>
            <label htmlFor="otp-1" className="block text-sm font-medium text-gray-700 mb-3">
              Enter 6-digit verification code:
            </label>

            {/* OTP Input Fields */}
            <div className="flex justify-between gap-2 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                  autoFocus={index === 0}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm mb-6 flex items-start">
                <IoAlertCircle className="text-red-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 text-sm mb-6 flex items-start">
                <IoCheckmarkCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 ${
                loading
                  ? "opacity-70 cursor-not-allowed bg-[#004AAD]"
                  : "bg-[#004AAD] hover:bg-[#0056c7] hover:shadow-lg"
              }`}
              disabled={loading || otp.join("").length !== 6}
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
                  Verifying...
                </div>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend OTP Section */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || resendLoading}
                  className={`text-sm px-4 py-2 rounded-lg transition-all ${
                    canResend && !resendLoading
                      ? "text-[#004AAD] hover:bg-blue-50 font-medium"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {resendLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500"
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
                      Sending...
                    </div>
                  ) : (
                    "Resend Code"
                  )}
                </button>

                {!canResend && <span className="text-sm text-gray-500">Wait {formatTime(countdown)} to resend</span>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default VerifyOtpPage
