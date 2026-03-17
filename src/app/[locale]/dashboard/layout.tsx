import { ProtectedRoute } from '@/components/ProtectedRoute';
import { DashboardNav } from '@/components/dashboard/DashboardNav';
import { getTranslations } from 'next-intl/server';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'dashboard' });

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
                    Menu
                  </h2>
                  <DashboardNav />
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0">
              {children}
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
