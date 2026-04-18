'use client';

import { Link } from '@/i18n/navigation';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import type { Category } from '@/types/product.types';

interface CatalogueSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiCategories: Category[];
}

export function CatalogueSheet({ open, onOpenChange, apiCategories }: CatalogueSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="overflow-y-auto p-0 sm:max-w-xs">
        <SheetHeader className="border-b border-gray-100 px-5 py-4">
          <SheetTitle className="text-base font-semibold text-gray-900">Catalogue</SheetTitle>
        </SheetHeader>

        <div className="px-3 py-4">
          <Accordion>
            {apiCategories.map((cat) => {
              if (cat.subcategories.length > 0) {
                return (
                  <AccordionItem key={cat.id} value={cat.slug}>
                    <AccordionTrigger className="px-3 text-sm font-medium text-gray-800 hover:text-brand-blue hover:no-underline">
                      {cat.name}
                    </AccordionTrigger>
                    <AccordionContent className="[&_a]:no-underline pb-1">
                      <div className="flex flex-col gap-0.5 pl-3">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub.id}
                            href={`/products?categorySlug=${cat.slug}&subCategorySlug=${sub.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="block rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-brand-blue-light hover:text-brand-blue transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              // Category with no subcategories → direct link
              return (
                <div key={cat.id} className="border-b border-gray-100 last:border-0">
                  <Link
                    href={`/products?categorySlug=${cat.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-brand-blue-light hover:text-brand-blue transition-colors"
                  >
                    {cat.name}
                  </Link>
                </div>
              );
            })}
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
