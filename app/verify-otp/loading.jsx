export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col items-center">
        <div className="flex space-x-2 justify-center items-center">
          <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce delay-100"></div>
          <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce delay-200"></div>
        </div>
        <p className="text-blue-500 mt-4 font-medium">Loading verification page...</p>
      </div>
    </div>
  )
}
