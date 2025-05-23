"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  IoArrowBack,
  IoHelpCircleOutline,
  IoChevronDown,
  IoChevronUp,
  IoSearchOutline,
  IoMailOutline,
  IoCallOutline,
  IoLogoWhatsapp,
  IoHomeOutline,
  IoStorefrontOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoPersonOutline,
} from "react-icons/io5"

export default function HelpCenterPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  // FAQ data
  const faqs = [
    {
      id: 1,
      question: "How do I create an account?",
      answer:
        "To create an account, click on the 'Sign Up' button on the homepage. Fill in your details including your name, email, phone number, university, and create a password. Upload a profile picture and submit the form. You'll receive a verification code via email to complete your registration.",
    },
    {
      id: 2,
      question: "How do I list a product for sale?",
      answer:
        "To list a product, go to your profile and click on 'My Store'. Then click the 'Add Product' button. Fill in the product details including name, description, price, category, and upload clear images. Submit the form to publish your listing.",
    },
    {
      id: 3,
      question: "How do I contact a seller?",
      answer:
        "When viewing a product, you'll see 'Message Seller' and 'Call Seller' buttons. Click on either to initiate contact with the seller. The message option will open WhatsApp with a pre-filled message about the product.",
    },
    {
      id: 4,
      question: "How do I add items to my wishlist?",
      answer:
        "To add an item to your wishlist, click on the heart icon on any product card or product detail page. You can view all your wishlist items by clicking on the 'Wishlist' option in the navigation menu.",
    },
    {
      id: 5,
      question: "How do I change my password?",
      answer:
        "To change your password, go to your profile page and click on 'Change Password' in the settings section. Enter your current password and your new password twice to confirm. Click 'Change Password' to save your changes.",
    },
    {
      id: 6,
      question: "How do I update my profile information?",
      answer:
        "To update your profile, go to your profile page and click the 'Edit' button. You can update your name, email, phone number, and profile picture. Click 'Save Changes' when you're done.",
    },
    {
      id: 7,
      question: "Is my personal information secure?",
      answer:
        "Yes, we take data security seriously. Your personal information is encrypted and stored securely. We do not share your information with third parties without your consent. For more details, please refer to our Privacy Policy.",
    },
    {
      id: 8,
      question: "How do I delete my account?",
      answer:
        "To delete your account, please contact our support team through the contact form in the Help Center. We'll process your request and confirm once your account has been deleted.",
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter((faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()))

  // Toggle FAQ expansion
  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(id)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">Help Center</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors flex items-center text-[#004AAD]"
            >
              <IoArrowBack size={20} />
              <span className="ml-1">Back</span>
            </button>
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Help Center</h1>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#004AAD] text-white py-8 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <IoHelpCircleOutline size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-4">How can we help you?</h1>
            <p className="text-white/80 mb-6">
              Find answers to common questions or contact our support team for assistance
            </p>

            {/* Search Bar */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-10 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
              />
              <IoSearchOutline size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* FAQ Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <IoSearchOutline size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-500 mb-4">We couldn't find any FAQs matching your search.</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span className="font-medium text-gray-800">{faq.question}</span>
                      {expandedFaq === faq.id ? (
                        <IoChevronUp className="text-gray-500 flex-shrink-0" />
                      ) : (
                        <IoChevronDown className="text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="p-4 bg-white border-t border-gray-200 animate-fadeIn">
                        <p className="text-gray-700">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Support</h2>
            <p className="text-gray-600 mb-6">
              Couldn't find what you're looking for? Our support team is here to help you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <IoMailOutline size={24} className="text-[#004AAD]" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-3">Send us an email and we'll respond within 24 hours</p>
                <a href="mailto:support@vplaza.com.ng" className="text-[#004AAD] font-medium text-sm hover:underline">
                  support@vplaza.com.ng
                </a>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <IoCallOutline size={24} className="text-[#004AAD]" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">Phone Support</h3>
                <p className="text-gray-600 text-sm mb-3">Available Monday to Friday, 9am - 5pm</p>
                <a href="tel:+2347073119777" className="text-[#004AAD] font-medium text-sm hover:underline">
                  07073119777
                </a>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <IoLogoWhatsapp size={24} className="text-green-600" />
                </div>
                <h3 className="font-medium text-gray-800 mb-2">WhatsApp Support</h3>
                <p className="text-gray-600 text-sm mb-3">Get quick responses via WhatsApp</p>
                <a
                  href="https://wa.me/2347073119777"
                  className="flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IoLogoWhatsapp size={18} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#004AAD] text-white py-2 px-4 flex items-center justify-between z-20 shadow-lg">
        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/store")}
        >
          <IoStorefrontOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Store</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/wishlist")}
        >
          <IoHeartOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Wishlist</span>
        </button>

        <button className="flex flex-col items-center justify-center -mt-6 relative" onClick={() => router.push("/")}>
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-[#004AAD]">
            <IoHomeOutline size={26} className="text-[#004AAD]" />
          </div>
          <span className="text-[10px] mt-1 font-light">Home</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors relative"
          onClick={() => router.push("/notifications")}
        >
          <div className="relative">
            <IoNotificationsOutline size={22} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-[10px] mt-1 font-light">Alerts</span>
        </button>

        <button
          className="flex flex-col items-center justify-center w-16 py-1 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => router.push("/profile")}
        >
          <IoPersonOutline size={22} />
          <span className="text-[10px] mt-1 font-light">Profile</span>
        </button>
      </div>
    </div>
  )
}
