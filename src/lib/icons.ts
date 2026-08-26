/**
 * 사이트에서 쓰는 아이콘 모음.
 *
 * 이모지(그림) 대신 얇은 선으로 그린 도형만 쓴다. 이유:
 *  - 이모지는 기기(아이폰/안드로이드/윈도우)마다 그림이 달라 화면이 제각각이었다.
 *  - 색이 알록달록해서 글자와 섞이면 정돈되어 보이지 않는다.
 *  - 선 아이콘은 글자색(currentColor)을 그대로 따라가므로 다크 모드에서도 알아서 맞는다.
 *
 * 아이콘을 추가할 때는 아래 규칙을 지킨다.
 *  - 24x24 격자 안에서 그린다 (viewBox 는 Icon.astro 가 붙인다)
 *  - 채우기(fill)를 쓰지 않고 선(stroke)만 쓴다. 굵기·색도 Icon.astro 가 정한다
 *  - 여백을 남긴다. 실제 그림은 대략 4~20 범위 안에 둔다
 */

export type IconName =
  // 사이트 상징
  | 'logo'
  // 메뉴(카테고리) 5개
  | 'notice'
  | 'guide'
  | 'welfare'
  | 'faq'
  | 'form'
  // 화면 조작
  | 'search'
  | 'copy'
  | 'download'
  // 자주 찾는 항목 타일용
  | 'envelope'
  | 'calendar'
  | 'book'
  | 'medical'
  | 'key'
  // 문서 본문에서 쓰는 것들
  | 'rings'
  | 'candle'
  | 'age'
  | 'star'
  | 'alert'
  | 'won'
  | 'minus'
  | 'info';

/** 아이콘 이름 → SVG 내부 도형. <svg> 껍데기는 Icon.astro / iconSvg() 가 붙인다. */
export const ICON_PATHS: Record<IconName, string> = {
  // 사이트 상징 — 겹친 마름모. 헤더 로고와 파비콘에 함께 쓴다
  logo: `<path d="M12 3.4 20.6 12 12 20.6 3.4 12z" />
    <path d="M12 8.6 15.4 12 12 15.4 8.6 12z" fill="currentColor" stroke="none" />`,

  // 공지사항 — 가운데 점에서 퍼져 나가는 호 (알림을 내보내는 모양)
  notice: `<circle cx="12" cy="12" r="2.1" />
    <path d="M8.4 8.4a6.5 6.5 0 0 0 0 7.2" />
    <path d="M15.6 15.6a6.5 6.5 0 0 0 0-7.2" />
    <path d="M6.2 6.2a11 11 0 0 0 0 11.6" />
    <path d="M17.8 17.8a11 11 0 0 0 0-11.6" />`,

  // 업무 매뉴얼 — 점과 선으로 된 단계 목록
  guide: `<circle cx="6.4" cy="7" r="1.15" />
    <circle cx="6.4" cy="12" r="1.15" />
    <circle cx="6.4" cy="17" r="1.15" />
    <path d="M10.6 7h7" />
    <path d="M10.6 12h7" />
    <path d="M10.6 17h4.2" />`,

  // 복지·인사 — 사람
  welfare: `<circle cx="12" cy="8.6" r="3.35" />
    <path d="M5.6 19.6a6.4 6.4 0 0 1 12.8 0" />`,

  // FAQ — 원 안의 물음표
  faq: `<circle cx="12" cy="12" r="8.4" />
    <path d="M9.4 9.3a2.75 2.75 0 0 1 5.35.9c0 1.85-2.75 2.75-2.75 2.75" />
    <path d="M12 16.5h.01" />`,

  // 서식·양식 — 모서리를 접은 종이
  form: `<path d="M13.9 4.1H7.7A1.8 1.8 0 0 0 5.9 5.9v12.2a1.8 1.8 0 0 0 1.8 1.8h8.6a1.8 1.8 0 0 0 1.8-1.8V8.2z" />
    <path d="M13.9 4.1v4.1h4.2" />`,

  // 검색 — 돋보기
  search: `<circle cx="11" cy="11" r="6.3" />
    <path d="M15.6 15.6 20 20" />`,

  // 링크 복사 — 겹친 두 장
  copy: `<rect x="9" y="9" width="10.3" height="10.3" rx="2.3" />
    <path d="M15 9V6.6A1.8 1.8 0 0 0 13.2 4.8H6.6A1.8 1.8 0 0 0 4.8 6.6v6.6A1.8 1.8 0 0 0 6.6 15H9" />`,

  // 내려받기 — 아래로 향한 화살표
  download: `<path d="M12 4.6v10.2" />
    <path d="M7.8 10.6 12 14.8l4.2-4.2" />
    <path d="M5 19.4h14" />`,

  // 경조사 — 봉투
  envelope: `<rect x="3.9" y="5.8" width="16.2" height="12.4" rx="2" />
    <path d="M4.7 7.3 12 12.9l7.3-5.6" />`,

  // 연차·일정 — 달력
  calendar: `<rect x="4.2" y="6.2" width="15.6" height="13.6" rx="2" />
    <path d="M4.2 10.6h15.6" />
    <path d="M8.8 4.4v3.6" />
    <path d="M15.2 4.4v3.6" />`,

  // 교육 — 펼친 책
  book: `<path d="M12 7.1v12.4" />
    <path d="M12 7.1C10.4 5.5 8.3 5 5.3 5v11.9c3 0 5.1.5 6.7 2.1 1.6-1.6 3.7-2.1 6.7-2.1V5c-3 0-5.1.5-6.7 2.1z" />`,

  // 건강검진 — 원 안의 십자
  medical: `<circle cx="12" cy="12" r="8.4" />
    <path d="M12 8.3v7.4" />
    <path d="M8.3 12h7.4" />`,

  // 비밀번호 — 열쇠
  key: `<circle cx="8.8" cy="15.2" r="3.7" />
    <path d="M11.4 12.6 19.2 4.8" />
    <path d="M15.7 8.3l1.8 1.8" />`,

  // ── 아래는 문서 본문(마크다운)에서 쓰는 것들 ──

  // 결혼 — 겹친 반지 두 개
  rings: `<circle cx="9.6" cy="14" r="4.6" />
    <circle cx="15" cy="10" r="4.6" />`,

  // 사망(조사) — 촛불
  candle: `<path d="M12 4.6c1.6 1.7 2.4 2.9 2.4 4a2.4 2.4 0 0 1-4.8 0c0-1.1.8-2.3 2.4-4z" />
    <rect x="9.8" y="12" width="4.4" height="7.8" rx="1.3" />`,

  // 고희·산수·졸수·상수 — 나이테처럼 겹친 원
  age: `<circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />`,

  // 출산·돌잔치 — 별
  star: `<path d="M12 4.2 14.5 9.6 20.4 10.3 16 14.3 17.2 20.1 12 17.2 6.8 20.1 8 14.3 3.6 10.3 9.5 9.6z" />`,

  // 주의·재해 — 삼각형 안의 느낌표
  alert: `<path d="M12 4.8 21 19.6H3z" />
    <path d="M12 10.4v3.6" />
    <path d="M12 16.6h.01" />`,

  // 금액 — 원화 기호
  won: `<path d="M6 6.6 10.2 16.4 12 10.6 13.8 16.4 18 6.6" />
    <path d="M4.8 10.4h14.4" />
    <path d="M4.8 13.2h14.4" />`,

  // 감액 — 원 안의 뺄셈 기호
  minus: `<circle cx="12" cy="12" r="8.4" />
    <path d="M8.2 12h7.6" />`,

  // 알아두세요 — 원 안의 느낌표
  info: `<circle cx="12" cy="12" r="8.4" />
    <path d="M12 8.2v4.4" />
    <path d="M12 15.9h.01" />`,

  // 뒤로 가기 — 왼쪽 화살표
  arrowLeft: `<path d="M19 12H5.6" />
    <path d="M11.2 5.4 4.6 12l6.6 6.6" />`,
};

export const isIconName = (value: string): value is IconName =>
  Object.prototype.hasOwnProperty.call(ICON_PATHS, value);

/**
 * 아이콘 SVG 를 문자열로 만든다.
 *
 * 검색 결과처럼 브라우저에서 HTML 을 직접 조립하는 곳에서 쓴다.
 * .astro 파일 안에서는 Icon.astro 컴포넌트를 쓰는 편이 읽기 좋다.
 */
/**
 * 같은 아이콘을 CSS 배경(mask)용 주소로 만든다.
 *
 * 문서 본문(마크다운)에서는 SVG 를 그대로 쓰면 글이 읽을 수 없게 길어진다.
 * 그래서 본문에서는 `<i class="ico ico--rings"></i>` 처럼 짧게 쓰고,
 * 실제 모양은 이 함수가 만든 주소를 CSS 가 mask 로 씌워서 그린다.
 * mask 방식이라 색은 글자색을 그대로 따라간다.
 */
export function iconDataUri(name: IconName): string {
  const shapes = ICON_PATHS[name].replace(/"/g, "'").replace(/\s+/g, ' ').trim();
  const svg =
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black'" +
    ` stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'>${shapes}</svg>`;

  // '#' 은 주소에서 조각(fragment) 구분자라 반드시 바꿔야 한다.
  return `url("data:image/svg+xml,${svg.replace(/#/g, '%23')}")`;
}

/**
 * 본문 아이콘용 CSS 규칙 전체(`.ico--이름 { ... }`)를 만든다.
 * DocLayout 이 <style> 로 심는다. 아이콘을 icons.ts 에 추가하면 자동으로 따라온다.
 */
export function bodyIconCss(): string {
  return (Object.keys(ICON_PATHS) as IconName[])
    .map((name) => `.ico--${name}{--ico:${iconDataUri(name)}}`)
    .join('\n');
}

export function iconSvg(name: IconName, size = 22, className = 'icon'): string {
  const shapes = ICON_PATHS[name];
  if (!shapes) return '';

  return (
    `<svg class="${className}" width="${size}" height="${size}" viewBox="0 0 24 24"` +
    ' fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"' +
    ` stroke-linejoin="round" aria-hidden="true" focusable="false">${shapes}</svg>`
  );
}
