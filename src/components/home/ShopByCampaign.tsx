'use client';

import { CustomButton } from '@/components/ui/CustomButton';
import { Link } from '@/i18n/navigation';

interface CampaignCard {
  id: string;
  title: string;
  itemCount: number;
  mainImage: string;
  thumbnails: string[];
}

const campaigns: CampaignCard[] = [
  {
    id: '1',
    title: 'Flannels',
    itemCount: 12,
    mainImage: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '2',
    title: 'Shorts',
    itemCount: 8,
    mainImage: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    id: '3',
    title: 'Hats',
    itemCount: 15,
    mainImage: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=400&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?q=80&w=400&auto=format&fit=crop',
    ],
  },
  {
    id: '4',
    title: 'Socks',
    itemCount: 24,
    mainImage: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400&auto=format&fit=crop',
    thumbnails: [
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=400&auto=format&fit=crop',
    ],
  },
];

export function ShopByCampaign() {
  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4">

        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Shop By Campaign</h2>
        </div>

        {/* Cards Grid (No Slider) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group flex flex-col w-full"
            >
              {/* Visual Area (Top) - With Hover Blur Border */}
              <div className="flex gap-2 h-[350px] md:h-[400px] mb-4 cursor-pointer rounded-xl transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(0,0,0,0.15)] group-hover:ring-4 group-hover:ring-black/5 bg-white">

                {/* Main Image (Left) - Scales on hover */}
                <div className="flex-[2] overflow-hidden rounded-l-xl relative">
                  <img
                    src={campaign.mainImage}
                    alt={campaign.title}
                    className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Thumbnail Strip (Right) - Static on hover */}
                <div className="flex-1 flex flex-col gap-2 rounded-r-xl overflow-hidden">
                  {campaign.thumbnails.map((thumb, idx) => (
                    <div key={idx} className="flex-1 overflow-hidden relative">
                      <img
                        src={thumb}
                        alt={`${campaign.title} thumb ${idx}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Information Area (Bottom) */}
              <div className="flex items-center justify-between px-1 mt-2">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {campaign.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {campaign.itemCount} Items
                  </p>
                </div>
                <Link href="/products">
                  <CustomButton
                    className="font-bold px-8 py-2.5 transition-transform group-hover:-translate-y-1"
                    bgHover="#3C4EA1"
                    textHover="white"
                  >
                    Shop
                  </CustomButton>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}