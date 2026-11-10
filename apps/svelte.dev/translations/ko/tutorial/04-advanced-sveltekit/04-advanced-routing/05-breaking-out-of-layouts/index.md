---
title: 레이아웃에서 벗어나기
editing_constraints:
  { 'create': ['/src/routes/a/b/c/+page@b.svelte', '/src/routes/a/b/c/+page@a.svelte'] }
---

보통 페이지는 자신보다 위에 있는 모든 레이아웃을 상속합니다. 즉 `src/routes/a/b/c/+page.svelte`는 레이아웃 네 개를 상속합니다:

- `src/routes/+layout.svelte`
- `src/routes/a/+layout.svelte`
- `src/routes/a/b/+layout.svelte`
- `src/routes/a/b/c/+layout.svelte`

가끔은 현재 레이아웃 계층에서 벗어나는 것이 유용합니다. `@` 기호 뒤에 '재설정'할 부모 세그먼트의 이름을 붙이면 됩니다. 예를 들어 `+page@b.svelte`는 `/a/b/c`를 `src/routes/a/b/+layout.svelte` 안에 넣고, `+page@a.svelte`는 `src/routes/a/+layout.svelte` 안에 넣습니다.

이름을 `+page@.svelte`로 바꿔서 루트 레이아웃까지 완전히 재설정해 봅시다.

> [!NOTE] 루트 레이아웃은 앱의 모든 페이지에 적용되며, 여기서 벗어날 수는 없습니다.
