"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  IoArrowBack,
  IoLockClosedOutline,
  IoKeyOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
} from "react-icons/io5"

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    password_confirmation: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    special: false,
  })
  const router = useRouter()

  useEffect(() => {
    // Get email from session storage
    const email = sessionStorage.getItem("resetEmail")
    if (email) {
      setFormData((prev) => ({ ...prev, email }))
    } else {
      // If no email is found, redirect to forgot password page
      router.push("/forgot-password")
    }
  }, [])

  useEffect(() => {
    // Check password strength
    const { password } = formData
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    })
  }, [formData]) // Updated to use formData as dependency

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    // Validate password
    if (!passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.special) {
      setError("Password does not meet the requirements")
      return
    }

    // Validate password confirmation
    if (formData.password !== formData.password_confirmation) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      console.log("Sending reset password request with data:", {
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      })

      const response = await fetch("https://app.vplaza.com.ng/api/v1/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log("Reset password response:", data)

      if (response.ok) {
        // Clear the stored email
        sessionStorage.removeItem("resetEmail")

        // Store success message for login page
        sessionStorage.setItem("passwordResetSuccess", "true")

        // Redirect to login page
        router.push("/signin")
      } else {
        setError(data.message || "Failed to reset password. Please try again.")
      }
    } catch (err) {
      console.error("Error resetting password:", err)
      setError("An error occurred. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col">
      <div className="flex-1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <Link href="/forgot-password" className="flex items-center text-blue-600 mb-6 px-4 sm:px-0">
            <IoArrowBack className="mr-2" />
            Back to Forgot Password
          </Link>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter the OTP sent to your email and create a new password
          </p>
          <div className="mt-2 text-center text-sm text-blue-600 bg-blue-50 p-2 rounded-md border border-blue-200 mx-4 sm:mx-0">
            <IoAlertCircleOutline className="inline-block mr-1" />
            Please check your email inbox or spam folder for the OTP
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                  OTP Code
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoKeyOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={formData.otp}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter OTP code"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="New password"
                  />
                </div>
                <div className="mt-2 space-y-1">
                  <div
                    className={`text-xs flex items-center ${passwordStrength.length ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {passwordStrength.length ? (
                      <IoCheckmarkCircleOutline className="mr-1" />
                    ) : (
                      <span className="w-4 h-4 inline-block mr-1">•</span>
                    )}
                    At least 8 characters
                  </div>
                  <div
                    className={`text-xs flex items-center ${passwordStrength.uppercase ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {passwordStrength.uppercase ? (
                      <IoCheckmarkCircleOutline className="mr-1" />
                    ) : (
                      <span className="w-4 h-4 inline-block mr-1">•</span>
                    )}
                    At least one uppercase letter
                  </div>
                  <div
                    className={`text-xs flex items-center ${passwordStrength.special ? "text-blue-600" : "text-gray-500"}`}
                  >
                    {passwordStrength.special ? (
                      <IoCheckmarkCircleOutline className="mr-1" />
                    ) : (
                      <span className="w-4 h-4 inline-block mr-1">•</span>
                    )}
                    At least one special character
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirm new password"
                  />
                </div>
                {formData.password &&
                  formData.password_confirmation &&
                  formData.password !== formData.password_confirmation && (
                    <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                  )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
