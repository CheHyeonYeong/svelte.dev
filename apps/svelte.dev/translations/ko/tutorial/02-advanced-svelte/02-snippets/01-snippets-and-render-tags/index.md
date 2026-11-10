---
title: 스니펫과 render 태그
---

스니펫을 사용하면 별도의 파일로 분리하지 않고도 컴포넌트 안에서 콘텐츠를 재사용할 수 있습니다.

이 연습 문제에서는 [세 마리의 지혜로운 원숭이](https://en.wikipedia.org/wiki/Three_wise_monkeys)를 유니코드 이스케이프 시퀀스, HTML 엔티티와 함께 보여 주는 표를 만들고 있습니다. 지금은 원숭이가 한 마리뿐입니다.

물론 마크업을 복제할 수도 있습니다. 아니면 `{ emoji, description }` 객체의 배열을 만들어 `{#each ...}` 블록에 넘길 수도 있습니다. 하지만 더 깔끔한 방법은 마크업을 재사용 가능한 블록으로 감싸는 것입니다.

먼저 *스니펫을 선언*하세요:

```svelte
/// file: App.svelte
+++{#snippet monkey()}+++
	<tr>
		<td>{emoji}</td>
		<td>{description}</td>
		<td>\u{emoji.charCodeAt(0).toString(16)}\u{emoji.charCodeAt(1).toString(16)}</td>
		<td>&amp#{emoji.codePointAt(0)}</td>
	</tr>
+++{/snippet}+++
```

이제 스니펫을 *렌더링*하기 전까지 원숭이가 보이지 않습니다. 렌더링해 봅시다:

```svelte
/// file: App.svelte
<tbody>
	{#snippet monkey()}...{/snippet}

	+++{@render monkey()}+++
</tbody>
```

나머지 원숭이에도 스니펫을 사용하려면 먼저 스니펫에 데이터를 넘겨야 합니다. 스니펫은 매개변수를 0개 이상 가질 수 있습니다:

```svelte
/// file: App.svelte
<tbody>
	+++{#snippet monkey(emoji, description)}...{/snippet}+++

	+++{@render monkey('🙈', 'see no evil')}+++
</tbody>
```

> [!NOTE] 원한다면 구조 분해한 매개변수를 사용할 수도 있습니다.

나머지 원숭이를 추가하세요:

- `'🙈', 'see no evil'`
- `'🙉', 'hear no evil'`
- `'🙊', 'speak no evil'`

마지막으로 더 이상 필요 없는 `<script>` 블록을 삭제하세요:

```svelte
/// file: App.svelte
---<script>
	let emoji = '🙈';
	let description = 'see no evil';
</script>---
```

> [!NOTE] 스니펫은 컴포넌트 안 어디에서든 선언할 수 있지만, 함수와 마찬가지로 같은 '스코프'나 하위 스코프에 있는 render 태그에서만 보입니다.
