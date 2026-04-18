'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ShieldCheck, LogOut, Wifi, WifiOff, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminApi } from '@/api';
import type { ToptexConnectionStatus } from '@/lib/admin-api';

function ToptexBadge() {
  const [status, setStatus] = useState<ToptexConnectionStatus | null>(null);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    adminApi.getToptexConnectionStatus().then(setStatus).catch(() => {
      setStatus({ status: 'error', message: 'Failed to connect to Toptex API' });
    });
  }, []);

  const isConnected = status?.status === 'success';

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isConnected
                ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
            }`}
          />
        }
      >
        {isConnected ? (
          <Wifi className="h-3.5 w-3.5" />
        ) : (
          <WifiOff className="h-3.5 w-3.5" />
        )}
        {status === null ? 'Checking…' : isConnected ? 'Connected' : 'Disconnected'}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            Toptex API Connection
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <div className="rounded-lg border p-3 space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
            <span
              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                isConnected
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {status?.data && (
            <>
              <div className="rounded-lg border p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Username</p>
                <p className="font-mono text-sm">{status.data.username}</p>
              </div>
              <div className="rounded-lg border p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Token</p>
                <div className="flex items-center gap-2">
                  <p className="font-mono text-xs text-gray-700 truncate flex-1">
                    {showToken
                      ? status.data.token
                      : `${status.data.token.slice(0, 12)}${'•'.repeat(20)}`}
                  </p>
                  <button
                    onClick={() => setShowToken((v) => !v)}
                    className="text-gray-400 hover:text-gray-600 shrink-0"
                  >
                    {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="rounded-lg border p-3 space-y-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Token Expiry</p>
                <p className="text-sm">
                  {new Date(status.data.expiry_time).toLocaleString()} ({status.data.expiry_time_timezone})
                </p>
              </div>
            </>
          )}

          {status?.message && (
            <div className="rounded-lg border p-3 space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Message</p>
              <p className="text-sm text-gray-700">{status.message}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
          <ToptexBadge />
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
