'use client';

import { useTranslations } from 'next-intl';
import { Award, Heart, Leaf, Lightbulb } from 'lucide-react';

const team = [
  { name: 'Alex Johnson', role: 'CEO & Founder' },
  { name: 'Maria Garcia', role: 'Head of Design' },
  { name: 'David Chen', role: 'CTO' },
  { name: 'Sophie Mueller', role: 'Marketing Director' },
];

export function AboutClient() {
  const t = useTranslations('about');

  const values = [
    { icon: Award, title: t('value1'), desc: t('value1Desc') },
    { icon: Heart, title: t('value2'), desc: t('value2Desc') },
    { icon: Leaf, title: t('value3'), desc: t('value3Desc') },
    { icon: Lightbulb, title: t('value4'), desc: t('value4Desc') },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-br from-brand-blue-light via-white to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-gray-500">{t('subtitle')}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('storyTitle')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('storyText')}</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('mission')}</h2>
              <p className="text-gray-600 leading-relaxed">{t('missionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">{t('values')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-100 bg-white p-6 text-center transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue mb-4">
                  <v.icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t('team')}</h2>
            <p className="mt-2 text-gray-500">{t('teamSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=200&background=eef0f9&color=3C4EA1&bold=true`}
                  alt={member.name}
                  className="mx-auto h-32 w-32 rounded-full object-cover border-4 border-brand-blue-light"
                />
                <h3 className="mt-4 font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
