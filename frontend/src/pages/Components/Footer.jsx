import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  return (
    <>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-1 text-[#860033]">
              {/* <div className="h-8 w-8">
                <svg viewBox="0 0 100 100" className="h-full w-full fill-current">
                  <path d="M50,15 C35,15 25,25 25,40 C25,50 30,55 40,65 C45,70 50,85 50,85 C50,85 55,70 60,65 C70,55 75,50 75,40 C75,25 65,15 50,15 Z"></path>
                </svg>
              </div> */}
              {/* <span className="font-serif text-lg">AubConnect</span> */}
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={() => setShowAboutModal(true)} 
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                About
              </button>
              <button 
                onClick={() => setShowPrivacyModal(true)} 
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Privacy
              </button>
              <button 
                onClick={() => setShowTermsModal(true)} 
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Terms
              </button>
              <button 
                onClick={() => setShowContactModal(true)} 
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Contact
              </button>
            </div>
            
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} American University of Beirut
            </div>
          </div>
        </div>
      </footer>

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">About Us</h2>
                <button 
                  onClick={() => setShowAboutModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="prose max-w-none">
                <h3>Our Mission</h3>
                <p>
                  As a group of AUB students, we understand the struggle of finding the
                  right courses that guarantee both enjoyment and an enriching learning
                  experience. After countless hours of reaching out to seniors, checking
                  with AUB crushes, and trying to gather feedback, we decided it was time
                  for a change. Our goal is to provide a space where AUB students can
                  easily ask, search, and share honest reviews about courses and professors,
                  without all the unnecessary hassle.
                </p>

                <h3>Who We Are</h3>
                <p>
                  We are a group of AUB students who've been in your shoes. We know how
                  challenging it can be to navigate course selections and figure out which
                  professors will give you the best experience. That's why we created this
                  website—a platform where students can engage with each other and share
                  their real experiences, making it easier for you to assess your academic
                  path.
                </p>

                <h3>Why Choose Us</h3>
                <p>
                  This platform is exclusively for AUB students. Only AUB students are
                  allowed to review courses and professors, ensuring that every rating and
                  piece of feedback is authentic. We believe in creating a healthy and
                  positive community, where students can support each other in their
                  educational journey. We're not here to berate or criticize any professors
                  or courses but to offer constructive insights. Our website promotes
                  respectful language and ensures that offensive or harmful comments are not
                  tolerated.
                </p>

                <h3>Our Vision</h3>
                <p>
                  Our vision is to build a platform that helps you make informed decisions
                  about your academic path. With a supportive community of real students, we
                  want to eliminate the stress and uncertainty of choosing the right courses
                  and professors. This website is your first step toward a better university
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
                <button 
                  onClick={() => setShowPrivacyModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="prose max-w-none">
                <h3>Information We Collect</h3>
                <p>At AUBConnect, we respect your privacy and are committed to protecting the personal information of our users. We collect information such as:</p>
                <ul>
                  <li>Your AUB email address for account creation and verification</li>
                  <li>Course ratings, reviews, and feedback you choose to share</li>
                  <li>Usage information to improve our service</li>
                </ul>

                <h3>How We Use Your Information</h3>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Verify your status as an AUB student</li>
                  <li>Provide and improve our course review service</li>
                  <li>Maintain the integrity of our platform</li>
                  <li>Ensure reviews remain helpful and appropriate</li>
                </ul>

                <h3>Anonymous Reviews</h3>
                <p>All reviews posted on AUBConnect are displayed anonymously to other users. While we store your identity internally to prevent abuse, your name will never be displayed alongside your reviews.</p>

                <h3>Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>

                <h3>AUB Community Focus</h3>
                <p>AUBConnect is exclusively for AUB students. We verify all users through their AUB email addresses to maintain the integrity and relevance of our platform.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Terms of Service</h2>
                <button 
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="prose max-w-none">
                <h3>Acceptance of Terms</h3>
                <p>By using AUBConnect, you agree to these Terms of Service. If you do not agree, please do not use our service.</p>
                
                <h3>AUB Student Verification</h3>
                <p>AUBConnect is exclusively for AUB students. You must use a valid AUB email address (@mail.aub.edu) to register.</p>
                
                <h3>User Content Guidelines</h3>
                <p>When posting reviews or comments, you agree to:</p>
                <ul>
                  <li>Provide honest, constructive feedback</li>
                  <li>Not engage in personal attacks against professors or other students</li>
                  <li>Not post discriminatory, offensive, or inappropriate content</li>
                  <li>Not post false or misleading information</li>
                </ul>
                
                <h3>Content Moderation</h3>
                <p>We reserve the right to remove content that violates our guidelines or edit/remove content that:</p>
                <ul>
                  <li>Contains personal attacks or inappropriate language</li>
                  <li>Includes identifiable information about other students</li>
                  <li>Promotes academic dishonesty</li>
                  <li>Violates AUB's academic integrity standards</li>
                </ul>
                
                <h3>Account Responsibility</h3>
                <p>You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.</p>
                
                <h3>Modifications to Service</h3>
                <p>We reserve the right to modify or discontinue the service with or without notice at any time.</p>
                
                <h3>Limitation of Liability</h3>
                <p>AUBConnect is not officially affiliated with the American University of Beirut administration. The opinions expressed in reviews are those of individual students and do not represent the views of AUB or AUBConnect.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Contact Us</h2>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#860033]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-[#860033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="mb-2">Have questions or feedback? Reach out to us at:</p>
                <a 
                  href="mailto:AubConnect00@gmail.com" 
                  className="text-xl font-medium text-[#860033] hover:underline"
                >
                  AubConnect00@gmail.com
                </a>
                <p className="mt-4 text-sm text-gray-500">We typically respond within 24-48 hours.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;