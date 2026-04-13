import { AdminProtectedRoute } from '@/components/admin/AdminProtectedRoute';
import { AdminNav } from '@/components/admin/AdminNav';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 min-h-[calc(100vh-64px)] border-r border-gray-200 bg-white">
            <div className="sticky top-16 p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                Admin Panel
              </p>
              <AdminNav />
            </div>
          </aside>

          {/* Main Content — full remaining width */}
          <main className="flex-1 min-w-0 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AdminProtectedRoute>
  );
}
