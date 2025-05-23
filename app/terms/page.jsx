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

export default function TermsAndConditionsPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-0">
      {/* Top Header - Mobile */}
      <div className="lg:hidden bg-white p-4 shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <IoArrowBack size={24} className="text-gray-700" />
          </button>
          <h1 className="ml-4 text-lg font-semibold text-gray-800">Terms & Conditions</h1>
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
            <h1 className="ml-4 text-xl font-semibold text-gray-800">Terms & Conditions</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 lg:py-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6 lg:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Terms and Conditions</h1>
          <p className="text-gray-500 mb-8">Last updated: May 17, 2024</p>

          <div className="space-y-6 text-gray-700">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
              <p>
                Welcome to VPlaza. These terms and conditions outline the rules and regulations for the use of VPlaza's
                website and mobile application. By accessing this website or using our mobile application, we assume you
                accept these terms and conditions in full. Do not continue to use VPlaza's website or mobile application
                if you do not accept all of the terms and conditions stated on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">2. User Accounts</h2>
              <p className="mb-3">
                When you create an account with us, you guarantee that the information you provide is accurate,
                complete, and current at all times. Inaccurate, incomplete, or obsolete information may result in the
                immediate termination of your account on the platform.
              </p>
              <p className="mb-3">
                You are responsible for maintaining the confidentiality of your account and password, including but not
                limited to the restriction of access to your computer and/or account. You agree to accept responsibility
                for any and all activities or actions that occur under your account and/or password.
              </p>
              <p>
                You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your
                account.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Content</h2>
              <p className="mb-3">
                Our platform allows you to post, link, store, share and otherwise make available certain information,
                text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post
                on or through the platform, including its legality, reliability, and appropriateness.
              </p>
              <p className="mb-3">
                By posting Content on or through the platform, you represent and warrant that: (i) the Content is yours
                (you own it) and/or you have the right to use it and the right to grant us the rights and license as
                provided in these Terms, and (ii) that the posting of your Content on or through the platform does not
                violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any
                person or entity.
              </p>
              <p>
                We reserve the right to terminate the account of any user found to be infringing on a copyright or other
                intellectual property rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Prohibited Activities</h2>
              <p className="mb-3">The following activities are strictly prohibited on our platform:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Posting or transmitting any content that is unlawful, harmful, threatening, abusive, harassing,
                  defamatory, vulgar, obscene, or otherwise objectionable.
                </li>
                <li>
                  Impersonating any person or entity, or falsely stating or otherwise misrepresenting your affiliation
                  with a person or entity.
                </li>
                <li>
                  Posting or transmitting any unsolicited or unauthorized advertising, promotional materials, "junk
                  mail," "spam," "chain letters," "pyramid schemes," or any other form of solicitation.
                </li>
                <li>
                  Posting or transmitting any material that contains software viruses or any other computer code, files,
                  or programs designed to interrupt, destroy, or limit the functionality of any computer software or
                  hardware or telecommunications equipment.
                </li>
                <li>
                  Interfering with or disrupting the platform or servers or networks connected to the platform, or
                  disobeying any requirements, procedures, policies, or regulations of networks connected to the
                  platform.
                </li>
                <li>Collecting or storing personal data about other users without their express consent.</li>
                <li>Selling counterfeit, stolen, or illegal goods.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Transactions and Payments</h2>
              <p className="mb-3">
                VPlaza serves as a platform connecting buyers and sellers. We are not a party to any transaction between
                users. As a result, we have no control over the quality, safety, legality, or availability of the items
                advertised, the truth or accuracy of the listings, or the ability of sellers to sell items or the
                ability of buyers to pay for items.
              </p>
              <p>
                We encourage users to exercise caution and use common sense when engaging in transactions. We recommend
                meeting in public places for the exchange of goods and payments, and thoroughly inspecting items before
                completing a purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by applicable law, in no event shall VPlaza, its affiliates, directors,
                employees, agents, or licensors be liable for any indirect, punitive, incidental, special,
                consequential, or exemplary damages, including without limitation, damages for loss of profits,
                goodwill, use, data, or other intangible losses, that result from the use of, or inability to use, the
                platform or any content or transactions conducted through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless VPlaza, its affiliates, licensors, and service
                providers, and its and their respective officers, directors, employees, contractors, agents, licensors,
                suppliers, successors, and assigns from and against any claims, liabilities, damages, judgments, awards,
                losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to
                your violation of these Terms or your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
                What constitutes a material change will be determined at our sole discretion. By continuing to access or
                use our platform after any revisions become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to
                its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be
                considered a waiver of those rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">10. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:{" "}
                <a href="mailto:legal@vplaza.com.ng" className="text-[#004AAD] hover:underline">
                  legal@vplaza.com.ng
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
