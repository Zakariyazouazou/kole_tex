'use client';

import { useState } from 'react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash2, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import type { AdminReview } from '@/lib/admin-api';

// Mock data — replace with real API: getAllReviews(page, limit)
const MOCK_REVIEWS: AdminReview[] = Array.from({ length: 18 }, (_, i) => ({
  id: `rev-${i + 1}`,
  userId: `user-${(i % 8) + 1}`,
  userFirstName: ['Alice', 'Bob', 'Carol', 'Dan', 'Eva'][i % 5],
  userLastName: ['Martin', 'Smith', 'White', 'Brown', 'Green'][i % 5],
  productId: `prod-${(i % 10) + 1}`,
  rating: (i % 5) + 1,
  comment: [
    'Great quality, very satisfied!',
    'Arrived quickly, matches the description.',
    'Good but sizing runs small.',
    'Excellent material, will buy again.',
    'Average product, nothing special.',
  ][i % 5],
  createdAt: new Date(2026, 0, i + 1).toISOString(),
}));

const PAGE_SIZE = 10;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200 fill-gray-200'}`}
        />
      ))}
    </div>
  );
}

export function ReviewsAdminClient() {
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<AdminReview | null>(null);

  const totalPages = Math.ceil(MOCK_REVIEWS.length / PAGE_SIZE);
  const paginated = MOCK_REVIEWS.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = () => {
    // TODO: call deleteReview(deleteTarget!.id)
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Reviews" description={`${MOCK_REVIEWS.length} reviews — moderation`} />

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider">
                {['ID', 'User', 'Product ID', 'Rating', 'Comment', 'Created', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">{review.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 whitespace-nowrap">
                      {review.userFirstName} {review.userLastName}
                    </p>
                    <p className="text-xs text-gray-400">{review.userId}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{review.productId}</td>
                  <td className="px-4 py-3"><StarRating rating={review.rating} /></td>
                  <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{review.comment}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteTarget(review)}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Delete Review</DialogTitle></DialogHeader>
          <p className="text-sm text-gray-600 mt-2">
            Delete this review by{' '}
            <span className="font-semibold">{deleteTarget?.userFirstName} {deleteTarget?.userLastName}</span>?
            This action cannot be undone.
          </p>
          <div className="mt-2 p-3 rounded-lg bg-gray-50 text-sm text-gray-600 italic">
            &ldquo;{deleteTarget?.comment}&rdquo;
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
