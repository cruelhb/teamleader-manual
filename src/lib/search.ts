import { hasChoseongJamo, koreanIncludes, koreanStartsWith, normalize } from './hangul';
import type { IconName } from './icons';

/** /search-index.json 에 담기는 문서 하나의 형태 */
export interface SearchDoc {
  url: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  categoryLabel: string;
  categoryIcon: IconName;
  updated: string;
  /** 마크다운 문법을 걷어낸 본문 (앞부분만 — 자세한 내용은 tags 로 보강한다) */
  body: string;
}

export interface SearchResult {
  doc: SearchDoc;
  score: number;
}

/** 필드별 가중치. 제목에서 걸린 결과가 항상 위로 오게 한다. */
const WEIGHT = {
  titleStarts: 120,
  titleIncludes: 90,
  tagStarts: 70,
  tagIncludes: 55,
  summaryIncludes: 40,
  bodyIncludes: 15,
} as const;

/**
 * 문서 하나의 점수를 계산한다. 0 이면 검색 결과에서 제외.
 *
 * query 는 미리 normalize 된 상태여야 한다.
 * choseongQuery 가 true 면 본문 검색을 건너뛴다 — 초성 두세 글자는 긴 본문이면
 * 어디에나 우연히 걸려서, 관계없는 문서가 결과에 딸려 오기 때문이다.
 * 초성 검색은 제목·태그·요약에서만 의미가 있다.
 */
function scoreDoc(doc: SearchDoc, query: string, choseongQuery: boolean): number {
  let score = 0;

  const title = normalize(doc.title);
  if (koreanStartsWith(title, query)) {
    score += WEIGHT.titleStarts;
  } else if (koreanIncludes(title, query)) {
    score += WEIGHT.titleIncludes;
  }

  for (const tag of doc.tags) {
    const normalizedTag = normalize(tag);
    if (koreanStartsWith(normalizedTag, query)) {
      score += WEIGHT.tagStarts;
      break;
    }
    if (koreanIncludes(normalizedTag, query)) {
      score += WEIGHT.tagIncludes;
      break;
    }
  }

  if (koreanIncludes(normalize(doc.summary), query)) {
    score += WEIGHT.summaryIncludes;
  }

  if (!choseongQuery && normalize(doc.body).includes(query)) {
    score += WEIGHT.bodyIncludes;
  }

  return score;
}

/**
 * 검색 실행. 점수 내림차순, 동점이면 최근 수정일 우선.
 */
export function searchDocs(docs: SearchDoc[], rawQuery: string, limit = 20): SearchResult[] {
  const query = normalize(rawQuery);
  if (!query) return [];

  const choseongQuery = hasChoseongJamo(query);
  const results: SearchResult[] = [];

  for (const doc of docs) {
    const score = scoreDoc(doc, query, choseongQuery);
    if (score > 0) results.push({ doc, score });
  }

  results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.doc.updated.localeCompare(a.doc.updated);
  });

  return results.slice(0, limit);
}
