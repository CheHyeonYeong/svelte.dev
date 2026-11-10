---
title: 브라우저 지원
---

아래 표는 Svelte 내부 코드가 사용하는 브라우저 API를 바탕으로, Svelte가 동작할 것으로 예상되는 최소 브라우저 버전을 보여 줍니다.

<!-- generated in ../../../../../packages/svelte/scripts/generate-browser-support.ts. do not edit -->

| 브라우저 | 최소 버전 |
| - | - |
| Chrome/Edge | 87 |
| Firefox | 83 |
| Safari | 14 |
| Opera | 73 |
| Opera (Android) | 62 |
| Samsung Internet | 14.0 |
| Android WebView | 87 |
| Internet Explorer | 지원 안 함 |


> [!NOTE] 이는 2020년 <a href="https://web-platform-dx.github.io/baseline/">Baseline</a> 목표에 해당합니다.

이 표는 Svelte 자체만 다룹니다. [SvelteKit](/docs/kit), 다른 Svelte 라이브러리, 여러분의 코드는 포함하지 않습니다.

## 예외 <!-- Exceptions -->

일부 Svelte 기능은 더 높은 최소 브라우저 버전을 요구합니다. 다음 표는 이 기능들을 사용할 때만 고려하면 됩니다.

<!-- generated in ../../../../../packages/svelte/scripts/generate-browser-support.ts. do not edit -->

| 기능 | Chrome/Edge | Firefox | Safari |
| - | - | - | - |
| [`$state.snapshot`](/docs/svelte/$state#$state.snapshot) | 98 | 94 | 15.4 |
| [`bind:devicePixelContentBoxSize`](/docs/svelte/bind#Dimensions) | <span style="color: var(--sk-fg-4)">—</span> | 93 | 지원 안 함 |
| [`svelte/animate`의 `flip`](/docs/svelte/svelte-animate#flip) | <span style="color: var(--sk-fg-4)">—</span> | 126 | <span style="color: var(--sk-fg-4)">—</span> |

