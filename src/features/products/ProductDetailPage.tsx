'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from '@/i18n/navigation';
// import { useCart } from '@/context/CartContext';  // Cart hidden — quote flow active
import { publicApi } from '@/api';
import { extractApiError } from '@/lib/extractApiError';
import type { ProductDetail, ProductColor, ProductSku } from '@/types/product.types';
import { AlertCircle, Copy, Check, ChevronDown, ZoomIn, X, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CustomButton } from '@/components/ui/CustomButton';
import { QuoteOrderSection } from './components/QuoteOrderSection';

const priceFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

const PLACEHOLDER = '/placeholder-product.png';

// Size sort order
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'ONE SIZE'];

function sortSkus(skus: ProductSku[]): ProductSku[] {
  return [...skus].sort((a, b) => {
    const ai = SIZE_ORDER.indexOf(a.sizeLabel.toUpperCase());
    const bi = SIZE_ORDER.indexOf(b.sizeLabel.toUpperCase());
    if (ai === -1 && bi === -1) return a.sizeLabel.localeCompare(b.sizeLabel);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: { url: string; label: string }[];
  startIdx: number;
  onClose: () => void;
}

function Lightbox({ images, startIdx, onClose }: LightboxProps) {
  const [idx, setIdx] = useState(startIdx);
  const [imgError, setImgError] = useState(false);

  const prev = useCallback(() => { setIdx((i) => (i - 1 + images.length) % images.length); setImgError(false); }, [images.length]);
  const next = useCallback(() => { setIdx((i) => (i + 1) % images.length); setImgError(false); }, [images.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={onClose}>
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Prev */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-5xl max-h-[90vh] px-16" onClick={(e) => e.stopPropagation()}>
        <img
          src={imgError ? PLACEHOLDER : images[idx]?.url ?? PLACEHOLDER}
          alt={images[idx]?.label || 'Product image'}
          onError={() => setImgError(true)}
          className="max-h-[85vh] max-w-full object-contain rounded-xl"
        />
        {images[idx]?.label && (
          <p className="mt-2 text-center text-xs text-white/60">{images[idx].label}</p>
        )}
        {images.length > 1 && (
          <p className="mt-1 text-center text-xs text-white/40">{idx + 1} / {images.length}</p>
        )}
      </div>

      {/* Next */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}

// ─── Image gallery ────────────────────────────────────────────────────────────

function ImageGallery({
  images,
  packshots,
}: {
  images: ProductDetail['images'];
  packshots: ProductColor['packshots'];
}) {
  // When a color is selected and has packshots, show those; otherwise show product images
  const gallery =
    packshots.length > 0
      ? packshots.map((p) => ({ id: p.id, url: p.urlImage, label: p.angleName }))
      : [...images]
          .sort((a) => (a.isMain ? -1 : 1))
          .map((img) => ({ id: img.id, url: img.urlImage, label: '' }));

  const [activeIdx, setActiveIdx] = useState(0);
  const [mainImgError, setMainImgError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Reset active index and error state when gallery source changes (color switch)
  useEffect(() => {
    setActiveIdx(0);
    setMainImgError(false);
  }, [packshots]);

  const activeUrl = mainImgError ? PLACEHOLDER : (gallery[activeIdx]?.url ?? PLACEHOLDER);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — click to open lightbox */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in group"
        onClick={() => setLightboxOpen(true)}
      >
        <img
          src={activeUrl}
          alt="Product"
          onError={() => setMainImgError(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Zoom hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 rounded-full p-2 shadow">
            <ZoomIn className="h-5 w-5 text-gray-700" />
          </div>
        </div>
      </div>

      {/* All images grid — always visible below main */}
      {gallery.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {gallery.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { setActiveIdx(i); setMainImgError(false); }}
              className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIdx
                  ? 'border-brand-blue ring-1 ring-brand-blue/30'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <img
                src={item.url}
                alt={item.label || `view ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={gallery.map((g) => ({ url: g.url, label: g.label }))}
          startIdx={activeIdx}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

// ─── Copy to clipboard button ─────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="ml-1.5 inline-flex items-center rounded p-0.5 text-gray-400 hover:text-gray-700 transition-colors"
      title="Copy reference"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

// ─── Collapsible text ────────────────────────────────────────────────────────

function CollapsibleText({
  text,
  threshold = 200,
}: {
  text: string;
  threshold?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > threshold;
  return (
    <div className="text-sm text-gray-600 leading-relaxed">
      <p>{isLong && !expanded ? text.slice(0, threshold) + '…' : text}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-1 flex items-center gap-1 text-xs text-brand-blue hover:underline font-medium"
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="aspect-square rounded-2xl bg-gray-200" />
      <div className="space-y-4 pt-4">
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="h-7 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/3 bg-gray-200 rounded" />
        <div className="h-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface ProductDetailPageProps {
  catalogReference: string;
}

export function ProductDetailPage({ catalogReference }: ProductDetailPageProps) {
  const locale = useLocale();
  const lang = locale as 'en' | 'fr' | 'de';
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null);
  const [selectedSkuId, setSelectedSkuId] = useState<string | null>(null);
  const [quoteOpen, setQuoteOpen] = useState(false);
  // const { addToCart, setIsCartOpen } = useCart();  // Cart hidden — quote flow active
  // const [added, setAdded] = useState(false);

  const quoteRef = useRef<HTMLDivElement>(null);

  const autoSelectSku = useCallback((skus: ProductSku[]) => {
    const available = sortSkus(skus.filter((s) => !s.isDiscontinued));
    setSelectedSkuId(available.length === 1 ? available[0].id : null);
  }, []);

  const handleColorSelect = useCallback((idx: number, colors: ProductDetail['colors']) => {
    setSelectedColorIdx(idx);
    autoSelectSku(colors[idx].skus);
  }, [autoSelectSku]);

  const handleRequestQuote = () => {
    if (!isAuthenticated) {
      // Redirect to login, preserving the current URL as redirect target
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setQuoteOpen(true);
  };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    publicApi
      .getProductDetail(catalogReference, lang)
      .then((data) => {
        if (!cancelled) {
          setProduct(data);
          const autoColorIdx = data.colors.length === 1 ? 0 : null;
          setSelectedColorIdx(autoColorIdx);
          if (autoColorIdx !== null) {
            const available = sortSkus(data.colors[autoColorIdx].skus.filter((s) => !s.isDiscontinued));
            setSelectedSkuId(available.length === 1 ? available[0].id : null);
          } else {
            setSelectedSkuId(null);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(extractApiError(err));
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [catalogReference, lang]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <Skeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error ?? 'Product not found.'}
        </div>
        <Link href="/products" className="mt-4 inline-block text-sm text-brand-blue hover:underline">
          ← Back to products
        </Link>
      </div>
    );
  }

  const selectedColor: ProductColor | undefined = selectedColorIdx !== null ? product.colors[selectedColorIdx] : undefined;
  const skus = selectedColor ? sortSkus(selectedColor.skus) : [];
  // const canAddToCart = selectedColorIdx !== null && selectedSkuId !== null;  // Cart hidden

  return (
    <div className="bg-white min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-blue transition-colors">
            Products
          </Link>
          <span>/</span>
          <span className="text-gray-700 font-medium truncate max-w-50">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
          {/* LEFT — Image gallery */}
          <ImageGallery
            images={product.images}
            packshots={selectedColor?.packshots ?? []}
          />

          {/* RIGHT — Info */}
          <div className="flex flex-col gap-5">
            {/* Brand & name */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">
                {product.brand}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="mt-1.5 flex items-center text-xs text-gray-400 font-mono">
                Ref: {product.catalogReference}
                <CopyButton text={product.catalogReference} />
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.organic && (
                <span className="rounded-full bg-green-100 text-green-700 border border-green-200 px-3 py-1 text-xs font-semibold">
                  Organic
                </span>
              )}
              {product.recycled && (
                <span className="rounded-full bg-teal-100 text-teal-700 border border-teal-200 px-3 py-1 text-xs font-semibold">
                  Recycled
                </span>
              )}
              {product.vegan && (
                <span className="rounded-full bg-lime-100 text-lime-700 border border-lime-200 px-3 py-1 text-xs font-semibold">
                  Vegan
                </span>
              )}
              {product.saleState && (
                <span className="rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20 px-3 py-1 text-xs font-semibold capitalize">
                  {product.saleState}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Description
                </p>
                <CollapsibleText text={product.description} />
              </div>
            )}

            {/* Composition */}
            {product.composition && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                  Composition
                </p>
                <p className="text-sm text-gray-600">{product.composition}</p>
              </div>
            )}

            {/* Details row */}
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-gray-600">
              {product.weight !== null && (
                <span>
                  <span className="font-medium text-gray-800">Weight:</span>{' '}
                  {product.weight} g/m²
                </span>
              )}
              {product.gender && (
                <span>
                  <span className="font-medium text-gray-800">Gender:</span>{' '}
                  {product.gender}
                </span>
              )}
              {product.labelType && (
                <span>
                  <span className="font-medium text-gray-800">Label:</span>{' '}
                  {product.labelType}
                </span>
              )}
            </div>

            {/* Color selector */}
            {product.colors.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Color
                  {selectedColor && (
                    <span className="ml-2 font-normal text-gray-700">
                      — {selectedColor.colorName}
                      {selectedColor.pantone && (
                        <span className="ml-1 text-gray-400">({selectedColor.pantone})</span>
                      )}
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, idx) => (
                    <button
                      key={color.id}
                      type="button"
                      title={color.colorName}
                      onClick={() => handleColorSelect(idx, product.colors)}
                      className={`h-8 w-8 rounded-full border-2 transition-all shadow-sm ${
                        idx === selectedColorIdx
                          ? 'border-brand-blue ring-2 ring-brand-blue/30'
                          : 'border-gray-300 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color.hexColor || '#999' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size + price table */}
            {skus.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                  Sizes & Pricing
                </p>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Size
                        </th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Price
                        </th>
                        <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Public Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {skus.map((sku) => {
                        const isSelected = sku.id === selectedSkuId;
                        return (
                          <tr
                            key={sku.id}
                            onClick={() => { if (!sku.isDiscontinued) setSelectedSkuId(isSelected ? null : sku.id); }}
                            className={`transition-colors ${
                              sku.isDiscontinued
                                ? 'bg-gray-50 opacity-40 line-through cursor-not-allowed'
                                : isSelected
                                ? 'bg-brand-blue/5 cursor-pointer'
                                : 'hover:bg-gray-50/60 cursor-pointer'
                            }`}
                          >
                            <td className="px-4 py-2.5 font-medium text-gray-900">
                              <span className="flex items-center gap-2">
                                {isSelected && (
                                  <span className="h-2 w-2 rounded-full bg-brand-blue shrink-0" />
                                )}
                                {sku.sizeLabel}
                                {sku.isNew && (
                                  <span className="rounded-full bg-brand-blue text-white text-[10px] px-2 py-0.5 font-bold">
                                    New
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className={`px-4 py-2.5 text-right font-semibold ${ isSelected ? 'text-brand-blue' : 'text-gray-900' }`}>
                              {priceFormatter.format(sku.price)}
                            </td>
                            <td className="px-4 py-2.5 text-right text-gray-500">
                              {sku.publicPrice !== null
                                ? priceFormatter.format(sku.publicPrice)
                                : '—'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* Request a Quote button */}
            <div className="pt-2">
              <CustomButton
                bgHover="#3C4EA1"
                textHover="white"
                onClick={handleRequestQuote}
                className="w-full border-brand-blue font-semibold text-sm py-3 transition-all text-brand-blue"
              >
                <span className="flex items-center justify-center gap-2">
                  <FileText className="h-4 w-4" />
                  Request a Quote
                </span>
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Quote order section — expands below product info */}
        <div ref={quoteRef}>
          <QuoteOrderSection
            product={product}
            open={quoteOpen}
            onClose={() => setQuoteOpen(false)}
            userEmail={user?.email}
          />
        </div>
      </div>
    </div>
  );
}
