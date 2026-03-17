'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/i18n/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, DollarSign } from 'lucide-react';

export function CheckoutClient() {
  const t = useTranslations('checkout');
  const { cart, cartTotal, placeOrder, user } = useApp();
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState('credit');

  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const total = cartTotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder();
    router.push(`/checkout/success?orderId=${order.id}` as never);
  };

  if (cart.length === 0) {
    router.push('/products' as never);
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">{t('title')}</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping + Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping */}
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  {t('shipping')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>{t('address')}</Label>
                    <Input defaultValue={user?.address || ''} required placeholder="123 Main St" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('city')}</Label>
                    <Input defaultValue={user?.city || ''} required placeholder="New York" />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('postalCode')}</Label>
                    <Input
                      defaultValue={user?.postalCode || ''}
                      required
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('country')}</Label>
                    <Input
                      defaultValue={user?.country || ''}
                      required
                      placeholder="United States"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t('phone')}</Label>
                    <Input
                      defaultValue={user?.phone || ''}
                      placeholder="+1 555-0123"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-xl border border-gray-100 bg-white p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('payment')}</h2>
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit')}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                      paymentMethod === 'credit'
                        ? 'border-brand-blue bg-brand-blue-light text-brand-blue'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <CreditCard className="h-4 w-4" />
                    {t('creditCard')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('paypal')}
                    className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all cursor-pointer ${
                      paymentMethod === 'paypal'
                        ? 'border-brand-blue bg-brand-blue-light text-brand-blue'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    <DollarSign className="h-4 w-4" />
                    {t('paypal')}
                  </button>
                </div>

                {paymentMethod === 'credit' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t('cardNumber')}</Label>
                      <Input placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('expiryDate')}</Label>
                      <Input placeholder="MM/YY" />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('cvv')}</Label>
                      <Input placeholder="123" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>{t('nameOnCard')}</Label>
                      <Input placeholder="John Doe" />
                    </div>
                  </div>
                )}
                {paymentMethod === 'paypal' && (
                  <p className="text-sm text-gray-500 py-4">
                    You will be redirected to PayPal to complete your payment.
                  </p>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="rounded-xl border border-gray-100 bg-white p-6 sticky top-36">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="text-green-600">
                      {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span className="text-brand-blue">${total.toFixed(2)}</span>
                  </div>
                </div>
                <CustomButton
                  type="submit"
                  className="w-full mt-6 bg-brand-blue text-white border-brand-blue py-2 lg:py-2.5 px-4 lg:px-6 text-xs lg:text-sm font-semibold"
                  bgHover="#2d3a7a"
                  textHover="white"
                >
                  {t('placeOrder')}
                </CustomButton>

              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
