import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 모든 문서가 공유하는 frontmatter 스키마.
 *
 * title / summary / updated 는 필수다. 하나라도 빠지면 `npm run build` 가 실패한다.
 * 규정 안내 사이트에서 "언제 기준인지" 없는 문서는 아무도 믿지 않기 때문에,
 * 실수로 빠뜨리는 걸 빌드 단계에서 막는다.
 */
const docSchema = z.object({
  /** 문서 제목. 팀원이 실제로 검색할 법한 단어를 그대로 쓴다. */
  title: z.string(),

  /** 한 줄 요약. 검색 결과와 카카오톡 미리보기에 그대로 노출된다. */
  summary: z.string(),

  /** 검색에 걸리게 할 추가 키워드 (제목에 없는 동의어를 넣으면 좋다) */
  tags: z.array(z.string()).default([]),

  /** 최종 수정일. 문서 상단에 표시된다. */
  updated: z.coerce.date(),

  /** 근거 규정 출처 (예: 취업규칙 제32조). 복지·인사 문서는 되도록 채운다. */
  source: z.string().optional(),

  /** 목록 상단 고정 여부 (주로 공지사항용) */
  pinned: z.boolean().default(false),

  /** 목록 정렬 순서. 작을수록 위. 없으면 수정일 최신순. */
  order: z.number().optional(),

  /** 서식·양식 문서에서 다운로드할 파일 경로 (예: /forms/휴가원.hwp) */
  file: z.string().optional(),

  /** 검색 인덱스에서 제외하고 싶을 때 */
  noSearch: z.boolean().default(false),
});

export type DocSchema = z.infer<typeof docSchema>;

/** 카테고리 폴더 하나를 컬렉션으로 만드는 헬퍼 */
const docCollection = (dir: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.md', base: `./src/content/${dir}` }),
    schema: docSchema,
  });

export const collections = {
  notice: docCollection('notice'),
  guide: docCollection('guide'),
  welfare: docCollection('welfare'),
  faq: docCollection('faq'),
  form: docCollection('form'),
};
