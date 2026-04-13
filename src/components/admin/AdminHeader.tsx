'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { ShieldCheck, LogOut } from 'lucide-react';

export function AdminHeader() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login' as never);
  };

  return (
    <header className="sticky top-0 z-50 w-full h-16 bg-slate-900 text-white shadow-lg">
      <div className="w-full px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-white" />
          <span className="text-lg font-bold tracking-tight">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 hidden sm:block">{user?.email}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white cursor-pointer gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
