"use client"

import { useState, useEffect, useRef } from "react"
import { IoArrowBack } from "react-icons/io5"
import { FaEnvelope } from "react-icons/fa"
import { useRouter } from "next/navigation"
import axios from "axios"

const VerifyOTPPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [countdown, setCountdown] = useState(0)
  const [resendLoading, setResendLoading] = useState(false)

  const inputRefs = useRef([])

  // Initialize refs for the 6 input fields
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  // Get email from localStorage on component mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("registeredEmail")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      // If no email is found, redirect to signup
      router.push("/signup")
    }

    // Focus on the first input field
    if (inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus()
      }, 500)
    }
  }, [router])

  // Countdown timer for resend button
  useEffect(() => {
    // Start with 60 seconds countdown
    setCountdown(60)

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timer)
          return 0
        }
        return prevCountdown - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return

    const newOtp = [...otp]

    // If pasting multiple digits
    if (value.length > 1) {
      const digits = value.split("").slice(0, 6)
      const newFilledOtp = [...otp]

      digits.forEach((digit, idx) => {
        if (idx + index < 6) {
          newFilledOtp[idx + index] = digit
        }
      })

      setOtp(newFilledOtp)

      // Focus on the appropriate input after pasting
      const nextIndex = Math.min(index + digits.length, 5)
      if (inputRefs.current[nextIndex]) {
        inputRefs.current[nextIndex].focus()
      }
      return
    }

    // Handle single digit input
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-advance to next input if a digit was entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Handle key down events (for backspace navigation)
  const handleKeyDown = (index, e) => {
    // If backspace is pressed and current field is empty, go to previous field
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Handle OTP verification
  const handleVerify = async (e) => {
    e.preventDefault()

    // Check if OTP is complete
    const otpValue = otp.join("")
    if (otpValue.length !== 6) {
      setError("Please enter the complete 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      console.log("Verifying OTP:", { email, otp: otpValue })

      const response = await axios.post("https://app.vplaza.com.ng/api/v1/verify-otp", {
        email,
        otp: otpValue,
      })

      console.log("Verification response:", response.data)

      if (response.status === 200 || response.status === 201) {
        setSuccess("Email verified successfully!")

        // Clear the stored email as it's no longer needed
        localStorage.removeItem("registeredEmail")

        // Show success message briefly before redirecting
        setTimeout(() => {
          // Store success message for sign-in page
          sessionStorage.setItem("verificationSuccess", "Your email has been verified successfully. Please sign in.")
          router.push("/signin")
        }, 1500)
      }
    } catch (error) {
      console.error("Verification error:", error)

      if (error.response) {
        // Handle specific error messages from the API
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
    if (countdown > 0 || resendLoading) return

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

        // Reset countdown
        setCountdown(60)

        // Start countdown again
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => {
            if (prevCountdown <= 1) {
              clearInterval(timer)
              return 0
            }
            return prevCountdown - 1
          })
        }, 1000)
      }
    } catch (error) {
      console.error("Resend error:", error)

      if (error.response) {
        // Handle specific error messages from the API
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

  // Format time for countdown display
  const formatTime = (seconds) => {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      {/* Mobile Header */}
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

        <div className="py-6 px-6 text-white mb-4">
          <h1 className="text-3xl font-bold">Verify Email</h1>
          <p className="text-sm opacity-90 mt-2">Enter the OTP sent to your email</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-0">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:mt-0 -mt-5 lg:rounded-2xl rounded-tr-[30px] rounded-tl-[30px]">
          {/* Desktop Back Button */}
          <div className="hidden lg:flex items-center mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full text-[#004AAD] hover:bg-blue-50 transition-colors flex items-center"
              disabled={loading}
            >
              <IoArrowBack size={20} />
              <span className="ml-1">Back</span>
            </button>
          </div>

          {/* Desktop Title */}
          <div className="hidden lg:block mb-8">
            <h1 className="text-3xl font-bold text-[#004AAD]">Verify Your Email</h1>
            <p className="text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
          </div>

          {/* Email Display */}
          <div className="flex items-center justify-center mb-6 bg-blue-50 p-4 rounded-xl">
            <FaEnvelope className="text-blue-500 mr-3" size={20} />
            <div>
              <p className="text-sm text-gray-500">OTP sent to:</p>
              <p className="font-medium text-gray-700">{email || "Loading..."}</p>
            </div>
          </div>

          {/* OTP Input Fields */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={6} // Allow pasting full OTP
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-bold border-2 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm animate-fadeIn">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-100 text-sm animate-fadeIn">
                {success}
              </div>
            )}

            {/* Verify Button */}
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
          </form>

          {/* Resend OTP Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 mb-3">Didn't receive the code?</p>
            <div className="flex flex-col items-center">
              {countdown > 0 && (
                <p className="text-sm text-gray-500 mb-2">
                  Resend available in <span className="font-medium">{formatTime(countdown)}</span>
                </p>
              )}
              <button
                onClick={handleResendOtp}
                className={`text-[#004AAD] font-medium hover:underline ${
                  countdown > 0 || resendLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={countdown > 0 || resendLoading}
              >
                {resendLoading ? "Sending..." : "Resend OTP"}
              </button>
            </div>
          </div>

          {/* Check Spam Notice */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Please check your spam folder if you don't see the email in your inbox.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyOtp() {
  return <VerifyOTPPage />
}
