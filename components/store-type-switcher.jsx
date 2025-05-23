"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { IoStorefrontOutline, IoFastFoodOutline, IoChevronDownOutline, IoCheckmarkCircle } from "react-icons/io5"

const StoreTypeSwitcher = ({ activeStore, stores, onStoreChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".store-switcher")) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Handle store type change
  const handleStoreSelect = (store) => {
    onStoreChange(store)
    setIsOpen(false)
  }

  // Get available store type to create
  const getAvailableStoreType = () => {
    if (!stores || stores.length === 0) return "regular"
    const hasRegularStore = stores.some((store) => store.type === "regular")
    return hasRegularStore ? "food" : "regular"
  }

  // Check if user can create a new store type
  const canCreateNewStoreType = () => {
    if (!stores || stores.length === 0) return true
    const hasRegularStore = stores.some((store) => store.type === "regular")
    const hasFoodStore = stores.some((store) => store.type === "food")
    return !(hasRegularStore && hasFoodStore)
  }

  return (
    <div className="store-switcher relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center">
          {activeStore?.type === "food" ? (
            <IoFastFoodOutline size={20} className="text-orange-500 mr-2" />
          ) : (
            <IoStorefrontOutline size={20} className="text-[#004AAD] mr-2" />
          )}
          <span className="font-medium capitalize">{activeStore?.type || "Regular"} Store</span>
        </div>
        <IoChevronDownOutline
          size={18}
          className={`text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-fadeIn">
          <div className="py-1">
            {stores.map((store) => (
              <button
                key={store.id}
                onClick={() => handleStoreSelect(store)}
                className={`flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeStore?.id === store.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-100 flex items-center justify-center">
                  {store.type === "food" ? (
                    <IoFastFoodOutline size={16} className="text-orange-500" />
                  ) : (
                    <IoStorefrontOutline size={16} className="text-[#004AAD]" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{store.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{store.type} Store</p>
                </div>
                {activeStore?.id === store.id && <IoCheckmarkCircle size={18} className="text-[#004AAD]" />}
              </button>
            ))}
          </div>

          {canCreateNewStoreType() && (
            <div className="border-t border-gray-100 py-2 px-3">
              <button
                onClick={() => router.push(`/store/create?type=${getAvailableStoreType()}`)}
                className="w-full py-2 text-sm bg-[#004AAD] text-white rounded-lg flex items-center justify-center hover:bg-[#0056c7] transition-colors"
              >
                {getAvailableStoreType() === "food" ? (
                  <IoFastFoodOutline size={16} className="mr-2" />
                ) : (
                  <IoStorefrontOutline size={16} className="mr-2" />
                )}
                Create {getAvailableStoreType() === "food" ? "Food" : "Regular"} Store
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default StoreTypeSwitcher
