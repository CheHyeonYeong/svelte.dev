# 한국어(ko) 번역

Svelte 공식 문서의 한국어 번역입니다.

- 이 폴더는 `apps/svelte.dev/content/`의 구조를 그대로 따릅니다.
  예: `content/docs/svelte/01-introduction/01-overview.md` → `translations/ko/docs/svelte/01-introduction/01-overview.md`
- 영어 원문(`content/`)은 수정하지 않습니다.
- `content/` 밖에 두어서 영어 문서 인덱스에는 섞이지 않습니다. 번역 파일은 `src/lib/server/i18n.ts`가 따로 읽어 `/ko/docs/...` 라우트에서 보여줍니다.
- 번역된 페이지는 `/ko/docs/...` 경로에서 볼 수 있습니다(예: `/ko/docs/svelte/overview`). 아직 번역되지 않은 페이지는 영어 원문을 보여주고 안내 문구를 띄웁니다.
- 섹션 제목(사이드바의 소제목)은 해당 폴더의 `index.md` frontmatter `title`로 번역합니다.
