export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white p-4 shadow-sm">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="ml-4 h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="h-8 w-64 bg-gray-200 rounded mb-6 animate-pulse"></div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-gray-200 animate-pulse"></div>
              ))}
            </div>

            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>

            <div className="h-12 bg-gray-200 rounded-xl mt-6 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
