'use client';

import { ChevronDown } from 'lucide-react';
import { NavLink } from './NavLink';
import { MegaMenu } from './MegaMenu';
import { DropdownPanel } from './DropdownPanel';
import { navMenuItems, newArrivalsDropdown, collectionsDropdown } from '@/lib/navigation-data';

interface DesktopNavigationProps {
  scrolled: boolean;
  desktopNavOpen: boolean;
  activeNav: string | null;
  hoveredCategory: string;
  setHoveredCategory: (val: string) => void;
  handleNavEnter: (id: string) => void;
  handleNavLeave: () => void;
}

export function DesktopNavigation({
  scrolled,
  desktopNavOpen,
  activeNav,
  hoveredCategory,
  setHoveredCategory,
  handleNavEnter,
  handleNavLeave,
}: DesktopNavigationProps) {
  return (
    <>
      <nav
        className="hidden lg:block bg-brand-blue overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: !scrolled || desktopNavOpen ? 200 : 0,
          opacity: !scrolled || desktopNavOpen ? 1 : 0,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 py-1">
          <ul className="flex items-center">
            {navMenuItems.map((item) => (
              <li
                key={item.id}
                className="relative"
                onMouseEnter={() => item.type !== 'link' ? handleNavEnter(item.id) : undefined}
                onMouseLeave={() => item.type !== 'link' ? handleNavLeave() : undefined}
              >
                <NavLink
                  href={item.type === 'link' ? (item as { href?: string }).href : undefined}
                  highlight={(item as { highlight?: boolean }).highlight}
                  active={activeNav === item.id}
                  onMouseEnter={item.type === 'link' ? () => handleNavEnter(item.id) : undefined}
                  onMouseLeave={item.type === 'link' ? handleNavLeave : undefined}
                >
                  {item.label}
                  {item.hasChevron && (
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${activeNav === item.id ? 'rotate-180' : ''}`} />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <MegaMenu
        activeNav={activeNav}
        hoveredCategory={hoveredCategory}
        setHoveredCategory={setHoveredCategory}
        handleNavEnter={handleNavEnter}
        handleNavLeave={handleNavLeave}
      />

      <DropdownPanel
        columns={newArrivalsDropdown.columns}
        promo={newArrivalsDropdown.promo}
        active={activeNav === 'new-arrivals'}
        onMouseEnter={() => handleNavEnter('new-arrivals')}
        onMouseLeave={handleNavLeave}
      />

      <DropdownPanel
        columns={collectionsDropdown.columns}
        promo={collectionsDropdown.promo}
        active={activeNav === 'collections'}
        onMouseEnter={() => handleNavEnter('collections')}
        onMouseLeave={handleNavLeave}
      />
    </>

  );
}
