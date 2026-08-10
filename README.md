# 서면심사본부 통합 조회 사이트

부서 전 인원 공통 규정·공지·업무 매뉴얼을 개인 폰에서 바로 확인하는 사이트입니다.

사무실 공용 PC로만 인트라넷에 접근할 수 있는 환경이라, **외부 인터넷에 올려서
단톡방에 링크 하나로 답할 수 있게** 만드는 것이 목적입니다.

| | 주소 |
| --- | --- |
| 🌐 사이트 | <https://teamleader-manual.pages.dev> |
| ✏️ 글 등록·수정 | <https://teamleader-manual.pages.dev/admin/> |
| 📦 저장소 | <https://github.com/cruelhb/teamleader-manual> |

`main` 브랜치에 푸시하면 Cloudflare Pages가 1~2분 내 자동 배포합니다.

> ⚠️ 관리자 화면에서 **`Sign In with GitHub` 버튼은 동작하지 않습니다** (Netlify 전용).
> 아래쪽 **`Sign In Using Access Token`** 을 쓰세요. 발급 방법은
> [CONTENT_GUIDE.md](CONTENT_GUIDE.md) 2장에 있습니다.

---

## 사이트 켜기 (내 PC에서 확인)

프로젝트 폴더에서 터미널을 열고:

```bash
npm run dev
```

그 다음 브라우저에서 아래 주소를 엽니다.

| 주소 | 용도 |
| --- | --- |
| <http://localhost:4321> | 사이트 보기 |
| <http://localhost:4321/admin/> | 글 등록·수정 화면 |

> ⚠️ `localhost` 는 **내 컴퓨터 안에서만** 열리는 주소입니다.
> 터미널을 닫거나 PC를 끄면 안 열리고, 폰이나 팀원 PC에서도 볼 수 없습니다.
> 다시 보려면 `npm run dev` 를 다시 실행하세요.
> 언제 어디서나 열리는 주소가 필요하면 아래 **배포하기**를 진행해야 합니다.

끝낼 때는 터미널에서 `Ctrl + C`.

---

## 글 쓰고 고치기

👉 **[CONTENT_GUIDE.md](CONTENT_GUIDE.md)** 에 자세히 정리되어 있습니다.

두 가지 방법이 있습니다.

1. **관리자 화면** — `/admin/` 접속 → `Work with Local Repository` → 프로젝트 폴더 선택
   (크롬·엣지에서만 됩니다)
2. **파일 직접 편집** — `src/content/` 폴더의 `.md` 파일

---

## 폴더 구조 요약

```
src/content/     ← 글이 들어있는 곳 (여기만 고치면 됩니다)
  notice/          공지사항
  guide/           업무 매뉴얼
  welfare/         기준 및 규정 (복지, 인사 등)

src/data/
  site.json        사이트 이름
  shortcuts.json   홈 화면 "자주 찾는 항목" 타일

src/lib/
  icons.ts         선 아이콘 모음

public/
  img/             본문에 넣는 스크린샷

public/admin/
  config.yml       관리자 화면 입력칸 설정
```

나머지 폴더(`src/pages`, `src/lib`, `src/layouts`, `src/components`, `src/styles`)는
사이트 동작에 관한 것이라 평소에는 건드릴 일이 없습니다.

---

## 현재 올라간 글

샘플(가짜 내용) 문서는 모두 삭제했습니다. 지금은 실제 내용만 있습니다.

| 메뉴 | 글 |
| --- | --- |
| 공지사항 | 이패스손사 얼리버드 강의 신청 안내 |
| 업무 매뉴얼 | OJT 프로세스 및 진행방법 / 팀별 잔여 회식비 조회 |
| 기준 및 규정 (복지, 인사 등) | 경조사 안내 (휴가 + 경조사비) |

## 아직 남은 일

### 팀원에게 공유하기

배포가 완료되어 사이트가 살아 있고, 가짜 내용도 정리되었습니다.
단톡방에 링크를 공유하셔도 됩니다.

---

## 참고

- 사이트 이름을 바꾸면 카톡 미리보기 이미지도 다시 만드세요.
  ```bash
  powershell -ExecutionPolicy Bypass -File scripts\make-og-image.ps1
  ```
- 배포 전 문제 확인: `npm run build` (에러 없이 끝나면 정상)
- 지금까지 작업은 전부 git에 저장되어 있습니다. `git log` 로 변경 이력을 볼 수 있습니다.
