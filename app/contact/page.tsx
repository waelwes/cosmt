import { Metadata } from 'next';
import { PageLayout } from '../../components/layout/PageLayout';

export const metadata: Metadata = {
  title: 'Contact COSMT - Get in Touch with Our Beauty Experts',
  description: 'Contact COSMT for product inquiries, customer support, or beauty advice. Our expert team is here to help you find the perfect products.',
  keywords: 'contact COSMT, customer support, beauty advice, product inquiry, help center',
  openGraph: {
    title: 'Contact COSMT - Get in Touch with Our Beauty Experts',
    description: 'Contact COSMT for product inquiries, customer support, or beauty advice.',
    images: ['/images/contact-og.jpg'],
  },
};

export default function ContactPage() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gray-50 py-16">
        <div className="cosmt-container text-center">
          <h1 className="text-cosmt-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-cosmt-lg text-gray-600 max-w-2xl mx-auto">
            We're here to help! Get in touch with our beauty experts for product advice, 
            customer support, or any questions you may have.
          </p>
        </div>
      </div>

      <div className="cosmt-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                >
                  <option value="">Select a subject</option>
                  <option value="product-inquiry">Product Inquiry</option>
                  <option value="order-support">Order Support</option>
                  <option value="beauty-advice">Beauty Advice</option>
                  <option value="general">General Question</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-cosmt-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Tell us how we can help you..."
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-green-600 text-white hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-cosmt-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">info@cosmt.com</p>
                  <p className="text-cosmt-sm text-gray-500">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-cosmt-sm text-gray-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-cosmt-lg font-semibold text-gray-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600">123 Beauty Street<br />New York, NY 10001</p>
                  <p className="text-cosmt-sm text-gray-500">By appointment only</p>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h3 className="text-cosmt-xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-1">
                    What is your return policy?
                  </h4>
                  <p className="text-cosmt-sm text-gray-600">
                    We offer a 30-day return policy for all unused products in their original packaging.
                  </p>
                </div>
                <div>
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-1">
                    Do you offer free shipping?
                  </h4>
                  <p className="text-cosmt-sm text-gray-600">
                    Yes! Free shipping on orders over $50 within the continental US.
                  </p>
                </div>
                <div>
                  <h4 className="text-cosmt-base font-medium text-gray-900 mb-1">
                    Can I get beauty advice?
                  </h4>
                  <p className="text-cosmt-sm text-gray-600">
                    Absolutely! Our beauty experts are here to help you find the perfect products.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
