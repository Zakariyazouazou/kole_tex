'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, RefreshCw, Zap, Trash2, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { SyncLog, SyncStatus } from '@/lib/admin-api';

// Mock data — replace with real API calls
const mockApiStatus: { connectivity: 'ok' | 'error'; lastSyncStatus: SyncStatus; lastSyncAt: string } = {
  connectivity: 'ok',
  lastSyncStatus: 'success',
  lastSyncAt: '2026-04-10T08:30:00Z',
};

const MOCK_LOGS: SyncLog[] = Array.from({ length: 22 }, (_, i) => ({
  id: `log-${i + 1}`,
  type: i % 3 === 0 ? 'deleted' : 'upsert',
  status: (['success', 'success', 'failed', 'success', 'running'] as SyncStatus[])[i % 5],
  totalPages: i % 5 !== 4 ? Math.floor(Math.random() * 50) + 1 : undefined,
  processedItems: i % 5 !== 4 ? Math.floor(Math.random() * 500) + 100 : undefined,
  failedItems: i % 5 === 2 ? Math.floor(Math.random() * 10) : 0,
  errorMessage: i % 5 === 2 ? 'Connection timeout after 30s' : undefined,
  startedAt: new Date(2026, 0, i + 1, 8, 0, 0).toISOString(),
  completedAt: i % 5 !== 4 ? new Date(2026, 0, i + 1, 8, 30, 0).toISOString() : undefined,
}));

const PAGE_SIZE = 10;

const statusBadge: Record<SyncStatus, string> = {
  running: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
};

export function SyncAdminClient() {
  const [page, setPage] = useState(1);
  const [modifiedSince, setModifiedSince] = useState('');
  const [deletedSince, setDeletedSince] = useState('');
  const [triggerLoading, setTriggerLoading] = useState<string | null>(null);

  const totalPages = Math.ceil(MOCK_LOGS.length / PAGE_SIZE);
  const paginated = MOCK_LOGS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const trigger = async (type: 'full' | 'incremental' | 'deleted') => {
    setTriggerLoading(type);
    try {
      // TODO: call triggerFullSync() / triggerIncrementalSync(modifiedSince) / triggerDeletedSync(deletedSince)
      await new Promise((r) => setTimeout(r, 1000)); // mock delay
    } finally {
      setTriggerLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader title="Toptex Sync" description="Manage product catalog synchronisation" />

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="API Connectivity"
          value={mockApiStatus.connectivity === 'ok' ? 'Connected' : 'Error'}
          icon={mockApiStatus.connectivity === 'ok' ? <Wifi className="h-5 w-5" /> : <WifiOff className="h-5 w-5" />}
          color={mockApiStatus.connectivity === 'ok' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
        />
        <StatCard
          label="Last Sync Status"
          value={mockApiStatus.lastSyncStatus}
          icon={<RefreshCw className="h-5 w-5" />}
          color={statusBadge[mockApiStatus.lastSyncStatus]}
        />
        <StatCard
          label="Last Sync At"
          value={new Date(mockApiStatus.lastSyncAt).toLocaleString()}
          icon={<Zap className="h-5 w-5" />}
          color="bg-slate-100 text-slate-600"
        />
      </div>

      {/* Sync Actions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-semibold text-gray-700">Sync Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Full Sync */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <div>
              <p className="font-medium text-gray-800 text-sm">Full Sync</p>
              <p className="text-xs text-gray-500 mt-1">Re-sync all products from Toptex catalog.</p>
            </div>
            <Button
              className="w-full bg-slate-800 hover:bg-slate-900 text-white gap-2"
              disabled={triggerLoading === 'full'}
              onClick={() => trigger('full')}
            >
              <RefreshCw className={cn('h-4 w-4', triggerLoading === 'full' && 'animate-spin')} />
              {triggerLoading === 'full' ? 'Running…' : 'Trigger Full Sync'}
            </Button>
          </div>

          {/* Incremental Sync */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <div>
              <p className="font-medium text-gray-800 text-sm">Incremental Sync</p>
              <p className="text-xs text-gray-500 mt-1">Sync products modified since a date.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Modified Since</Label>
              <Input type="date" value={modifiedSince} onChange={(e) => setModifiedSince(e.target.value)} className="h-9 text-sm" />
            </div>
            <Button
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              disabled={!modifiedSince || triggerLoading === 'incremental'}
              onClick={() => trigger('incremental')}
            >
              <Zap className={cn('h-4 w-4', triggerLoading === 'incremental' && 'animate-spin')} />
              {triggerLoading === 'incremental' ? 'Running…' : 'Trigger Incremental'}
            </Button>
          </div>

          {/* Deleted Sync */}
          <div className="rounded-xl border border-gray-100 p-4 space-y-3">
            <div>
              <p className="font-medium text-gray-800 text-sm">Deleted Sync</p>
              <p className="text-xs text-gray-500 mt-1">Remove products deleted since a date.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-500">Deleted Since</Label>
              <Input type="date" value={deletedSince} onChange={(e) => setDeletedSince(e.target.value)} className="h-9 text-sm" />
            </div>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white gap-2"
              disabled={!deletedSince || triggerLoading === 'deleted'}
              onClick={() => trigger('deleted')}
            >
              <Trash2 className={cn('h-4 w-4', triggerLoading === 'deleted' && 'animate-spin')} />
              {triggerLoading === 'deleted' ? 'Running…' : 'Trigger Deleted Sync'}
            </Button>
          </div>
        </div>
      </div>

      {/* Sync Logs */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">Sync Logs</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['ID', 'Type', 'Status', 'Pages', 'Processed', 'Failed', 'Error', 'Started', 'Completed'].map((h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.id}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${log.type === 'upsert' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[log.status]}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.totalPages ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{log.processedItems ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={log.failedItems ? 'text-red-500 font-medium' : 'text-gray-400'}>
                      {log.failedItems ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-red-500 max-w-xs truncate">
                    {log.errorMessage ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(log.startedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {log.completedAt ? new Date(log.completedAt).toLocaleString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
