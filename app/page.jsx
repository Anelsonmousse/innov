"use client"
import { useEffect } from "react"
import HomePage from "../home-page"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  // Register service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope)
        })
        .catch((err) => {
          console.log("ServiceWorker registration failed: ", err)
        })
    }

    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      // If not logged in, redirect to signup page
      // Uncomment the line below to enable automatic redirect to signup
      // router.push("/signup")
    }
  }, [router])

  return <HomePage />
}
