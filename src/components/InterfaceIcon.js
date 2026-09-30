export default function InterfaceIcon({ name = 'city', size = 20, ...props }) {
  const paths = {
    city: <><path d="M3 21V9h6V3h6v10h6v8H3Z" /><path d="M6 12v1m0 3v1m6-11v1m0 3v1m0 3v1m0 3v1m6-3v1" /></>,
    book: <><path d="M12 5v16m0-16C8 2 4 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 1Z" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m16 8-2.5 5.5L8 16l2.5-5.5L16 8Z" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
    health: <><path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z" /></>,
    transport: <><rect x="4" y="3" width="16" height="16" rx="4" /><path d="M4 12h16M8 6h8M7 19v2m10-2v2M8 15h.01M16 15h.01" /></>,
    industry: <><path d="M4 21h16M8 21v-4h8v4M12 17l-4-5 5-6 5 3-2 4m-1-1 3 3 3-3" /><circle cx="8" cy="11" r="2" /><circle cx="14" cy="6" r="2" /></>,
    education: <><path d="m2 8 10-5 10 5-10 5L2 8Zm4 2v7c4 3 8 3 12 0v-7m4-2v9" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.city}</svg>;
}
