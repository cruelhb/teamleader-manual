// @ts-check
import { defineConfig } from 'astro/config';
import sectionIds from './scripts/rehype-section-ids.mjs';
import rehypeRaw from 'rehype-raw';

// site: 사이트 정식 주소(개인 도메인, 2026-10-30~). 예전 주소 teamleader-manual.pages.dev 도 계속 작동합니다.
//       카카오톡 미리보기(OG 태그)는 절대 URL이 필요해서 이 값을 씁니다.
export default defineConfig({
  site: 'https://guidebook.hb-913.com',
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeRaw, sectionIds],
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
