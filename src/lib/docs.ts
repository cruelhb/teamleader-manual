import { toIsoDate } from './format';

interface SortableDoc {
  data: {
    pinned: boolean;
    order?: number;
    updated: Date;
  };
}

/**
 * 목록 정렬 규칙
 *   1. pinned(중요) 문서가 항상 맨 위
 *   2. sort === 'order' 면 order 값 오름차순 (order 없는 문서는 뒤로)
 *   3. 그 다음은 최종 수정일 최신순
 */
export function sortDocs<T extends SortableDoc>(entries: T[], sort: 'date' | 'order'): T[] {
  return [...entries].sort((a, b) => {
    if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;

    if (sort === 'order') {
      const orderA = a.data.order ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.data.order ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
    }

    return toIsoDate(b.data.updated).localeCompare(toIsoDate(a.data.updated));
  });
}
