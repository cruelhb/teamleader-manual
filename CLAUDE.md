# 프로젝트 인수인계 문서

이 파일은 새 세션에서 작업을 이어받기 위한 문서다. 사용자 대상 문서는
[README.md](README.md)(실행 방법)와 [CONTENT_GUIDE.md](CONTENT_GUIDE.md)(글 작성법)에 따로 있다.

---

## 1. 무엇을 만들고 있는가

보험사별 서면심사팀으로 구성된 **서면심사본부**의 전 인원 공통 규정·공지·업무 매뉴얼을
**개인 폰에서 바로 확인**할 수 있게 하는 정적 사이트.

**해결하려는 문제**: 각 사무실은 보험사 전용 VPN 장비로 전산을 쓰기 때문에 개인 PC에서
회사 인트라넷에 접근할 수 없다. 인트라넷은 **사무실당 공용 PC 1대**에서만 열린다.
그래서 복지 규정 하나 확인하려고 줄을 서거나 팀장에게 카톡으로 물어봐야 했고,
팀장은 같은 질문에 반복해서 답하고 있었다.

**설계의 뿌리**: 실제 소통이 **카카오톡 단톡방**에서 이뤄진다. 그래서
"단톡방 질문에 링크 하나로 답한다"가 모든 설계 결정의 기준이다.
→ 외부 인터넷 호스팅, 모바일 우선, 항목별 딥링크, OG 미리보기, 검색 최우선.

## 2. 사용자에 대해

- **비개발자 팀장**이며 이 사이트를 **혼자** 작성·수정·배포한다.
- 대화는 **한국어**로 한다. 커밋 메시지도 한국어로 쓴다.
- 개발 용어를 최소화하고, 단계별로 안내한다.
- GitHub 계정 `cruelhb` 보유. Cloudflare 계정 보유.

## 3. 현재 상태 (배포 완료)

| | 주소 |
| --- | --- |
| 사이트 | <https://teamleader-manual.pages.dev> |
| 관리자 화면 | <https://teamleader-manual.pages.dev/admin/> |
| 저장소 (**공개**) | <https://github.com/cruelhb/teamleader-manual> |

`main` 에 푸시하면 Cloudflare Pages가 1~2분 내 자동 배포한다.
빌드 설정: Framework `Astro` / Build `npm run build` / Output `dist` / `NODE_VERSION=22`.

### 콘텐츠 현황

**샘플(가짜) 문서 6건은 전부 삭제했다.** 지금 있는 4건은 모두 실제 내용이다.

- `welfare/경조사-안내.md` — 경조휴가 + 경조사비 통합. 대분류 펼침 방식
- `guide/OJT-프로세스-및-진행방법.md` — 10단계 절차 도식(`.steps`) + 평가 배점·합불 기준
- `guide/팀별-잔여-회식비-조회.md` — 조회 사이트 링크 + 조직관리비 지급 기준
- `notice/이패스손사-얼리버드-강의-신청-안내.md` — 사용자가 CMS로 직접 작성

## 4. 기술 구성

- **Astro 5** 정적 사이트. 콘텐츠 컬렉션 3개 = 메뉴 3개
  (`notice` 공지사항 / `guide` 업무 매뉴얼 / `welfare` 복지·인사 규정)
- **검색**: 서버·DB 없이 빌드 시 `search-index.json` 생성 → 클라이언트에서 매칭.
  **한글 초성 검색 자체 구현** (`src/lib/hangul.ts`, `src/lib/search.ts`)
- **관리자 화면**: Sveltia CMS (`src/pages/admin/index.astro` + `public/admin/config.yml`)
- **호스팅**: Cloudflare Pages (무료, 월 500회 빌드, 트래픽 무제한)

### 건드릴 일 있는 파일

```
src/content/<카테고리>/*.md   글 (여기가 대부분의 작업)
src/data/site.json             사이트 이름, 제보 링크
src/data/shortcuts.json        홈 "자주 찾는 항목" 타일
src/lib/categories.ts          메뉴 이름·설명·정렬 방식
src/lib/icons.ts               선 아이콘 모음 (SVG 도형)
public/admin/config.yml        관리자 화면 입력칸
scripts/make-og-image.ps1      카톡 미리보기 이미지 생성 (사이트명 바꾸면 재실행)
```

## 5. 이미 정해진 것 — 다시 꺼내지 말 것

사용자가 명시적으로 결정했거나 내 제안을 되돌린 사항들이다.

0. **메뉴는 3개뿐이다** — 공지사항 / 업무 매뉴얼 / 복지·인사 규정.
   FAQ 와 서식·양식 메뉴는 사용자 요청으로 **삭제**했다(컬렉션·폴더·CMS 설정까지).
   되살리자고 먼저 제안하지 말 것. `file`(내려받기) 필드와 DocLayout 의 버튼은
   남겨뒀지만 CMS 입력칸은 없다.
1. **전사 공통 내용만 다룬다.** 팀(보험사)별로 다른 업무는 이 사이트에서 다루지 않는다.
   `teams` 필드·팀 필터 UI를 데이터 모델에서 **의도적으로 제거**했다.
2. **팀별 연락처·조직도는 넣지 않는다.** 기존 모바일 인트라넷에 이미 있어 중복이다.
3. **캡처 마스킹 규칙은 불필요하다.** 올라가는 건 사용법과 기본 규정뿐이라 고객
   개인정보가 포함될 여지가 없다는 것이 사용자 판단이다. 처음에 내가 넣었던
   마스킹 절차는 사용자 요청으로 삭제했다.
4. **완전 공개 + 검색엔진 색인 차단**(`robots.txt` + `noindex` 메타). 비밀번호 잠금 없음.
5. **상단 메뉴바 없음.** 홈이 유일한 허브다. 카테고리 페이지에는 `← 홈` 링크,
   문서 페이지에는 카테고리 breadcrumb이 있다.
6. **저장소는 공개(public).** 비공개를 권했으나 사용자가 공개를 선택했다.
7. **사이트 안에 제보 창구를 두지 않는다.** 제보는 사이트 밖(카톡 등)에서 받아
   사용자가 직접 수정한다. `site.json` 의 `reportUrl`·`reportLabel` 과
   문서 하단 제보 버튼, 검색 결과 없음 화면의 제보 안내를 모두 제거했다.
8. **이모지를 쓰지 않는다 — UI 도 문서 본문도.** 사용자가 "촌스럽다"고 해서
   메뉴·타일·버튼·헤더 로고·파비콘, 그리고 경조사 문서 본문의 이모지까지 전부
   `src/lib/icons.ts` 의 선 아이콘(SVG)으로 바꿨다. 아이콘은 `fill` 없이 `stroke` 만
   쓰고 색은 `currentColor` 를 따라간다. 새 아이콘이 필요하면 이모지를 넣지 말고
   `icons.ts` 에 도형을 추가할 것.

## 6. 주의사항 (실제로 문제가 됐던 것들)

### 콘텐츠

- **아이콘은 두 가지 방식으로 쓴다.** `.astro` 안에서는 `<Icon name="notice" />`
  (`src/components/Icon.astro`, 인라인 SVG). **마크다운 본문에서는**
  `<i class="ico ico--alert"></i>` — 본문에 SVG 를 그대로 넣으면 글을 못 읽게 되므로
  CSS `mask` 로 그린다. 모양 정의는 `DocLayout.astro` 가 `bodyIconCss()` 결과를
  `<style slot="head">` 로 심는다. 검색 인덱스는 인라인 HTML 을 걷어내므로
  `<i>` 태그가 검색에 섞이지 않는다.
- **좌우로 스크롤해야 보이는 표를 만들지 말 것.** 사용자가 명시적으로 지시한 상시
  규칙이다. 팀원은 폰으로 보기 때문에 잘린 칸이 있다는 것조차 모르고 지나친다.
  원인은 예전 `.prose table` 의 `white-space: nowrap` 이었고(데스크톱에서도 넘쳤다)
  지금은 칸 안에서 줄바꿈된다. 표를 카드로 바꾸는 기준은 `max-width: 700px` —
  경조사 문서의 5칸 표가 561~700px 구간에서 넘쳐서 560px 에서 올린 값이니 낮추지 말 것.
  칸이 3개를 넘거나 칸마다 한 문장씩 들어가면 표 대신 아래 구성 요소를 쓴다.
- **본문용 구성 요소 두 가지** (`global.css` 에 정의, 주석에 사용법이 있다)
  - `.steps` — 세로 절차 도식. 번호·연결선을 CSS 가 자동으로 그린다.
    단계 담당자는 `.step__who` 배지, 부가 설명은 `.step__note`.
  - `.compare` — 두 가지를 나란히 비교하는 카드. `is-good`(파랑)/`is-caution`(주황),
    카드 안 설명은 `.compare__note`.
  - **이 HTML 블록 안에는 빈 줄을 넣으면 안 된다.** 넣으면 마크다운이 블록을 끊어
    태그가 글자 그대로 나온다. (`<details>` 와 정반대이니 주의)
- **`<details>` 안의 마크다운은 빈 줄이 필수다.** `<summary>` 다음 줄과 `</details>`
  앞에 빈 줄이 없으면 표가 표로 렌더링되지 않고 글자 그대로 나온다.
- **CMS 본문 편집은 `raw` 모드가 기본**이며 그대로 둬야 한다. `rich_text`(위지윅)로
  바꾸면 `<details>` 구조가 깨진다. `config.yml` 에 `modes: [raw, rich_text]` 로
  raw를 앞에 둔 이유다.
- **검색 본문 색인 상한은 4000자**(`src/pages/search-index.json.ts`의 `BODY_LIMIT`).
  1000자였을 때 긴 문서 뒷부분이 검색에서 통째로 빠지는 문제가 있었다.
- **초성 매칭은 제목·태그·요약에만** 적용한다. 본문까지 초성 매칭하면 `ㅇㅊ` 두 글자가
  긴 본문 아무 데나 걸려서 관계없는 문서가 딸려 온다.
- **본문에 괄호가 끼면 검색이 끊긴다.** 예: "다(多)자녀"는 `다자녀`로 검색되지 않아
  태그로 보완했다. 이런 표기를 쓸 때는 태그를 같이 넣을 것.
- `tags` 를 넉넉히 넣는 것이 검색 품질을 좌우한다. 팀원은 규정집 용어가 아니라
  자기 말(상갓집, 부고, 청첩장)로 검색한다.

### 환경 (Windows)

- **PowerShell 도구에서 `node`/`npm` 이 PATH에 없다.** 명령 앞에 아래를 붙여야 한다.
  ```
  $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
  ```
- `.claude/launch.json` 은 같은 이유로 `node.exe` **절대경로**를 쓴다.
  (`C:\Program Files\nodejs\node.exe` + `node_modules/astro/astro.js dev`)
- **Astro 개발 서버는 `public/` 의 디렉터리 인덱스를 못 찾는다.** 그래서 관리자
  화면을 `public/admin/index.html` 이 아니라 `src/pages/admin/index.astro` 에 뒀다.
  (그래야 개발·배포 양쪽에서 `/admin/` 이 동작)
- 커밋은 그냥 `git commit` 을 쓰면 된다. 전역 설정이 GitHub **noreply 이메일**로
  되어 있고, 공개 저장소라 실제 이메일이 노출되면 안 된다. `-c user.email` 로
  덮어쓰지 말 것.

### 관리자 화면

- **`Sign In with GitHub` 은 OAuth 중계 서버를 거친다.** 기본값으로는 Sveltia CMS가
  Netlify 인증 서버를 호출해 `api.netlify.com ... Not Found` 가 떴다. 그래서
  Cloudflare Workers에 `sveltia-cms-auth` 를 배포하고 `config.yml` 의 `backend.base_url`
  에 `https://sveltia-cms-auth.onelight0913.workers.dev` 를 넣어 해결했다.
  워커 쪽에 `GITHUB_CLIENT_ID`·`GITHUB_CLIENT_SECRET`·`ALLOWED_DOMAINS` 환경변수가
  들어 있고, GitHub OAuth App의 callback 은 `<워커주소>/callback` 이다.
  **`base_url` 을 지우면 로그인이 다시 깨진다.**
- **CMS가 빈 항목을 `null` 로 저장한다.** `src/content.config.ts` 의 스키마가
  `nullish().transform()` 으로 이를 흡수하고 있으니 건드리지 말 것.

## 7. 검증 방법

브라우저 도구로 직접 확인한다. 사용자에게 "확인해 보세요"라고 떠넘기지 않는다.

```bash
npm run dev            # http://localhost:4321
npm run build          # 배포 전 확인. frontmatter 누락 시 실패해야 정상
```

`preview_start` 로 로컬(`localhost:4321`) 또는 배포 사이트를 열고,
`javascript_tool` 로 검색·표·펼침 목록·OG 태그를 점검해 왔다.
`computer{action:"screenshot"}` 은 브라우저 창이 표시돼 있지 않으면 실패하므로,
`read_page` 와 `javascript_tool` 위주로 검증하는 편이 낫다.

검색 회귀 테스트에 써온 검색어: `ㄱㅈㅅ`(경조사) `ㅎㅅㅂ`(회식비) `부고` `청첩장`
`재혼` `OJT` `마이페이지` `증빙`

## 8. 남은 일

1. **팀원에게 공유** — 샘플 문서가 정리되어 이제 공유 가능한 상태다.
2. 필요하면 문서 추가. 사용자가 내용을 주면 형식은 이쪽에서 잡는다.

## 9. 최근 작업 흐름 요약

초기 구축 → 경조사 규정 실제 내용 반영 → 경조사 문서 3건을 대분류 펼침 방식
단일 문서로 통합 → 관리자 화면(Sveltia CMS) 추가 → 사이트명·메뉴명 변경 및
상단 메뉴바 제거 → 경조사 표에서 가·나·다 구분 제거하고 직원지급분 있음/없음 표기 →
GitHub 공개 저장소 푸시 → Cloudflare Pages 배포 완료.

`git log` 에 한국어 커밋 메시지로 남아 있으니 필요하면 참고할 것.
