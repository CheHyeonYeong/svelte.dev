# 한국어(ko) 번역

Svelte 공식 문서의 한국어 번역입니다.

- 이 폴더는 `apps/svelte.dev/content/`의 구조를 그대로 따릅니다.
  예: `content/docs/svelte/01-introduction/01-overview.md` → `translations/ko/docs/svelte/01-introduction/01-overview.md`
- 영어 원문(`content/`)은 수정하지 않습니다.
- `content/` 밖에 두어서 영어 문서 인덱스에는 섞이지 않습니다. 번역 파일은 `src/lib/server/i18n.ts`가 따로 읽어 `/ko/docs/...` 라우트에서 보여줍니다.
- 번역된 페이지는 `/ko/docs/...` 경로에서 볼 수 있습니다(예: `/ko/docs/svelte/overview`). 아직 번역되지 않은 페이지는 영어 원문을 보여주고 안내 문구를 띄웁니다.
- 섹션 제목(사이드바의 소제목)은 해당 폴더의 `index.md` frontmatter `title`로 번역합니다.
- 본문 제목(`##`, `###`)을 번역할 때는 뒤에 영어 원문 제목을 주석으로 붙입니다. 그래야 `#Editor-tooling` 같은 앵커 링크가 깨지지 않습니다.
  예: `## 에디터 도구 <!-- Editor tooling -->`
  빠뜨리면 dev 서버와 빌드가 어떤 파일의 어떤 id가 다른지 에러로 알려 줍니다.
- 줄 구조는 영어 원문과 맞춥니다(원문이 바뀌었을 때 diff로 비교하기 쉽도록). 그래서 `translations/*/docs`는 Prettier 대상에서 뺐습니다.
- 번역 규칙과 용어집은 [GUIDE.md](./GUIDE.md)에 있습니다. 번역한 뒤에는 `node scripts/check-translations.ts <파일>`로 원문과 구조가 맞는지 검사하세요(코드 블록, 제목 id, HTML, 링크, frontmatter).
