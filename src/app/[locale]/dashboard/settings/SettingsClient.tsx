'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CustomButton } from '@/components/ui/CustomButton';

export function SettingsClient() {
  const t = useTranslations('dashboard');
  const { user, updateUser } = useApp();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    address: user?.address || '',
    city: user?.city || '',
    postalCode: user?.postalCode || '',
    country: user?.country || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-gray-900">{t('accountSettings')}</h1>
        <p className="text-sm text-gray-500">{t('editProfile')}</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm max-w-3xl">
        <form key={user?.email || 'none'} onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('name')}</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('email')}</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('phone')}</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('company')}</Label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('address')}</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('city')}</Label>
            <Input
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('postalCode')}</Label>
            <Input
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-gray-400">{t('country')}</Label>
            <Input
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-brand-blue focus:ring-brand-blue/20"
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-4 pt-4 border-t border-gray-50 mt-2">
            <CustomButton
              type="submit"
              className="bg-brand-blue text-white border-brand-blue px-8"
              bgHover="#2d3a7a"
              textHover="white"
            >
              {t('save')}
            </CustomButton>
            {saved && (
              <span className="text-sm text-green-600 font-semibold animate-in fade-in slide-in-from-left-2 duration-300">
                ✓ {t('saved')}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
