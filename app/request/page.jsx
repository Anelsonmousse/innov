import Link from "next/link"
import { IoArrowBack, IoHomeSharp, IoStorefrontOutline, IoMailOutline, IoNotificationsOutline, IoHeartOutline, IoLocationOutline, IoNotificationsSharp } from "react-icons/io5"
import CompactRequestForm from "./request-form"

export const metadata = {
  title: "Request Product - VPlaza",
  description: "Request products from sellers in your proximity",
}

export default function RequestPage() {
  const checkLoginAndRedirect = () => {
    // This would normally check if user is logged in
    return true
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 lg:pb-0">
      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Logo and Back */}
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-bold text-[#004AAD]">VPlaza</h1>
              <Link 
                href="/" 
                className="inline-flex items-center text-gray-600 hover:text-[#004AAD] transition-colors group"
              >
                <IoArrowBack className="mr-2 group-hover:-translate-x-1 transition-transform" size={18} />
                <span className="text-sm font-medium">Back to Home</span>
              </Link>
            </div>

            {/* Center - Page Title */}
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900">Request a Product</h2>
              <p className="text-sm text-gray-600 mt-1">Can't find what you're looking for? Let sellers know what you need.</p>
            </div>

            {/* Right side - Navigation */}
            <div className="flex items-center gap-6">
              <Link
                href="/wishlist"
                className="flex items-center gap-2 text-gray-700 hover:text-[#004AAD] transition-colors"
              >
                <IoHeartOutline size={20} />
                <span className="text-sm font-medium">Wishlist</span>
              </Link>
              
              <button className="flex items-center gap-2 text-gray-700 hover:text-[#004AAD] transition-colors relative">
                <IoLocationOutline size={20} />
                <span className="text-sm font-medium">Location</span>
              </button>

              <Link
                href="/notifications"
                className="flex items-center gap-2 text-gray-700 hover:text-[#004AAD] transition-colors relative"
              >
                <div className="relative">
                  <IoNotificationsOutline size={20} />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </div>
                <span className="text-sm font-medium">Notifications</span>
              </Link>

              <Link
                href="/store"
                className="flex items-center gap-2 text-gray-700 hover:text-[#004AAD] transition-colors"
              >
                <IoStorefrontOutline size={20} />
                <span className="text-sm font-medium">Store</span>
              </Link>

              <Link
                href="/profile"
                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-300 transition-all"
              >
                <img src="/diverse-group.png" alt="Profile" className="w-full h-full object-cover" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 lg:px-6 py-8 lg:py-12 pt-12 lg:pt-12">
        <div className="max-w-2xl mx-auto">
          {/* Mobile Page Title - Only show on mobile since no header */}
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-xl font-bold text-gray-900 mb-2">Request a Product</h1>
            <p className="text-gray-600 text-sm">
              Can't find what you're looking for? Request it from sellers in your area.
            </p>
          </div>

          {/* Desktop intro section */}
          <div className="hidden lg:block mb-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <IoMailOutline className="text-2xl text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">How It Works</h3>
              <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-[#004AAD]">1</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Describe Your Need</h4>
                  <p className="text-xs text-gray-600">Tell us what product you're looking for with details</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-[#004AAD]">2</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Sellers Get Notified</h4>
                  <p className="text-xs text-gray-600">Nearby sellers will see your request and respond</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-[#004AAD]">3</span>
                  </div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">Get Responses</h4>
                  <p className="text-xs text-gray-600">Receive offers and choose the best one for you</p>
                </div>
              </div>
            </div>
          </div>

          <CompactRequestForm />

          {/* Mobile tips section */}
          <div className="lg:hidden mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm flex items-center">
                <span className="mr-2">💡</span>
                Tips for Better Results
              </h3>
              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm">•</span>
                  <span>Be specific about product features, size, color, or brand</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm">•</span>
                  <span>Include reference images to help sellers understand your needs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm">•</span>
                  <span>Mention your budget range if you have one in mind</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold text-sm">•</span>
                  <span>Check back regularly for seller responses</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop additional info */}
          <div className="hidden lg:block mt-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-semibold text-gray-900 mb-3 text-base">💡 Tips for Better Results</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Be specific about product features, size, color, or brand preferences</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Include reference images to help sellers understand your needs</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Mention your budget range if you have one in mind</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Check back regularly for seller responses and notifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-3 left-3 right-3 z-30">
        <div className="relative flex items-center justify-between bg-[#004AAD]/95 backdrop-blur-md rounded-xl shadow-xl py-2 px-3 border border-white/10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent rounded-xl"></div>
          
          <Link
            href="/store"
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
          >
            <IoStorefrontOutline size={20} className="text-white" />
            <span className="text-xs mt-0.5 font-medium text-white/90">Store</span>
          </Link>
          
          <button className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all bg-white/20">
            <IoMailOutline size={20} className="text-white" />
            <span className="text-xs mt-0.5 font-medium text-white">Request</span>
          </button>
          
          <Link href="/" className="relative flex flex-col items-center -mt-6">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl border-3 border-[#004AAD] hover:scale-105 transition-transform">
              <IoHomeSharp size={24} className="text-[#004AAD]" />
            </div>
            <span className="text-xs mt-1 font-medium text-white/90">Home</span>
          </Link>
          
          <Link
            href="/notifications"
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
          >
            <div className="relative">
              <IoNotificationsOutline size={20} className="text-white" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white/50"></span>
            </div>
            <span className="text-xs mt-0.5 font-medium text-white/90">Alerts</span>
          </Link>
          
          <Link
            href="/profile"
            className="relative flex flex-col items-center w-14 py-1.5 hover:bg-white/10 rounded-lg transition-all"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <img src="/diverse-group.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs mt-0.5 font-medium text-white/90">Profile</span>
          </Link>
        </div>
      </div>
    </div>
  )
}