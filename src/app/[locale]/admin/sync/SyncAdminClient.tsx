'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  MinusCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { adminApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { SyncLogDetail, SyncOverallStatus, SyncRunStatus } from '@/lib/admin-api';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDuration(startedAt: string | null, finishedAt: string | null): string {
  if (!startedAt || !finishedAt) return '—';
  const ms = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
  const mins = Math.floor(ms / 60_000);
  const secs = Math.round((ms % 60_000) / 1000);
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString();
}

const TYPE_LABELS: Record<string, string> = {
  upsert: 'Incremental Sync',
  deleted: 'Deleted Sync',
  'hard-upsert': 'Hard Upsert',
};

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string | null }) {
  if (status === 'running') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
        <Loader2 className="h-3 w-3 animate-spin" />
        In Progress
      </span>
    );
  }
  if (status === 'success') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        <CheckCircle className="h-3 w-3" />
        Success
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
        <XCircle className="h-3 w-3" />
        Failed
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
      <MinusCircle className="h-3 w-3" />
      Never Run
    </span>
  );
}

// ─── Sync Status Card ────────────────────────────────────────────────────────

function SyncCard({ label, run }: { label: string; run: SyncRunStatus }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <StatusBadge status={run.status} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
        <div>
          <p className="font-medium text-gray-400 uppercase tracking-wider mb-0.5">Last Run</p>
          <p>{formatDate(run.startedAt)}</p>
        </div>
        <div>
          <p className="font-medium text-gray-400 uppercase tracking-wider mb-0.5">Duration</p>
          <p>{formatDuration(run.startedAt, run.finishedAt)}</p>
        </div>
        <div>
          <p className="font-medium text-gray-400 uppercase tracking-wider mb-0.5">Processed</p>
          <p>{run.processedItems ?? '—'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-400 uppercase tracking-wider mb-0.5">Failed Items</p>
          <p className={cn(run.failedItems && run.failedItems > 0 ? 'text-red-500 font-semibold' : '')}>
            {run.failedItems ?? '—'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Log Detail Modal ─────────────────────────────────────────────────────────

function LogDetailModal({
  logId,
  open,
  onClose,
}: {
  logId: string | null;
  open: boolean;
  onClose: () => void;
}) {
  const [log, setLog] = useState<SyncLogDetail | null>(null);
  const [error, setError] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchLog = useCallback(async (id: string) => {
    try {
      const data = await adminApi.getSyncLogById(id);
      setLog(data);
      if (data.status !== 'running' && pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    } catch (err) {
      setError(extractApiError(err));
    }
  }, []);

  useEffect(() => {
    if (!open || !logId) return;
    setLog(null);
    setError('');
    fetchLog(logId);
  }, [open, logId, fetchLog]);

  useEffect(() => {
    if (!open || !logId || !log) return;
    if (log.status === 'running') {
      pollRef.current = setInterval(() => fetchLog(logId), 15_000);
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [open, logId, log, fetchLog]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Sync Log Detail
          </DialogTitle>
        </DialogHeader>

        {!log && !error && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        {log && (
          <div className="space-y-3 text-sm">
            {log.status === 'running' && (
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-blue-700">
                <Loader2 className="h-4 w-4 animate-spin shrink-0" />
                <span>Sync in progress… updating every 15 seconds.</span>
              </div>
            )}
            {log.status === 'success' && log.failedItems > 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-yellow-50 border border-yellow-200 px-3 py-2 text-yellow-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>Sync completed with {log.failedItems} failed items.</span>
              </div>
            )}
            {log.status === 'success' && log.failedItems === 0 && (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-green-700">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Sync completed successfully.</span>
              </div>
            )}
            {log.status === 'failed' && (
              <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-red-700">
                <XCircle className="h-4 w-4 shrink-0" />
                <span>{log.errorMessage ?? 'Sync failed.'}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['Type', TYPE_LABELS[log.type] ?? log.type],
                  ['Status', <StatusBadge key="s" status={log.status} />],
                  ['Started At', formatDate(log.startedAt)],
                  ['Finished At', formatDate(log.finishedAt)],
                  ['Duration', formatDuration(log.startedAt, log.finishedAt)],
                  ['Total Pages', String(log.totalPages)],
                  ['Processed Items', String(log.processedItems)],
                  ['Failed Items', String(log.failedItems)],
                ] as [string, React.ReactNode][]
              ).map(([label, value]) => (
                <div key={label} className="rounded-lg border p-2.5 space-y-0.5">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</p>
                  <div className="text-sm text-gray-800">{value}</div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border p-2.5">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Log ID</p>
              <p className="font-mono text-xs text-gray-600 break-all">{log.id}</p>
            </div>
          </div>
        )}

        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function SyncAdminClient() {
  // ── Overall sync status ──
  const [overallStatus, setOverallStatus] = useState<SyncOverallStatus | null>(null);
  const [overallError, setOverallError] = useState('');
  const overallPollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOverallStatus = useCallback(async () => {
    try {
      const data = await adminApi.getSyncOverallStatus();
      setOverallStatus(data);
      const anyRunning =
        data.upsert.status === 'running' ||
        data.deleted.status === 'running' ||
        data.hardUpsert.status === 'running';
      if (!anyRunning && overallPollRef.current) {
        clearInterval(overallPollRef.current);
        overallPollRef.current = null;
      }
    } catch (err) {
      setOverallError(extractApiError(err));
    }
  }, []);

  useEffect(() => {
    fetchOverallStatus();
  }, [fetchOverallStatus]);

  useEffect(() => {
    if (!overallStatus) return;
    const anyRunning =
      overallStatus.upsert.status === 'running' ||
      overallStatus.deleted.status === 'running' ||
      overallStatus.hardUpsert.status === 'running';
    if (anyRunning && !overallPollRef.current) {
      overallPollRef.current = setInterval(fetchOverallStatus, 30_000);
    }
    return () => {
      if (overallPollRef.current) {
        clearInterval(overallPollRef.current);
        overallPollRef.current = null;
      }
    };
  }, [overallStatus, fetchOverallStatus]);

  // ── Hard upsert trigger ──
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [triggerError, setTriggerError] = useState('');
  const [activeSyncLogId, setActiveSyncLogId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleHardUpsert = async () => {
    setConfirmOpen(false);
    setTriggerLoading(true);
    setTriggerError('');
    try {
      const res = await adminApi.triggerHardUpsert();
      setActiveSyncLogId(res.syncLogId);
      setDetailOpen(true);
      await fetchOverallStatus();
    } catch (err) {
      setTriggerError(extractApiError(err));
    } finally {
      setTriggerLoading(false);
    }
  };

  const hardUpsertRunning = overallStatus?.hardUpsert.status === 'running';

  // ── Sync logs table ──
  const [logs, setLogs] = useState<SyncLogDetail[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState('');
  const [logsPage, setLogsPage] = useState(1);
  const [logsTotalPages, setLogsTotalPages] = useState(1);
  const [logsTotal, setLogsTotal] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'upsert' | 'deleted' | 'hard-upsert'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'running' | 'success' | 'failed'>('all');
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const [logDetailOpen, setLogDetailOpen] = useState(false);

  const fetchLogs = useCallback(
    async (page: number, type: typeof filterType, status: typeof filterStatus) => {
      setLogsLoading(true);
      setLogsError('');
      try {
        const data = await adminApi.getSyncLogs(
          page,
          20,
          type === 'all' ? undefined : type,
          status === 'all' ? undefined : status
        );
        setLogs(data.data);
        setLogsTotalPages(data.totalPages);
        setLogsTotal(data.total);
      } catch (err) {
        setLogsError(extractApiError(err));
      } finally {
        setLogsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchLogs(logsPage, filterType, filterStatus);
  }, [fetchLogs, logsPage, filterType, filterStatus]);

  const handleFilterType = (v: typeof filterType) => {
    setLogsPage(1);
    setFilterType(v);
  };
  const handleFilterStatus = (v: typeof filterStatus) => {
    setLogsPage(1);
    setFilterStatus(v);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Toptex Sync"
        description="Manage product catalog synchronisation"
        actions={
          <Button
            onClick={() => setConfirmOpen(true)}
            disabled={triggerLoading || !!hardUpsertRunning}
            className="bg-slate-800 hover:bg-slate-900 text-white gap-2"
          >
            {triggerLoading || hardUpsertRunning ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {hardUpsertRunning ? 'Hard Sync Running…' : 'Run Hard Sync'}
          </Button>
        }
      />

      {/* ── Current Sync Status Overview ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-700">Current Sync Status</h2>
          <button
            onClick={fetchOverallStatus}
            className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </button>
        </div>
        {overallError && <p className="text-sm text-red-500 mb-3">{overallError}</p>}
        {!overallStatus && !overallError && (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading sync status…
          </div>
        )}
        {overallStatus && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <SyncCard label="Nightly Incremental Sync" run={overallStatus.upsert} />
            <SyncCard label="Nightly Deleted Sync" run={overallStatus.deleted} />
            <SyncCard label="Hard Upsert" run={overallStatus.hardUpsert} />
          </div>
        )}
      </div>

      {/* ── Trigger error ── */}
      {triggerError && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <XCircle className="h-4 w-4 shrink-0" />
          {triggerError}
        </div>
      )}

      {/* ── Sync Logs Table ── */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">
            Sync Logs
            {logsTotal > 0 && (
              <span className="ml-1.5 text-gray-400 font-normal">({logsTotal})</span>
            )}
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={filterType}
              onChange={(e) => handleFilterType(e.target.value as typeof filterType)}
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">All Types</option>
              <option value="upsert">Incremental Sync</option>
              <option value="deleted">Deleted Sync</option>
              <option value="hard-upsert">Hard Upsert</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterStatus(e.target.value as typeof filterStatus)}
              className="h-8 rounded-md border border-gray-200 px-2 text-xs text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="all">All Statuses</option>
              <option value="running">Running</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <button
              onClick={() => fetchLogs(logsPage, filterType, filterStatus)}
              className="text-gray-400 hover:text-gray-600"
              title="Refresh logs"
            >
              <RefreshCw className={cn('h-4 w-4', logsLoading && 'animate-spin')} />
            </button>
          </div>
        </div>

        {logsError && <div className="px-6 py-4 text-sm text-red-500">{logsError}</div>}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['Type', 'Status', 'Started At', 'Finished At', 'Duration', 'Processed', 'Failed', 'Actions'].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 whitespace-nowrap">
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {logsLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {!logsLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-400">
                    No sync logs found.
                  </td>
                </tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        log.type === 'hard-upsert'
                          ? 'bg-purple-50 text-purple-600'
                          : log.type === 'upsert'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-orange-50 text-orange-600'
                      )}
                    >
                      {TYPE_LABELS[log.type] ?? log.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={log.status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(log.startedAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {formatDate(log.finishedAt)}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    {formatDuration(log.startedAt, log.finishedAt)}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.processedItems ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={log.failedItems > 0 ? 'text-red-500 font-medium' : 'text-gray-400'}>
                      {log.failedItems}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedLogId(log.id);
                        setLogDetailOpen(true);
                      }}
                      className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-sm text-gray-500">
          <span>
            Page {logsPage} of {logsTotalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
              disabled={logsPage <= 1}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setLogsPage((p) => Math.min(logsTotalPages, p + 1))}
              disabled={logsPage >= logsTotalPages}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirm hard upsert dialog ── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Confirm Hard Upsert
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600 leading-relaxed">
            This will update <strong>ALL products</strong> from Toptex. It may take{' '}
            <strong>several hours</strong> to complete and runs in the background.
          </p>
          <p className="text-xs text-gray-400 mt-1">
            The nightly sync runs automatically at 02:00 AM server time. Only trigger manually when
            needed.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleHardUpsert}
              className="bg-slate-800 hover:bg-slate-900 text-white"
            >
              Yes, Start Hard Sync
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Live progress modal after triggering ── */}
      <LogDetailModal
        logId={activeSyncLogId}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      {/* ── Log detail modal from table ── */}
      <LogDetailModal
        logId={selectedLogId}
        open={logDetailOpen}
        onClose={() => {
          setLogDetailOpen(false);
          setSelectedLogId(null);
        }}
      />

      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <Clock className="h-3.5 w-3.5" />
        Nightly syncs run automatically at 02:00 AM server time (UTC).
      </div>
    </div>
  );
}
