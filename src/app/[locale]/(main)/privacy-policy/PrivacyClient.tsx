'use client';

export function PrivacyClient() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <section className="bg-gray-50 border-b border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 italic uppercase tracking-tighter">Privacy Policy</h1>
          <p className="text-gray-500">Last updated: March 18, 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto px-4 prose prose-gray max-w-4xl">
          <div className="space-y-10 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us when you create an account, make a purchase, or contact our support team. This may include your name, email address, shipping address, and payment information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your orders and promotional offers.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, disclosure, or destruction. We use bank-level encryption for all payment transactions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing of Information</h2>
              <p>
                We do not sell or rent your personal information to third parties. We may share your information with service providers who perform functions on our behalf, such as shipping companies and payment processors.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Choices</h2>
              <p>
                You have the right to access, correct, or delete your personal information at any time. You can manage your communication preferences through your account settings or by contacting our support team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website and updating the "Last updated" date at the top of the policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
