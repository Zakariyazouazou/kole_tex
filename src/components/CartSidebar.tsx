'use client';

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomButton } from '@/components/ui/CustomButton';


interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();
  const t = useTranslations('cart');

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('title')}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="h-16 w-16 text-gray-200 mb-4" />
                <p className="text-gray-500 font-medium">{t('empty')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('emptyMessage')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-gray-100 p-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h3>
                      {item.variant && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.variant}</p>
                      )}
                      <p className="text-sm font-semibold text-brand-blue mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.quantity - 1))
                          }
                          className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-colors cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue transition-colors cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4 space-y-3">
              <div className="flex items-center justify-between text-base font-semibold">
                <span>{t('subtotal')}</span>
                <span className="text-brand-blue">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/checkout" onClick={onClose} className="block w-full order-1">
                  <CustomButton className="w-full bg-brand-blue text-white border-brand-blue py-2 lg:py-2.5 px-4 lg:px-6 text-xs lg:text-sm font-semibold" bgHover="#2d3a7a" textHover="white">
                    {t('checkout')}
                  </CustomButton>
                </Link>
                <Link href="/cart" onClick={onClose} className="block w-full order-2">
                  <CustomButton className="w-full border-gray-200 text-gray-600 py-2 lg:py-2.5 px-4 lg:px-6 text-xs lg:text-sm font-medium" bgHover="#f8f9fa" textHover="#3C4EA1">
                    {t('title')}
                  </CustomButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
