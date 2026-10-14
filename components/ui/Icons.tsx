import type { SVGProps } from "react";

/** Inline stroke icons, 1.6 px stroke. Decorative — label the button or link that holds them. */
function Icon({ children, size = 20, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  );
}

type P = SVGProps<SVGSVGElement> & { size?: number };

export const SearchIcon = (p: P) => (<Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>);
export const AccountIcon = (p: P) => (<Icon {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></Icon>);
export const HeartIcon = (p: P) => (<Icon {...p}><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></Icon>);
export const BagIcon = (p: P) => (<Icon {...p}><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></Icon>);
export const MenuIcon = (p: P) => (<Icon {...p}><path d="M4 7h16M4 12h16M4 17h16" /></Icon>);
export const CloseIcon = (p: P) => (<Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>);
export const HomeIcon = (p: P) => (<Icon {...p}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></Icon>);
export const ShopIcon = (p: P) => (<Icon {...p}><path d="M8 4l-4 3 2 4 2-1v10h8V10l2 1 2-4-4-3c-1 1.5-2.4 2-4 2s-3-.5-4-2z" /></Icon>);
export const StylistIcon = (p: P) => (<Icon {...p}><path d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8z" /><path d="M18 15l.8 2.2L21 18l-2.2.8L18 21l-.8-2.2L15 18l2.2-.8z" /></Icon>);
export const ChatIcon = (p: P) => (<Icon {...p}><path d="M4 20l1.4-4A8 8 0 1 1 8 18.6z" /></Icon>);
