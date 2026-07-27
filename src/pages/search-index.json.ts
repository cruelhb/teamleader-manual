import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { CATEGORIES, CATEGORY_ORDER } from '../lib/categories';
import { toIsoDate } from '../lib/format';
import type { SearchDoc } from '../lib/search';

/**
 * 클라이언트 검색용 인덱스를 빌드 시점에 하나의 JSON 으로 만든다.
 * 서버도 DB도 없이 검색이 되는 이유가 이 파일이다.
 */

/** 본문은 앞부분만 인덱싱한다. 폰에서 받는 파일 크기를 억제하기 위함. */
const BODY_LIMIT = 1000;

/** 마크다운 문법을 걷어내고 검색 대상이 되는 순수 텍스트만 남긴다. */
function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ') // 코드 블록
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 이미지
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 링크는 표시 텍스트만 남김
    .replace(/<[^>]+>/g, ' ') // 인라인 HTML
    .replace(/^[ \t]*[-*+>#]+[ \t]*/gm, ' ') // 목록·인용·제목 기호
    .replace(/[|`*_~]/g, ' ') // 남은 마크다운 기호
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = async () => {
  const docs: SearchDoc[] = [];

  for (const category of CATEGORY_ORDER) {
    const entries = await getCollection(category);

    for (const entry of entries) {
      if (entry.data.noSearch) continue;

      docs.push({
        url: `/${category}/${entry.id}/`,
        title: entry.data.title,
        summary: entry.data.summary,
        tags: entry.data.tags,
        category,
        categoryLabel: CATEGORIES[category].label,
        categoryEmoji: CATEGORIES[category].emoji,
        updated: toIsoDate(entry.data.updated),
        body: toPlainText(entry.body ?? '').slice(0, BODY_LIMIT),
      });
    }
  }

  return new Response(JSON.stringify(docs), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
