"use client"
import { useRouter } from "next/navigation"
import {
  IoArrowBack,
  IoHomeOutline,
  IoStorefrontOutline,
  IoHeartOutline,
  IoNotificationsOutline,
  IoPersonOutline,
} from "react-icons/io5"

export default function PrivacyPolicyPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">Privacy Policy</h1>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: May 17, 2024</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
              <p>
                Welcome to VPlaza. We respect your privacy and are committed to protecting your personal data. This
                privacy policy will inform you about how we look after your personal data when you visit our website or
                use our mobile application and tell you about your privacy rights and how the law protects you.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Information We Collect</h2>
              <p className="mb-3">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped
                together as follows:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Identity Data</strong> includes first name, last name, username or similar identifier, and
                  profile pictures.
                </li>
                <li>
                  <strong>Contact Data</strong> includes email address, phone number, and university affiliation.
                </li>
                <li>
                  <strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type
                  and version, time zone setting and location, browser plug-in types and versions, operating system and
                  platform, and other technology on the devices you use to access our platform.
                </li>
                <li>
                  <strong>Profile Data</strong> includes your username and password, purchases or orders made by you,
                  your interests, preferences, feedback, and survey responses.
                </li>
                <li>
                  <strong>Usage Data</strong> includes information about how you use our website, products, and
                  services.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. How We Use Your Information</h2>
              <p className="mb-3">
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal
                data in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To register you as a new user.</li>
                <li>To process and deliver your orders.</li>
                <li>To manage our relationship with you.</li>
                <li>To enable you to participate in platform features.</li>
                <li>To administer and protect our business and this platform.</li>
                <li>To deliver relevant content and advertisements to you.</li>
                <li>
                  To use data analytics to improve our platform, products/services, marketing, customer relationships,
                  and experiences.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally
                lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to
                your personal data to those employees, agents, contractors, and other third parties who have a business
                need to know. They will only process your personal data on our instructions, and they are subject to a
                duty of confidentiality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it
                for, including for the purposes of satisfying any legal, accounting, or reporting requirements. To
                determine the appropriate retention period for personal data, we consider the amount, nature, and
                sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure of your
                personal data, the purposes for which we process your personal data, and whether we can achieve those
                purposes through other means, and the applicable legal requirements.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Your Legal Rights</h2>
              <p className="mb-3">
                Under certain circumstances, you have rights under data protection laws in relation to your personal
                data, including the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request access to your personal data.</li>
                <li>Request correction of your personal data.</li>
                <li>Request erasure of your personal data.</li>
                <li>Object to processing of your personal data.</li>
                <li>Request restriction of processing your personal data.</li>
                <li>Request transfer of your personal data.</li>
                <li>Right to withdraw consent.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Third-Party Links</h2>
              <p>
                This platform may include links to third-party websites, plug-ins, and applications. Clicking on those
                links or enabling those connections may allow third parties to collect or share data about you. We do
                not control these third-party websites and are not responsible for their privacy statements. When you
                leave our platform, we encourage you to read the privacy policy of every website you visit.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to the Privacy Policy</h2>
              <p>
                We may update our privacy policy from time to time. We will notify you of any changes by posting the new
                privacy policy on this page and updating the "Last updated" date at the top of this privacy policy. You
                are advised to review this privacy policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Us</h2>
              <p>
                If you have any questions about this privacy policy or our privacy practices, please contact us at:{" "}
                <a href="mailto:privacy@vplaza.com.ng" className="text-[#004AAD] hover:underline">
                  privacy@vplaza.com.ng
                </a>
              </p>
            </section>
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
