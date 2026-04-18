'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getLanguageLabel, getLanguageFlag } from '@/lib/language-utils';
import type { PreferredLanguage } from '@/types/auth.types';
import { PREFERRED_LANGUAGES } from '@/types/auth.types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Check } from 'lucide-react';

interface LanguageSelectorProps {
  onSuccess?: (language: PreferredLanguage) => void;
  onError?: (error: string) => void;
}

export function LanguageSelector({ onSuccess, onError }: LanguageSelectorProps) {
  const { user, setUserLanguage } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentLanguage: PreferredLanguage = user?.preferredLanguage ?? 'nl';

  const handleLanguageChange = async (language: PreferredLanguage) => {
    if (language === currentLanguage) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await setUserLanguage(language);
      setSuccess(`Language changed to ${getLanguageLabel(language)}`);
      onSuccess?.(language);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update language';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Preferred Language for Emails
        </label>
        <Select
          value={currentLanguage}
          onValueChange={(value) => handleLanguageChange(value as PreferredLanguage)}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {PREFERRED_LANGUAGES.map((lang) => (
              <SelectItem key={lang} value={lang}>
                <span className="flex items-center gap-2">
                  {getLanguageFlag(lang)} {getLanguageLabel(lang)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">
          This language will be used for all transactional emails including verification, password reset, and order confirmations.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <Check className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
