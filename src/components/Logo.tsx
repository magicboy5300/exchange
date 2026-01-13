export function Logo({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 定义渐变色 */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* 外圈 - 代表全球货币流通 */}
      <circle 
        cx="100" 
        cy="100" 
        r="85" 
        stroke="url(#gradient1)" 
        strokeWidth="6" 
        fill="none"
        opacity="0.3"
      />
      
      {/* 中圈 */}
      <circle 
        cx="100" 
        cy="100" 
        r="70" 
        stroke="url(#gradient1)" 
        strokeWidth="8" 
        fill="none"
      />

      {/* 货币符号组合 - ¥ */}
      <path 
        d="M 85 65 L 100 90 L 115 65" 
        stroke="url(#gradient2)" 
        strokeWidth="8" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
      <line 
        x1="100" 
        y1="90" 
        x2="100" 
        y2="115" 
        stroke="url(#gradient2)" 
        strokeWidth="8" 
        strokeLinecap="round"
      />
      <line 
        x1="88" 
        y1="95" 
        x2="112" 
        y2="95" 
        stroke="url(#gradient2)" 
        strokeWidth="6" 
        strokeLinecap="round"
      />
      <line 
        x1="88" 
        y1="105" 
        x2="112" 
        y2="105" 
        stroke="url(#gradient2)" 
        strokeWidth="6" 
        strokeLinecap="round"
      />

      {/* 循环箭头 - 代表换算转换 */}
      {/* 右侧箭头 */}
      <path 
        d="M 150 80 A 50 50 0 0 1 150 120" 
        stroke="url(#gradient1)" 
        strokeWidth="7" 
        strokeLinecap="round" 
        fill="none"
      />
      <polygon 
        points="150,75 160,80 150,85" 
        fill="url(#gradient1)"
      />

      {/* 左侧箭头 */}
      <path 
        d="M 50 120 A 50 50 0 0 1 50 80" 
        stroke="url(#gradient1)" 
        strokeWidth="7" 
        strokeLinecap="round" 
        fill="none"
      />
      <polygon 
        points="50,125 40,120 50,115" 
        fill="url(#gradient1)"
      />

      {/* 装饰圆点 */}
      <circle cx="100" cy="50" r="5" fill="url(#gradient2)" opacity="0.6" />
      <circle cx="100" cy="150" r="5" fill="url(#gradient2)" opacity="0.6" />
      <circle cx="50" cy="100" r="4" fill="url(#gradient1)" opacity="0.5" />
      <circle cx="150" cy="100" r="4" fill="url(#gradient1)" opacity="0.5" />
    </svg>
  );
}