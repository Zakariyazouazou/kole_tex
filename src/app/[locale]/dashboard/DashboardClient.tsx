'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  DollarSign,
} from 'lucide-react';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export function DashboardClient() {
  const t = useTranslations('dashboard');
  const { user, orders, updateUser } = useApp();
  const [saved, setSaved] = useState(false);

  // Form
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

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const delivered = orders.filter((o) => o.status === 'delivered').length;

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="mx-auto max-w-7xl px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
            {t('welcome')}, {user?.name}! 👋
          </h1>
          <p className="text-sm text-gray-500 mb-8">{user?.email}</p>

          <Tabs defaultValue="overview">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent rounded-none h-auto p-0 mb-8">
              {['overview', 'orders', 'accountSettings', 'support'].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:text-brand-blue data-[state=active]:shadow-none px-4 md:px-6 py-3 text-sm cursor-pointer"
                >
                  {t(tab as 'overview' | 'orders' | 'accountSettings' | 'support')}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Overview */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: t('totalOrders'),
                    value: orders.length,
                    icon: ShoppingCart,
                    color: 'text-brand-blue bg-brand-blue-light',
                  },
                  {
                    label: t('pending'),
                    value: pending,
                    icon: Clock,
                    color: 'text-yellow-600 bg-yellow-50',
                  },
                  {
                    label: t('delivered'),
                    value: delivered,
                    icon: CheckCircle,
                    color: 'text-green-600 bg-green-50',
                  },
                  {
                    label: t('totalSpent'),
                    value: `$${totalSpent.toFixed(2)}`,
                    icon: DollarSign,
                    color: 'text-purple-600 bg-purple-50',
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-gray-100 bg-white p-6 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color}`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Orders */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <div className="text-center py-16 rounded-xl border border-gray-100 bg-white">
                  <ShoppingCart className="h-16 w-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-900 font-medium">{t('noOrders')}</p>
                  <p className="text-sm text-gray-500 mt-1">{t('noOrdersMessage')}</p>
                </div>
              ) : (
                <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">
                            {t('orderId')}
                          </th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">
                            {t('date')}
                          </th>
                          <th className="px-6 py-3 text-left font-medium text-gray-500">
                            {t('status')}
                          </th>
                          <th className="px-6 py-3 text-right font-medium text-gray-500">
                            {t('total')}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-mono text-sm font-medium">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {new Date(order.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={`${statusColors[order.status]} border-0 capitalize`}
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right font-semibold">
                              ${order.total.toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Account Settings */}
            <TabsContent value="accountSettings">
              <div className="rounded-xl border border-gray-100 bg-white p-6 max-w-2xl">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {t('editProfile')}
                </h2>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('name')}</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('email')}</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('phone')}</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('company')}</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t('address')}</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('city')}</Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('postalCode')}</Label>
                    <Input
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('country')}</Label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-4 mt-2">
                    <Button
                      type="submit"
                      className="bg-brand-blue hover:bg-brand-blue-dark cursor-pointer"
                    >
                      {t('save')}
                    </Button>
                    {saved && (
                      <span className="text-sm text-green-600 font-medium">
                        ✓ {t('saved')}
                      </span>
                    )}
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Support */}
            <TabsContent value="support">
              <div className="rounded-xl border border-gray-100 bg-white p-6 max-w-2xl">
                <Accordion className="w-full">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left font-medium text-gray-900 cursor-pointer">
                        {t(`faq${i}Q` as 'faq1Q')}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-gray-600 leading-relaxed">
                        {t(`faq${i}A` as 'faq1A')}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
