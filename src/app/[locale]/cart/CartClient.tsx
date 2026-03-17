'use client';

import { useTranslations } from 'next-intl';
import { useApp } from '@/context/AppContext';
import { Link } from '@/i18n/navigation';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CartClient() {
  const t = useTranslations('cart');
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useApp();

  const shipping = cartTotal >= 50 ? 0 : 5.99;
  const total = cartTotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <ShoppingBag className="h-20 w-20 text-gray-200 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900">{t('empty')}</h1>
        <p className="mt-2 text-gray-500 text-sm">{t('emptyMessage')}</p>
        <Link href="/products">
          <Button className="mt-6 bg-brand-blue hover:bg-brand-blue-dark cursor-pointer">
            {t('continueShopping')}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {cartCount} {t('itemsInCart')}
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-xl border border-gray-100 bg-white p-4 md:p-6"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 md:h-28 md:w-28 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-500 mt-0.5">{item.variant}</p>
                  )}
                  <p className="text-lg font-bold text-brand-blue mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-2.5 py-1.5 text-gray-500 hover:text-brand-blue cursor-pointer"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-gray-500 hover:text-brand-blue cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-xl border border-gray-100 bg-white p-6 sticky top-36">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {t('orderSummary')}
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('subtotal')}</span>
                  <span className="font-medium">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('shipping')}</span>
                  <span className="font-medium text-green-600">
                    {shipping === 0 ? t('freeShipping') : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-semibold">
                  <span>{t('total')}</span>
                  <span className="text-brand-blue">${total.toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button className="w-full mt-6 bg-brand-blue hover:bg-brand-blue-dark cursor-pointer py-5 text-base">
                  {t('checkout')}
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="ghost"
                  className="w-full mt-2 text-brand-blue hover:text-brand-blue-dark cursor-pointer"
                >
                  {t('continueShopping')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
