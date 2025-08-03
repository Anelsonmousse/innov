import Link from "next/link"
import { IoArrowBack } from "react-icons/io5"
import CompactRequestForm from "./request-form"

export const metadata = {
  title: "Request Product - VPlaza",
  description: "Request products from sellers in your proximity",
}

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        {/* Header */}
        <div className="mb-4">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#004AAD] transition-colors text-sm">
            <IoArrowBack className="mr-1.5 text-base" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-1">Request a Product</h1>
            <p className="text-gray-600 text-sm">
              Can't find what you're looking for? Request it from sellers in your area.
            </p>
          </div>

          <CompactRequestForm />
        </div>
      </div>
    </div>
  )
}
