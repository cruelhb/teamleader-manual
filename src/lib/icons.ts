/** 24px 격자와 동일한 선 굵기를 사용하는 사이트 공통 아이콘. */
export const ICON_STROKE_WIDTH = 1.75;

/** 기존 본문의 ico--이름도 같은 도형을 사용한다. */
export const ICON_PATHS = {
  logo: '<path d="M12 6.5C9.5 4.8 6.5 4.5 3 5v14c3.5-.5 6.5-.2 9 1.5 2.5-1.7 5.5-2 9-1.5V5c-3.5-.5-6.5-.2-9 1.5Z"/><path d="M12 6.5v14M6 9h3M15 9h3"/>',
  notice: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  guide: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m7 8 1 1 2-2m-3 7 1 1 2-2M13 8h4M13 14h4"/>',
  rules: '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  welfare: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 21v-2a6 6 0 0 0-3-5.2"/>',
  faq: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 17h.01"/>',
  form: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 4.5 4.5"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  link: '<path d="m10 13 4-4M8.5 15.5l-1 1a3.5 3.5 0 0 1-5-5l4-4a3.5 3.5 0 0 1 5 0M15.5 8.5l1-1a3.5 3.5 0 0 1 5 5l-4 4a3.5 3.5 0 0 1-5 0"/>',
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  envelope: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h2M13 15h2"/>',
  book: '<path d="M12 6.5C9.5 4.8 6.5 4.5 3 5v14c3.5-.5 6.5-.2 9 1.5 2.5-1.7 5.5-2 9-1.5V5c-3.5-.5-6.5-.2-9 1.5Z"/><path d="M12 6.5v14"/>',
  medical: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M9 5V3h6v2M12 10v6M9 13h6"/>',
  key: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M16 7l3 3M18 5l3 3"/>',
  rings: '<circle cx="8.5" cy="14" r="5"/><circle cx="15.5" cy="10" r="5"/>',
  candle: '<path d="M12 3s2.5 3 2.5 5a2.5 2.5 0 0 1-5 0c0-2 2.5-5 2.5-5Z"/><rect x="9" y="13" width="6" height="8" rx="1"/><path d="M12 10.5V13M6 21h12"/>',
  age: '<rect x="4" y="12" width="16" height="9" rx="2"/><path d="M4 16c2 0 2 2 4 2s2-2 4-2 2 2 4 2 2-2 4-2M8 8v4M12 8v4M16 8v4M8 4v1M12 3v1M16 4v1"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
  alert: '<path d="M10.3 4a2 2 0 0 1 3.4 0l7 12a2 2 0 0 1-1.7 3H5a2 2 0 0 1-1.7-3l7-12Z"/><path d="M12 8v5M12 16h.01"/>',
  // 작은 원화 글자 대신 지갑으로 금액을 표시한다.
  won: '<path d="M20 8H5a2 2 0 0 1 0-4h13v4M3 6v12a2 2 0 0 0 2 2h15V8"/><path d="M20 12h-4a2 2 0 0 0 0 4h4M16 14h.01"/>',
  minus: '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  home: '<path d="m3 10 9-7 9 7M5 9v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9M9 21v-8h6v8"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  arrowLeft: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  arrowRight: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
} as const;

export type IconName = keyof typeof ICON_PATHS;
export const isIconName = (value: string): value is IconName =>
  Object.prototype.hasOwnProperty.call(ICON_PATHS, value);

/** Astro와 브라우저 공통 SVG. 장식이므로 읽어주기 대상에서 제외한다. */
export function iconSvg(name: IconName, size = 22, className = 'icon'): string {
  const shapes = ICON_PATHS[name];
  if (!shapes) return '';
  return `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes}</svg>`;
}

/** 마크다운 본문의 CSS mask도 같은 선과 모양을 쓴다. */
export function iconDataUri(name: IconName): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function bodyIconCss(): string {
  return `:root{--disclosure-icon:${iconDataUri('chevronDown')}}\n` + (Object.keys(ICON_PATHS) as IconName[])
    .map((name) => `.ico--${name}{--ico:${iconDataUri(name)}}`).join('\n');
}

/** 헤더와 같은 책 모양을 브라우저 탭에도 표시한다. */
export function faviconDataUri(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#1f5fa9"/><g transform="translate(4 4)" fill="none" stroke="white" stroke-width="${ICON_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS.logo}</g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
