export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="w-16 h-16 border-4 border-[#004AAD] border-t-transparent rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-medium text-gray-700">Loading request form...</h2>
      <p className="text-gray-500 mt-2">Please wait while we prepare your request form.</p>
    </div>
  )
}
