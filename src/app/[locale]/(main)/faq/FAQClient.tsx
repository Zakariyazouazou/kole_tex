'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "How do I track my order?",
    answer: "Once your order has shipped, you will receive an email with a tracking number and a link to track your package. You can also view your order status in your account dashboard."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most items. Products must be in their original condition and packaging. Please visit our Support page to initiate a return."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 5-7 business days. Express shipping is available for faster delivery (2-3 business days). International shipping times vary by location."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times will be calculated at checkout based on your location."
  },
  {
    question: "Can I change or cancel my order?",
    answer: "You can modify or cancel your order within 1 hour of placing it. After that, the order is processed and cannot be changed. Please contact support immediately if you need assistance."
  }
];

export function FAQClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <section className="bg-white border-b border-gray-100 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">FAQ</h1>
          <p className="mt-4 text-lg text-gray-500">
            Frequently Asked Questions. Find answers to common inquiries about our services.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all"
              >
                <button
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-brand-blue" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
