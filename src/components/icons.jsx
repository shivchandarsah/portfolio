/* Central icon set — the single source of truth for every glyph in the UI.

   Style contract (so every icon reads at the same visual weight):
     • 24x24 viewBox, currentColor, round caps + joins
     • strokeWidth 2 (default) for UI / inline icons (<= 18px)
     • strokeWidth 1.5 for large decorative glyphs (>= 20px)
     • brand marks (GitHub, LinkedIn, Instagram, Facebook) keep their
       official shape so company logos stay recognisable
     • icons are decorative and aria-hidden; the interactive parent owns
       the accessible label

   <AppIcon name="database" /> renders from the ICONS registry, so data
   files can reference an icon by key instead of embedding a glyph. */

const UI_STROKE = 2;  // inline / UI icons

function Svg({ size = 18, className, strokeWidth = UI_STROKE, children, ...rest }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true" focusable="false" {...rest}
    >
      {children}
    </svg>
  );
}

function Brand({ size = 17, className, children, ...rest }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="currentColor"
      className={className} aria-hidden="true" focusable="false" {...rest}
    >
      {children}
    </svg>
  );
}

/* ── Brand marks (official shapes, unchanged) ──────────────────── */

export function GithubIcon({ size = 17, className }) {
  return (
    <Brand size={size} className={className}>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.305-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </Brand>
  );
}

export function LinkedinIcon({ size = 17, className }) {
  return (
    <Brand size={size} className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </Brand>
  );
}

export function FacebookIcon({ size = 18, className }) {
  return (
    <Brand size={size} className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </Brand>
  );
}

export function InstagramIcon({ size = 18, className }) {
  return (
    <Svg size={size} className={className} strokeWidth={UI_STROKE}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </Svg>
  );
}

/* ── Contact / identity ────────────────────────────────────────── */

export function MailIcon({ size = 20, className }) {
  return (
    <Svg size={size} className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7.5 12 14 2 7.5" />
    </Svg>
  );
}

export function PhoneIcon({ size = 18, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
  );
}

export function LocationIcon({ size = 15, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </Svg>
  );
}

export function CheckIcon({ size = 20, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

export function CheckCircleIcon({ size = 20, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

export function DownloadIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  );
}

export function FileTextIcon({ size = 18, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </Svg>
  );
}

export function SendIcon({ size = 18, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </Svg>
  );
}

/* ── Navigation / actions ──────────────────────────────────────── */

export function ArrowRightIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

export function ArrowLeftIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </Svg>
  );
}

export function ArrowUpIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </Svg>
  );
}

export function ArrowDownIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </Svg>
  );
}

export function ArrowUpRightIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </Svg>
  );
}

export function ExternalLinkIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </Svg>
  );
}

export function ChevronUpIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="18 15 12 9 6 15" />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="6 9 12 15 18 9" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

export function ChevronLeftIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

export function CloseIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}

export function MenuIcon({ size = 20, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </Svg>
  );
}

export function SearchIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.3" y2="16.3" />
    </Svg>
  );
}

export function PlayIcon({ size = 14, className }) {
  return (
    <Svg size={size} className={className}>
      <polygon points="6 3.5 19 12 6 20.5" />
    </Svg>
  );
}

export function RotateCcwIcon({ size = 14, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </Svg>
  );
}

export function ArrowUpDownIcon({ size = 14, className }) {
  return (
    <Svg size={size} className={className}>
      <line x1="12" y1="4" x2="12" y2="20" />
      <polyline points="8 8 12 4 16 8" />
      <polyline points="8 16 12 20 16 16" />
    </Svg>
  );
}

export function EnterIcon({ size = 14, className }) {
  return (
    <Svg size={size} className={className}>
      <polyline points="9 10 4 15 9 20" />
      <path d="M20 4v7a4 4 0 0 1-4 4H4" />
    </Svg>
  );
}

export function AlertTriangleIcon({ size = 16, className }) {
  return (
    <Svg size={size} className={className}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </Svg>
  );
}

/* ── Technology / domain ───────────────────────────────────────── */

export function CodeIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </Svg>
  );
}

export function ServerIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
    </Svg>
  );
}

export function DatabaseIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </Svg>
  );
}

export function ZapIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
    </Svg>
  );
}

export function LockIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </Svg>
  );
}

export function BotIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <rect x="3" y="8" width="18" height="12" rx="3" />
      <line x1="12" y1="4" x2="12" y2="8" />
      <circle cx="12" cy="2.5" r="1.2" />
      <line x1="8" y1="13" x2="8.01" y2="13" />
      <line x1="16" y1="13" x2="16.01" y2="13" />
      <line x1="9" y1="17" x2="15" y2="17" />
      <line x1="1" y1="13" x2="3" y2="13" />
      <line x1="21" y1="13" x2="23" y2="13" />
    </Svg>
  );
}

export function SettingsIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </Svg>
  );
}

export function LayersIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </Svg>
  );
}

export function GlobeIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </Svg>
  );
}

export function ToolIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  );
}

export function DeployIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
    </Svg>
  );
}

export function BriefcaseIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </Svg>
  );
}

export function BookOpenIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </Svg>
  );
}

export function MonitorIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M9.75 17 9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
    </Svg>
  );
}

export function GraduationCapIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 0 1 .665 6.479 11.952 11.952 0 0 1-6.825 2.998 11.952 11.952 0 0 0-6.824-2.998 12.078 12.078 0 0 1 .665-6.479L12 14z" />
    </Svg>
  );
}

export function AwardIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="8" r="6" />
      <polyline points="8.21 13.89 7 22 12 19 17 22 15.79 13.88" />
    </Svg>
  );
}

export function LightbulbIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.62.44 1 1.15 1 1.9V18h5.2v-2.3c0-.75.38-1.46 1-1.9A6 6 0 0 0 12 3z" />
      <line x1="10" y1="21" x2="14" y2="21" />
    </Svg>
  );
}

export function TargetIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </Svg>
  );
}

export function NetworkIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </Svg>
  );
}

export function FlaskIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M9 3h6" />
      <path d="M10 3v6.2L5.3 17.3A1.8 1.8 0 0 0 6.9 20h10.2a1.8 1.8 0 0 0 1.6-2.7L14 9.2V3" />
      <line x1="8" y1="15" x2="16" y2="15" />
    </Svg>
  );
}

export function InspectIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16zm1-11v6m-3-3h6" />
    </Svg>
  );
}

export function LinkIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </Svg>
  );
}

export function PackageIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </Svg>
  );
}

export function CalendarIcon({ size = 18, className, strokeWidth }) {
  return (
    <Svg size={size} className={className} strokeWidth={strokeWidth}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

export function DiamondIcon({ size = 18, className, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={UI_STROKE}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true" focusable="false">
      <polygon points="12 2.5 21.5 12 12 21.5 2.5 12" />
    </svg>
  );
}

export function CircleIcon({ size = 18, className, filled }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={UI_STROKE}
      strokeLinecap="round" strokeLinejoin="round"
      className={className} aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

/* ── Registry — lets data files reference icons by key ─────────── */

const ICONS = {
  award:      AwardIcon,
  book:       BookOpenIcon,
  bot:        BotIcon,
  briefcase:  BriefcaseIcon,
  calendar:   CalendarIcon,
  check:      CheckIcon,
  circle:     CircleIcon,
  code:       CodeIcon,
  database:   DatabaseIcon,
  deploy:     DeployIcon,
  diamond:    DiamondIcon,
  download:   DownloadIcon,
  file:       FileTextIcon,
  flask:      FlaskIcon,
  globe:      GlobeIcon,
  graduation: GraduationCapIcon,
  inspect:    InspectIcon,
  layers:     LayersIcon,
  lightbulb:  LightbulbIcon,
  link:       LinkIcon,
  lock:       LockIcon,
  mail:       MailIcon,
  monitor:    MonitorIcon,
  network:    NetworkIcon,
  package:    PackageIcon,
  phone:      PhoneIcon,
  pin:        LocationIcon,
  play:       PlayIcon,
  search:     SearchIcon,
  send:       SendIcon,
  server:     ServerIcon,
  settings:   SettingsIcon,
  target:     TargetIcon,
  tool:       ToolIcon,
  zap:        ZapIcon,
};

export function AppIcon({ name, size = 18, className, strokeWidth }) {
  const Glyph = ICONS[name] || CircleIcon;
  return <Glyph size={size} className={className} strokeWidth={strokeWidth} />;
}

