import Link from "next/link"
import { IoArrowBack } from "react-icons/io5"
import RequestForm from "./request-form"

export const metadata = {
  title: "Request Product - VPlaza",
  description: "Request products from sellers in your proximity",
}

export default function RequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-[#004AAD] transition-colors">
            <IoArrowBack className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Request a Product</h1>
            <p className="text-gray-600">
              Can't find what you're looking for? Request it from sellers in your proximity.
            </p>
          </div>

          <RequestForm />
        </div>
      </div>
    </div>
  )
}
