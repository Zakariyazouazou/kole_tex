'use client';

interface HamburgerButtonProps {
  open: boolean;
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function HamburgerButton({
  open,
  onClick,
  size = 'md',
}: HamburgerButtonProps) {
  const w = size === 'sm' ? 'w-5' : 'w-[22px]';
  const h = size === 'sm' ? 'h-3.5' : 'h-4';
  const ty = size === 'sm' ? 5.5 : 7;

  return (
    <button
      onClick={onClick}
      className={`relative  ${w} ${h} flex flex-col justify-between cursor-pointer`}
      aria-label="Menu"
    >
      <span
        className="block h-[2px] w-full bg-gray-700 rounded-full transition-all duration-300 ease-in-out origin-center"
        style={{ transform: open ? `translateY(${ty}px) rotate(45deg)` : 'translateY(0) rotate(0)' }}
      />
      <span
        className="block h-[2px] w-full bg-gray-700 rounded-full transition-all duration-200 ease-in-out"
        style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'scaleX(1)' }}
      />
      <span
        className="block h-[2px] w-full bg-gray-700 rounded-full transition-all duration-300 ease-in-out origin-center"
        style={{ transform: open ? `translateY(-${ty}px) rotate(-45deg)` : 'translateY(0) rotate(0)' }}
      />
    </button>
  );
}
