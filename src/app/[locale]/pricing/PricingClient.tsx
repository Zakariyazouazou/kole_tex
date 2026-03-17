'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomButton } from '@/components/ui/CustomButton';


export function PricingClient() {
  const t = useTranslations('pricing');
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: t('free'),
      desc: t('freeDesc'),
      price: t('freePrice'),
      annualPrice: t('freePrice'),
      features: [t('freeFeature1'), t('freeFeature2'), t('freeFeature3'), t('freeFeature4')],
      cta: t('getStarted'),
      popular: false,
    },
    {
      name: t('pro'),
      desc: t('proDesc'),
      price: t('proPrice'),
      annualPrice: t('proAnnualPrice'),
      features: [
        t('proFeature1'), t('proFeature2'), t('proFeature3'),
        t('proFeature4'), t('proFeature5'), t('proFeature6'),
      ],
      cta: t('getStarted'),
      popular: true,
    },
    {
      name: t('enterprise'),
      desc: t('enterpriseDesc'),
      price: t('enterprisePrice'),
      annualPrice: t('enterpriseAnnualPrice'),
      features: [
        t('enterpriseFeature1'), t('enterpriseFeature2'), t('enterpriseFeature3'),
        t('enterpriseFeature4'), t('enterpriseFeature5'), t('enterpriseFeature6'),
      ],
      cta: t('contactUs'),
      popular: false,
    },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-blue-light via-white to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">{t('subtitle')}</p>

          {/* Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-medium ${!annual ? 'text-gray-900' : 'text-gray-400'}`}>
              {t('monthly')}
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-7 w-12 rounded-full transition-colors cursor-pointer ${
                annual ? 'bg-brand-blue' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform ${
                  annual ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${annual ? 'text-gray-900' : 'text-gray-400'}`}>
              {t('annual')}
            </span>
            {annual && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {t('annualSave')}
              </Badge>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl border p-8 transition-all duration-300 hover:shadow-lg ${
                  plan.popular
                    ? 'border-brand-blue shadow-md scale-[1.02]'
                    : 'border-gray-200 hover:-translate-y-1'
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-blue text-white px-4">
                    {t('mostPopular')}
                  </Badge>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${annual ? plan.annualPrice : plan.price}
                  </span>
                  {plan.price !== '0' && (
                    <span className="text-gray-500 text-sm">/{annual ? t('annual').toLowerCase() : t('monthly').toLowerCase()}</span>
                  )}
                </div>
                <CustomButton
                  className={`w-full mt-6 ${
                    plan.popular
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'bg-white text-brand-blue border-brand-blue shadow-none'
                  }`}
                  bgHover={plan.popular ? '#2d3a7a' : '#3C4EA1'}
                  textHover="white"
                >
                  {plan.cta}
                </CustomButton>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-brand-blue mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
