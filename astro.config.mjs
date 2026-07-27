// @ts-check
import { defineConfig } from 'astro/config';

// site: 배포 후 Cloudflare Pages가 준 실제 주소로 바꿔주세요.
//       카카오톡 미리보기(OG 태그)는 절대 URL이 필요해서 이 값을 씁니다.
export default defineConfig({
  site: 'https://teamleader-manual.pages.dev',
  build: {
    format: 'directory',
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
    },
  },
});
