---
title: class
tags: template-class
---

요소에 클래스를 설정하는 방법은 `class` 속성과 `class:` 지시어, 두 가지가 있습니다.

## 속성 <!-- Attributes -->

원시 값은 다른 속성과 똑같이 처리됩니다:

```svelte
<div class={large ? 'large' : 'small'}>...</div>
```

> [!NOTE]
> 역사적인 이유로 falsy 값(`false`, `NaN` 등)은 문자열로 변환되지만(`class="false"`), `class={undefined}`(또는 `null`)이면 속성 자체가 생략됩니다. 앞으로 나올 Svelte 버전에서는 모든 falsy 값이 `class`를 생략하게 됩니다.

### 객체와 배열 <!-- Objects and arrays -->

Svelte 5.16부터 `class`에 객체나 배열을 쓸 수 있으며, 이 값은 [clsx](https://github.com/lukeed/clsx)로 문자열로 변환됩니다.

값이 객체이면 값이 truthy인 키가 추가됩니다:

```svelte
<script>
	let { cool } = $props();
</script>

<!-- results in `class="cool"` if `cool` is truthy,
     `class="lame"` otherwise -->
<div class={{ cool, lame: !cool }}>...</div>
```

값이 배열이면 truthy 값들이 합쳐집니다:

```svelte
<!-- if `faded` and `large` are both truthy, results in
     `class="saturate-0 opacity-50 scale-200"` -->
<div class={[faded && 'saturate-0 opacity-50', large && 'scale-200']}>...</div>
```

배열 형태든 객체 형태든 하나의 조건으로 여러 클래스를 한꺼번에 설정할 수 있다는 점에 주목하세요. Tailwind 같은 도구를 쓸 때 특히 유용합니다.

배열 안에는 배열과 객체를 넣을 수 있으며, clsx가 이를 평탄화합니다. 예를 들어 로컬 클래스를 props와 합칠 때 유용합니다:

```svelte
<!--- file: Button.svelte --->
<script>
	let props = $props();
</script>

<button {...props} class={['cool-button', props.class]}>
	{@render props.children?.()}
</button>
```

이 컴포넌트를 사용하는 쪽에서도 객체, 배열, 문자열을 섞어 쓸 수 있는 같은 유연성을 누립니다:

```svelte
<!--- file: App.svelte --->
<script>
	import Button from './Button.svelte';
	let useTailwind = $state(false);
</script>

<Button
	onclick={() => useTailwind = true}
	class={{ 'bg-blue-700 sm:w-1/2': useTailwind }}
>
	Accept the inevitability of Tailwind
</Button>
```

Svelte 5.19부터는 요소의 `class` 속성이 받는 값의 타입인 `ClassValue` 타입도 제공합니다. 컴포넌트 props에서 타입 안전한 클래스 이름을 쓰고 싶을 때 유용합니다:

```svelte
<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	const props: { class: ClassValue } = $props();
</script>

<div class={['original', props.class]}>...</div>
```

## `class:` 지시어 <!-- The `class:` directive -->

Svelte 5.16 이전에는 `class:` 지시어가 요소에 조건부로 클래스를 설정하는 가장 편리한 방법이었습니다.

```svelte
<!-- These are equivalent -->
<div class={{ cool, lame: !cool }}>...</div>
<div class:cool={cool} class:lame={!cool}>...</div>
```

다른 지시어와 마찬가지로, 클래스 이름과 값의 이름이 같으면 축약형을 쓸 수 있습니다:

```svelte
<div class:cool class:lame={!cool}>...</div>
```

> [!NOTE] 오래된 버전의 Svelte를 쓰는 게 아니라면 `class:`는 피하는 것을 고려하세요. 속성 쪽이 더 강력하고 조합하기 쉽습니다.
