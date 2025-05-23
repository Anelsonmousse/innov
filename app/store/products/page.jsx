"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import StoreProductsPage from "../../../store-products-page"

export default function Page() {
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    }
  }, [router])

  return <StoreProductsPage />
}
