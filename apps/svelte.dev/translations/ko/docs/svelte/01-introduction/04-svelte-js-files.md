---
title: .svelte.js 및 .svelte.ts 파일
---

Svelte는 `.svelte` 파일 외에 `.svelte.js`와 `.svelte.ts` 파일도 처리합니다.

이 파일들은 룬을 사용할 수 있다는 점만 빼면 다른 `.js`, `.ts` 모듈과 똑같이 동작합니다. 재사용 가능한 반응형 로직을 만들거나 앱 전체에서 반응형 상태를 공유할 때 유용합니다(단, [재할당되는 상태는 export할 수 없다는 점]($state#Passing-state-across-modules)에 유의하세요).

> [!LEGACY]
> Svelte 5 이전에는 없던 개념입니다
