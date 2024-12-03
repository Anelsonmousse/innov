"use client"
import React, { useState } from 'react';
import { IoArrowBack, IoChatbubbleEllipsesOutline, IoSearchOutline } from 'react-icons/io5';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuestions, setExpandedQuestions] = useState([]);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          q: "What is Vplaza?",
          a: "Vplaza is an online platform that allows university students to sell and buy items from other students within their university. It helps students find buyers for their unneeded items and purchase items at affordable prices."
        },
        {
          q: "How does Vplaza work?",
          a: "Students create a store and list their items for sale. Other students can browse and purchase these items. Vplaza connects buyers and sellers via WhatsApp for direct communication."
        }
      ]
    },
    {
      category: "Registration",
      questions: [
        {
          q: "How do I register on Vplaza?",
          a: "Click on the \"Sign Up\" button on the homepage, fill in your details, and submit the form. You don't need a school email to register."
        },
        {
          q: "Can I register if I am not a student?",
          a: "Yes, you can register even if you are not a student. However, Vplaza is primarily designed for university students."
        },
        {
          q: "Can I change my registered university on Vplaza?",
          a: "Yes, you can change the location of the products you view so that you can see items from other universities."
        }
      ]
    },
    {
      category: "Selling Items",
      questions: [
        {
          q: "How do I list an item for sale on Vplaza?",
          a: "After logging in, go to your profile and click on Add New Item. Fill in the details of the item, upload a photo, and set your price. Your item will then be visible to other students."
        },
        {
          q: "Are there any fees for listing items on Vplaza?",
          a: "Yes, Vplaza charges a monthly fee of ₦500 for those who wish to own a store and list their products."
        },
        {
          q: "How can I edit or delete my listed item on Vplaza?",
          a: "Go to your store, find the item you want to edit or delete, and select the appropriate option."
        }
      ]
    },
    {
      category: "Buying Items",
      questions: [
        {
          q: "How do I buy an item on Vplaza?",
          a: "Browse the items listed by other students, click on the item you’re interested in, and then click the WhatsApp button to connect with the seller for further details and to finalize the purchase."
        },
        {
          q: "Is there any payment protection on Vplaza?",
          a: "No, Vplaza does not handle payments. Buyers and sellers need to communicate and agree on payment terms through WhatsApp or any other preferred method."
        }
      ]
    },
    {
      category: "Communication",
      questions: [
        {
          q: "How do I contact the seller on Vplaza?",
          a: "Each item listing has a WhatsApp button. Click on it to start a direct conversation with the seller on WhatsApp."
        },
        {
          q: "What if the seller doesn’t respond on Vplaza?",
          a: "If a seller does not respond within a reasonable time, you can look for other similar items listed by other sellers. We recommend sellers to respond promptly to maintain a good user experience."
        }
      ]
    },
    {
      category: "Safety and Security",
      questions: [
        {
          q: "Is it safe to use Vplaza?",
          a: "We strive to create a safe environment. However, please exercise caution when meeting buyers or sellers in person and when making payments."
        },
        {
          q: "What should I do if I encounter a suspicious listing or user on Vplaza?",
          a: "Report any suspicious activity or listing to our support team immediately. We will investigate and take appropriate action."
        }
      ]
    },
    {
      category: "Account Issues",
      questions: [
        {
          q: "How do I reset my password on Vplaza?",
          a: "Click on the \"Forgot Password\" link on the login page and follow the instructions to reset your password."
        },
        {
          q: "How do I delete my Vplaza account?",
          a: "If you wish to delete your account, please contact our support team with your request."
        }
      ]
    },
    {
      category: "Contact and Support",
      questions: [
        {
          q: "How can I contact Vplaza support?",
          a: "You can contact our support team via the \"FAQs\" page on our website. We are here to help you with any issues or questions you may have."
        },
        {
          q: "What should I do if I encounter technical issues on Vplaza?",
          a: "If you encounter any technical issues, please report them to our support team. Provide as much detail as possible to help us resolve the issue promptly."
        }
      ]
    }
  ];
  

  const toggleQuestion = (category, index) => {
    const key = `${category}-${index}`;
    setExpandedQuestions(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4 flex items-center">
        <IoArrowBack onClick={() => router.back()} size={24} className="mr-4 cursor-pointer" />
        <h1 className="text-xl font-bold flex-grow">Help Center</h1>
      </header>

      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <IoSearchOutline className="text-gray-500 mr-2" size={20} />
          <input 
            type="text" 
            placeholder="Search FAQs" 
            className="bg-transparent w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* FAQ Content */}
      <main className="flex-grow p-4 space-y-4 overflow-y-auto pb-24">
        {filteredFAQs.map((category, catIndex) => (
          <div key={catIndex} className="bg-white rounded-lg shadow-md">
            <h2 className="bg-blue-50 p-3 font-semibold text-blue-800 rounded-t-lg">
              {category.category}
            </h2>
            {category.questions.map((faq, qIndex) => {
              const key = `${category.category}-${qIndex}`;
              const isExpanded = expandedQuestions.includes(key);

              return (
                <div 
                  key={qIndex} 
                  className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                >
                  <div 
                    className="p-3 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleQuestion(category.category, qIndex)}
                  >
                    <h3 className="font-medium pr-4">{faq.q}</h3>
                    <span className="text-blue-600 flex-shrink-0">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </div>
                  {isExpanded && (
                    <div className="p-3 bg-gray-50 text-gray-700">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}

        {filteredFAQs.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No FAQs found matching your search
          </div>
        )}
      </main>

      {/* Chat Support */}
      <footer className="bg-blue-600 text-white p-4 fixed bottom-0 left-0 right-0 shadow-lg">
        <a 
          href="https://wa.me/2347073119777" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-4 hover:bg-blue-700 rounded-lg transition-colors p-2"
        >
          <IoChatbubbleEllipsesOutline size={36} />
          <div>
            <p className="font-bold text-sm">Need More Help?</p>
            <p className="text-xs">Chat with our customer support representative</p>
          </div>
        </a>
      </footer>
    </div>
  );
}