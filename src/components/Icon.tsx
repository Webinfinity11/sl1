const paths = {
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
  cart: <><path d="M2 3h3l3 12h10l3-9H6" /><circle cx="9" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
  heart: <path d="M20.5 4.7c-2.4-2.3-6.2-1.5-8.5 1-2.3-2.5-6.1-3.3-8.5-1C-2 10 8 17 12 21c4-4 14-11 8.5-16.3Z" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  down: <path d="m6 9 6 6 6-6" />,
  right: <path d="m9 6 6 6-6 6" />,
  left: <path d="m15 6-6 6 6 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  home: <path d="M3 11 12 3l9 8v10h-6v-6H9v6H3V11Z" />,
  phone: <path d="m6 3 4 4-2 3c2 4 4 6 7 7l3-2 4 4c-1 4-4 4-7 3C7 19 2 12 2 7c0-3 2-4 4-4Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  truck: <><path d="M1 5h13v12H1V5Zm13 4h4l4 4v4h-8" /><circle cx="5" cy="19" r="2" /><circle cx="18" cy="19" r="2" /></>,
  box: <><path d="m3 7 9-4 9 4v11l-9 4-9-4V7Zm0 0 9 4 9-4M12 11v11M7 5l10 4" /></>,
  shield: <><path d="m12 2 9 4v6c0 5-6 9-9 10-3-1-9-5-9-10V6l9-4Z" /><path d="m8 12 3 3 5-6" /></>,
  tag: <><path d="M3 3h9l10 10-9 9L3 12V3Z" /><circle cx="8" cy="8" r="1" /></>,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  trash: <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />,
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  check: <path d="m5 12 5 5 9-10" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></>,
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className ? `icon ${className}` : "icon"}>
      {paths[name]}
    </svg>
  );
}
