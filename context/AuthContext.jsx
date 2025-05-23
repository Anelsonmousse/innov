"use client"
import { createContext, useContext, useState, useEffect } from "react"

// Create the auth context
const AuthContext = createContext()

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(null)

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
    <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn, getToken }}>
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
