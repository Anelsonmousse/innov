"use client"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Create the auth context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)
  const router = useRouter()

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      // You could fetch user data here if needed
      // fetchUserData(storedToken).then(userData => setUser(userData))
    }
    setLoading(false)
  }, [])

  // Handle 401 unauthorized errors
  const handle401Error = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    router.push("/signin")
  }

  // Custom fetch wrapper that handles 401 errors
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      ...options.headers,
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      if (response.status === 401) {
        handle401Error()
        throw new Error("Unauthorized")
      }

      return response
    } catch (error) {
      if (error.message === "Unauthorized") {
        throw error
      }
      throw error
    }
  }

  // Login function
  const login = (userToken, userData) => {
    localStorage.setItem("token", userToken)
    setToken(userToken)
    setUser(userData)
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    router.push("/signin")
  }

  // Check if user is logged in
  const isLoggedIn = () => {
    return !!token
  }

  // Get token
  const getToken = () => {
    return token
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isLoggedIn,
        getToken,
        handle401Error,
        authenticatedFetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
