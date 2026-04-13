'use client';

import { useTranslations } from 'next-intl';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Phone, Mail } from 'lucide-react';

export function SupportClient() {
  const t = useTranslations('dashboard');

  const contactMethods = [
    { icon: Phone, label: 'Call Us', value: '+1 (555) 123-4567', color: 'text-blue-600 bg-blue-50' },
    { icon: Mail, label: 'Email Us', value: 'support@koletex.com', color: 'text-brand-blue bg-brand-blue-light' },
    { icon: MessageCircle, label: 'Live Chat', value: 'Available 24/7', color: 'text-green-600 bg-green-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">{t('support')}</h1>
        <p className="text-sm text-gray-500">How can we help you today?</p>
      </div>

      {/* Quick Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {contactMethods.map((method) => (
          <div key={method.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm transition-all hover:shadow-md hover:shadow-black/5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${method.color}`}>
              <method.icon className="h-5 w-5" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{method.label}</p>
            <p className="text-sm font-semibold text-gray-900">{method.value}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="h-6 w-6 text-brand-blue" />
          <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
        </div>
        <Accordion className="w-full">
          {[1, 2, 3, 4, 5].map((i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-gray-100 last:border-0">
              <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-brand-blue transition-colors py-4">
                {t(`faq${i}Q` as 'faq1Q')}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-600 leading-relaxed pb-4">
                {t(`faq${i}A` as 'faq1A')}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
