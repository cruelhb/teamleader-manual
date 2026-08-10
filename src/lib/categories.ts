/**
 * 사이트의 카테고리 정의.
 *
 * 여기 키(notice/guide/...)가 곧 URL 경로이자 src/content/ 하위 폴더 이름이다.
 * 카테고리를 추가하려면 (1) 여기에 항목을 넣고 (2) src/content.config.ts 의
 * collections 에 같은 키를 추가하고 (3) src/content/<키>/ 폴더를 만들면 된다.
 */

import type { IconName } from './icons';

export type CategoryKey = 'notice' | 'guide' | 'welfare';

export interface CategoryInfo {
  label: string;
  /** 메뉴에 표시할 선 아이콘. 이름 목록은 src/lib/icons.ts 참고 */
  icon: IconName;
  description: string;
  /** 목록 정렬 방식: 'date' = 수정일 최신순, 'order' = order 필드 오름차순 */
  sort: 'date' | 'order';
}

export const CATEGORIES: Record<CategoryKey, CategoryInfo> = {
  notice: {
    label: '공지사항',
    icon: 'notice',
    description: '전 인원 공통 공지입니다. 중요한 공지는 맨 위에 고정됩니다.',
    sort: 'date',
  },
  guide: {
    label: '업무 매뉴얼',
    icon: 'guide',
    description: '전산·시스템 사용법을 화면 캡처와 함께 단계별로 안내합니다.',
    sort: 'order',
  },
  welfare: {
    label: '기준 및 규정 (복지, 인사 등)',
    icon: 'welfare',
    description: '연차, 경조사, 교육비 등 전 인원에게 공통 적용되는 규정입니다.',
    sort: 'order',
  },
};

/** 네비게이션에 표시할 순서 */
export const CATEGORY_ORDER: CategoryKey[] = ['notice', 'guide', 'welfare'];

export const isCategoryKey = (value: string): value is CategoryKey =>
  Object.prototype.hasOwnProperty.call(CATEGORIES, value);
