"use client"
import { IoArrowBack } from "react-icons/io5";

export default function PrivacyPolicy() {
  return (
    <main className="bg-main min-h-screen">
      <section className="py-4 gap-3 pt-8 text-white flex items-center px-4">
        <IoArrowBack onClick={() => router.back()} size={24} color="white" className="cursor-pointer" />
        <p className="text-lg font-bold">Privacy Policy</p>
      </section>
      <section className="h-full p-6 rounded-t-[32px] w-full bg-white">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to VPLAZA.COM.NG ("we," "our," "us"). We value your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and share information about you when you use our website vplaza.com.ng (the "Site").
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">2. Information We Collect</h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Personal Data:</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Name</li>
                <li>Email address</li>
                <li>University affiliation</li>
                <li>Contact details</li>
              </ul>
              <h3 className="font-semibold text-gray-800 mt-4">Usage Data:</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>IP address</li>
                <li>Browser type</li>
                <li>Pages visited</li>
                <li>Time spent on pages</li>
                <li>Referring website</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">3. How We Collect Information</h2>
            <p className="text-gray-700 leading-relaxed">We collect information directly from you when you:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Register on our Site</li>
              <li>Create a store or list items for sale</li>
              <li>Contact us directly</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We also collect information automatically through cookies and other tracking technologies when you:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Visit our Site</li>
              <li>Interact with our services</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">4. Use of Information</h2>
            <p className="text-gray-700 leading-relaxed">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>To facilitate the creation and management of your account</li>
              <li>To enable users to list and purchase items</li>
              <li>To connect buyers and sellers via WhatsApp</li>
              <li>To improve our services and website functionality</li>
              <li>For marketing and promotional purposes</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">5. Sharing of Information</h2>
            <p className="text-gray-700 leading-relaxed">
              We do not share your personal data with third parties, except as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Connect buyers and sellers (e.g., sharing contact information via WhatsApp)</li>
              <li>Comply with legal obligations</li>
              <li>Protect and defend our rights and property</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">6. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data only for as long as necessary to fulfill the purposes we collected it for, including any legal, accounting, or reporting requirements.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">7. User Rights</h2>
            <p className="text-gray-700 leading-relaxed">You have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Access: You can request access to your personal data.</li>
              <li>Correction: You can request that we correct any inaccuracies in your personal data.</li>
              <li>Deletion: You can request that we delete your personal data.</li>
              <li>Opt-Out: You can opt-out of receiving marketing communications from us.</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:contact@vplaza.com.ng" className="text-blue-600 hover:text-blue-800">
                contact@vplaza.com.ng
              </a>
              .
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">8. Security Measures</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">9. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under the age of 13. We do not knowingly collect personal data from children under 13. If we become aware that we have inadvertently received personal data from a child under the age of 13, we will delete such information from our records.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our Site. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </div>

          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900">11. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              <a href="mailto:contact@vplaza.com.ng" className="text-blue-600 hover:text-blue-800">
                Email: contact@vplaza.com.ng
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}