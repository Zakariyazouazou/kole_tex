'use client';

import { Mail, Phone, MessageSquare, LifeBuoy, Clock, Globe } from 'lucide-react';
import { CustomButton } from '@/components/ui/CustomButton';

export function SupportClient() {
  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      desc: "+1 (555) 123-4567",
      action: "Call Now",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      desc: "support@koletex.com",
      action: "Send Email",
      color: "bg-purple-50 text-purple-600"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      desc: "Instant help from our team",
      action: "Start Chat",
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Support Center</h1>
          <p className="mt-4 text-lg text-gray-500">
            Welcome to Kole Tex Support. We're dedicated to helping you with any questions or issues.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-6 ${method.color}`}>
                  <method.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-500 mb-6">{method.desc}</p>
                <CustomButton 
                  className="w-full py-2.5 rounded-full font-semibold border-brand-blue/10 bg-brand-blue/5 text-brand-blue hover:bg-brand-blue hover:text-white"
                  bgHover="#3C4EA1"
                >
                  {method.action}
                </CustomButton>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-brand-blue text-white rounded-3xl p-10 overflow-hidden relative">
              <LifeBuoy className="absolute -bottom-10 -right-10 h-64 w-64 opacity-10" />
              <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-4 italic uppercase tracking-tighter">Help Center Resources</h2>
                <p className="text-brand-blue-light/80 mb-8 leading-relaxed max-w-md">
                  Explore our detailed guides and help articles for self-service solutions.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 opacity-70" />
                    <span>Average response time: &lt; 2 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 opacity-70" />
                    <span>Support available in English, French, and German</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 italic uppercase tracking-tighter">Frequently Visited</h2>
              <ul className="space-y-4">
                {['Track Order', 'Return Policy', 'Shipping Info', 'Payment Methods', 'Account Settings'].map((item) => (
                  <li key={item} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-gray-700 font-medium">{item}</span>
                    <span className="text-brand-blue font-bold text-sm cursor-pointer hover:underline">View Details</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
