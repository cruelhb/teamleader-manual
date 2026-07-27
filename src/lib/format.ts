/** 날짜 표시/정렬용 유틸 */

const pad = (value: number) => String(value).padStart(2, '0');

/** 화면에 보여줄 형식: 2026. 07. 27. */
export function formatDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}. ${pad(date.getMonth() + 1)}. ${pad(date.getDate())}.`;
}

/** 정렬·비교용 형식: 2026-07-27 */
export function toIsoDate(value: Date | string): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
