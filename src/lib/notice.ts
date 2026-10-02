export type NoticeState = 'active' | 'closed' | 'archived';
export interface NoticeMeta { noticeStatus?: NoticeState; endsOn?: string; }

/** 종료일 당일은 유효하며 한국 시간 다음 날 0시부터 종료된다. */
export function noticeState(meta: NoticeMeta, now = new Date()): NoticeState {
  if (meta.noticeStatus === 'archived' || meta.noticeStatus === 'closed') return meta.noticeStatus;
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return meta.endsOn && today > meta.endsOn ? 'closed' : 'active';
}
export const noticeLabel = (state: NoticeState) => ({ active: '', closed: '종료', archived: '보관' })[state];
