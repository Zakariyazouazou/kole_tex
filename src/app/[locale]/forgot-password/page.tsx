'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="text-center py-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900">{t('resetSuccess')}</h1>
              <p className="mt-3 text-sm text-gray-500">{t('resetSuccessMessage')}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-blue-light text-brand-blue mb-4">
                  <Mail className="h-7 w-7" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{t('forgotPasswordTitle')}</h1>
                <p className="mt-2 text-sm text-gray-500">{t('forgotPasswordSubtitle')}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-brand-blue hover:bg-brand-blue-dark cursor-pointer py-5"
                >
                  {t('sendResetLink')}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
