// Inline SVG icons lifted verbatim from the KCA Player Portal reference.
// Usage: <Icon name="dashboard" />  (sizing is handled by the parent CSS)
const PATHS = {
  phone: (
    <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.25 1Z" />
  ),
  youtube: (
    <path d="M23 12s0-3.5-.45-5.15a2.6 2.6 0 0 0-1.83-1.84C18.9 4.5 12 4.5 12 4.5s-6.9 0-8.72.51A2.6 2.6 0 0 0 1.45 6.85C1 8.5 1 12 1 12s0 3.5.45 5.15a2.6 2.6 0 0 0 1.83 1.84C5.1 19.5 12 19.5 12 19.5s6.9 0 8.72-.51a2.6 2.6 0 0 0 1.83-1.84C23 15.5 23 12 23 12ZM9.75 15.5v-7l6 3.5-6 3.5Z" />
  ),
  facebook: <path d="M14 8h2V5h-2c-2 0-3 1.2-3 3v2H9v3h2v6h3v-6h2.2l.3-3H14V8.5c0-.4.2-.5.6-.5Z" />,
  twitter: (
    <path d="M22 5.9c-.7.3-1.5.5-2.3.6a4 4 0 0 0 1.8-2.2c-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.8 3.6A11.3 11.3 0 0 1 3.8 4.7a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5a4 4 0 0 0 3.2 3.9c-.5.2-1.1.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 18a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2Z" />
  ),
  instagram: (
    <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5-1.2a.8.8 0 1 1-1.6 0 .8.8 0 0 1 1.6 0ZM12 4.5c2.3 0 2.6 0 3.5.05 1 .05 1.5.2 1.9.35.5.18.8.4 1.2.8.4.4.6.7.8 1.2.15.4.3.9.35 1.9.04.9.05 1.2.05 3.5s0 2.6-.05 3.5c-.05 1-.2 1.5-.35 1.9-.18.5-.4.8-.8 1.2-.4.4-.7.6-1.2.8-.4.15-.9.3-1.9.35-.9.04-1.2.05-3.5.05s-2.6 0-3.5-.05c-1-.05-1.5-.2-1.9-.35a3.2 3.2 0 0 1-1.2-.8 3.2 3.2 0 0 1-.8-1.2c-.15-.4-.3-.9-.35-1.9C4.5 14.6 4.5 14.3 4.5 12s0-2.6.05-3.5c.05-1 .2-1.5.35-1.9.18-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.15.9-.3 1.9-.35C9.4 4.5 9.7 4.5 12 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  bell: <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6-2-2v-4a5 5 0 0 0-4-4.9V4a1 1 0 0 0-2 0v1.1A5 5 0 0 0 7 10v4l-2 2v1h14v-1Z" />,
  settings: <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm8.4 4 1.5-1.2-1.5-2.6-1.8.6a6.9 6.9 0 0 0-1.5-.9L16.7 6h-3l-.4 1.9a6.9 6.9 0 0 0-1.5.9l-1.8-.6L8 10.8 9.5 12 8 13.2l1.5 2.6 1.8-.6c.5.4 1 .7 1.5.9l.4 1.9h3l.4-1.9c.5-.2 1-.5 1.5-.9l1.8.6 1.5-2.6L20.4 12Z" />,
  logout: <path d="M16 17v-2H9V9h7V7l4 5-4 5ZM4 4h8v2H6v12h6v2H4V4Z" />,
  dashboard: <path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" />,
  team: <path d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-2.7 0-8 1.34-8 4v3h10v-3c0-.94.42-1.83 1.13-2.6A12.6 12.6 0 0 0 8 13Zm8 0c-.35 0-.74.02-1.16.06A5.3 5.3 0 0 1 17 17v3h7v-3c0-2.66-5.3-4-8-4Z" />,
  shield: <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm1 13h-2v-2h2v2Zm0-4h-2V7h2v4Z" />,
  clipboardCheck: <path d="M19 3h-4.18A3 3 0 0 0 9.18 3H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7 0a1 1 0 1 1-1 1 1 1 0 0 1 1-1Zm-3 15-3-3 1.4-1.4L9 15.2l4.6-4.6L15 12l-6 6Z" />,
  back: <path d="M19 12H5m6 6-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  plus: <path d="M12 5v14m-7-7h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  shieldCheck: <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm-1.2 14L7 12.2l1.4-1.4 2.4 2.4 4.8-4.8L17 9.8 10.8 16Z" />,
  user: <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-3.3 0-10 1.67-10 5v3h20v-3c0-3.33-6.7-5-10-5Z" />,
  physio: <path d="M19 8a3 3 0 0 0-3 3v3.5a2.5 2.5 0 1 1-5 0V8.83A3 3 0 1 0 9 8.83V14.5a4.5 4.5 0 1 0 9 0V11a1 1 0 0 1 2 0 1 1 0 0 0 2 0 3 3 0 0 0-3-3Z" />,
  trainer: <path d="M14 8a6 6 0 1 0 0 8h6a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-6Zm-5 7a3 3 0 1 1 3-3 3 3 0 0 1-3 3Z" />,
  apple: <path d="M17 4a4 4 0 0 0-3 1.4A4 4 0 0 0 11 4c-3 0-5 2.5-5 6 0 4 3 10 5 10 1 0 1.3-.6 2-.6s1 .6 2 .6c2 0 5-6 5-10 0-1.6-.4-3-1.2-4M13 3a3 3 0 0 0 3-3 3 3 0 0 0-3 3Z" />,
  alert: (
    <>
      <path d="M12 2 1 21h22L12 2Zm0 14h0m0-7v4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1.2" fill="currentColor" />
    </>
  ),
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  chevronRight: <path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />,
  check: <path d="m5 12 5 5L20 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  file: <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13Z" />,
};

export default function Icon({ name, ...props }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      {PATHS[name] || null}
    </svg>
  );
}
