'use client';

import { Truck, Globe, Clock, ShieldCheck, Mail } from 'lucide-react';

export function DeliveryClient() {
  const shippingMethods = [
    {
      icon: Clock,
      title: "Standard Shipping",
      time: "5-7 Business Days",
      cost: "Free on orders over $50",
      desc: "Our most popular shipping method, reliable and cost-effective."
    },
    {
      icon: Truck,
      title: "Express Shipping",
      time: "2-3 Business Days",
      cost: "$15.00 Flat Rate",
      desc: "Fast delivery for when you need your items quickly."
    },
    {
      icon: Globe,
      title: "International Shipping",
      time: "10-15 Business Days",
      cost: "Calculated at Checkout",
      desc: "We ship to over 50 countries worldwide with secure tracking."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Delivery Information</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about how we get your favorite products to your doorstep.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {shippingMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="h-12 w-12 rounded-xl bg-brand-blue-light flex items-center justify-center text-brand-blue mb-6">
                  <method.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-brand-blue font-bold text-sm mb-4">{method.time} • {method.cost}</p>
                <p className="text-gray-500 leading-relaxed text-sm">{method.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 italic uppercase tracking-tighter">Order Processing</h2>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 shrink-0 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-gray-600 leading-relaxed">
                    Orders are typically processed within 24 hours (excluding weekends and holidays). Once your order is processed, you'll receive a confirmation email with tracking details.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-brand-blue rounded-3xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
                <p className="text-brand-blue-light/80">Questions about your order or delivery status?</p>
              </div>
              <div className="flex items-center gap-4 bg-white/10 rounded-full px-8 py-4 backdrop-blur-sm">
                <Mail className="h-5 w-5 text-brand-blue-light" />
                <span className="font-bold">support@koletex.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
