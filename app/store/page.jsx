"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import StorePage from "../../store-page"
import StoreSwitcher from "@/components/store-switcher"

export default function Page() {
  const router = useRouter()

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/signin")
    }
  }, [router])

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-0">
        <StoreSwitcher />
      </div>
      <StorePage />
    </>
  )
}
