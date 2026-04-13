'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, CheckCircle } from 'lucide-react';

export function ContactClient() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
  };

  const contactInfo = [
    { icon: Phone, label: t('phone'), value: t('phoneValue') },
    { icon: Mail, label: t('emailLabel'), value: t('emailValue') },
    { icon: MapPin, label: t('addressLabel'), value: t('addressValue') },
  ];

  return (
    <div>
      <section className="bg-linear-to-br from-brand-blue-light via-white to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="rounded-xl border border-gray-100 p-6 text-center transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue mb-4">
                  <info.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900">{info.label}</h3>
                <p className="mt-1 text-sm text-gray-500">{info.value}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div className="rounded-xl border border-gray-100 p-8">
              {sent ? (
                <div className="text-center py-10">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-900">{t('success')}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('name')}</Label>
                    <Input placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('subject')}</Label>
                    <Input placeholder="How can we help?" required />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('message')}</Label>
                    <Textarea
                      placeholder="Your message..."
                      rows={5}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-brand-blue hover:bg-brand-blue-dark cursor-pointer py-5"
                  >
                    {t('send')}
                  </Button>
                </form>
              )}
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-brand-blue mx-auto mb-4 opacity-30" />
                <p className="text-sm text-gray-400">Map placeholder</p>
                <p className="text-xs text-gray-300 mt-1">123 Commerce Street, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
