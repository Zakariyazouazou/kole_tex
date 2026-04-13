'use client';

export function TermsClient() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <section className="bg-gray-50 border-b border-gray-100 py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 italic uppercase tracking-tighter">Terms & Conditions</h1>
          <p className="text-gray-500">Last updated: March 18, 2026</p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto px-4 prose prose-gray max-w-4xl">
          <div className="space-y-10 text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p>
                Welcome to Kole Tex. These Terms and Conditions govern your use of our website and services. By accessing or using our platform, you agree to be bound by these terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Services</h2>
              <p>
                You may use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos, and images, is the property of Kole Tex or its content suppliers and is protected by international copyright laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Kole Tex shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use of our services or products.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Kole Tex is registered, without regard to its conflict of law principles.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any significant changes by posting the new Terms on our website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
