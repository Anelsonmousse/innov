"use client"

import { useState, useEffect } from "react"
import { PlusCircle, ChevronDown, ShoppingBag, Utensils } from "lucide-react"
import Link from "next/link"

export default function StoreSwitcher() {
  const [stores, setStores] = useState([])
  const [activeStore, setActiveStore] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        // Use the correct endpoint to get user's stores
        const response = await fetch("https://app.vplaza.com.ng/api/v1/stores/user/my", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const responseData = await response.json()

          // Correctly access the stores data from the API response
          const userStores = responseData.data || []
          setStores(userStores)

          // Set active store from URL or localStorage or first store
          const storeType =
            new URLSearchParams(window.location.search).get("type") ||
            localStorage.getItem("activeStoreType") ||
            (userStores.length > 0 ? userStores[0].type : "regular")

          setActiveStore(storeType)
          localStorage.setItem("activeStoreType", storeType)
        }
      } catch (error) {
        console.error("Error fetching stores:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStores()
  }, [])

  const handleStoreChange = (storeType) => {
    setActiveStore(storeType)
    localStorage.setItem("activeStoreType", storeType)
    setIsDropdownOpen(false)

    // Reload the page with the new store type
    window.location.href = `/store?type=${storeType}`
  }

  // Check if user has each store type
  const hasRegularStore = stores.some((store) => store.type === "regular")
  const hasFoodStore = stores.some((store) => store.type === "food")

  return (
    <div className="fixed bottom-20 right-4 z-[9999]">
      {isLoading ? (
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-md"></div>
      ) : (
        <>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between w-48 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <div className="flex items-center">
              {activeStore === "food" ? (
                <Utensils className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <ShoppingBag className="h-5 w-5 mr-2 text-green-600" />
              )}
              <span>{activeStore === "food" ? "Food Store" : "Regular Store"}</span>
            </div>
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>

          {isDropdownOpen && (
            <div className="absolute bottom-full mb-1 right-0 w-48 bg-white shadow-lg rounded-md py-1 border border-gray-200 z-[10000]">
              {hasRegularStore && (
                <button
                  onClick={() => handleStoreChange("regular")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeStore === "regular" ? "bg-gray-100 text-green-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Regular Store
                </button>
              )}

              {hasFoodStore && (
                <button
                  onClick={() => handleStoreChange("food")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeStore === "food" ? "bg-gray-100 text-green-600" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Utensils className="h-5 w-5 mr-2" />
                  Food Store
                </button>
              )}

              <div className="border-t border-gray-100 my-1"></div>

              {/* Only show "Create Regular Store" if user doesn't have one */}
              {!hasRegularStore && (
                <Link
                  href="/store/create?type=regular"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <PlusCircle className="h-5 w-5 mr-2 text-green-600" />
                  Create Regular Store
                </Link>
              )}

              {/* Only show "Create Food Store" if user doesn't have one */}
              {!hasFoodStore && (
                <Link
                  href="/store/create?type=food"
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <PlusCircle className="h-5 w-5 mr-2 text-green-600" />
                  Create Food Store
                </Link>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
