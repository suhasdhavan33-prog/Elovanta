const LogoMark = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
    <defs>
      <linearGradient id="elovantaGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF7A1A" />
        <stop offset="100%" stopColor="#A83800" />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="100" height="100" rx="24" fill="url(#elovantaGrad)" />
    <rect x="28" y="26" width="14" height="48" rx="6" fill="#ffffff" />
    <rect x="28" y="26" width="46" height="14" rx="6" fill="#ffffff" />
    <rect x="28" y="43" width="38" height="14" rx="6" fill="#ffffff" />
    <rect x="28" y="60" width="46" height="14" rx="6" fill="#ffffff" />
    <path
      d="M82 10 L85.2 17.5 L93 20 L85.2 22.5 L82 30 L78.8 22.5 L71 20 L78.8 17.5 Z"
      fill="#ffffff"
    />
  </svg>
);

const Logo = ({ size = 36, withText = true, className = '' }) => (
  <span className={`logo-lockup ${className}`}>
    <LogoMark size={size} />
    {withText && <span className="logo-text">Elovanta</span>}
  </span>
);

export default Logo;
