---
title: 스냅샷
---

사이드바의 스크롤 위치나 `<input>` 요소의 내용 같은 일시적인 DOM 상태는 한 페이지에서 다른 페이지로 이동할 때 사라집니다.

예를 들어 사용자가 폼을 채우다가 제출하기 전에 다른 페이지로 갔다가 돌아오거나 페이지를 새로고침하면, 입력한 값이 사라집니다. 이런 입력을 보존할 가치가 있는 경우에는 DOM 상태의 *스냅샷*을 찍어 두었다가, 사용자가 다시 돌아왔을 때 복원할 수 있습니다.

이렇게 하려면 컴포넌트 초기화 중에 `$app/navigation`의 `snapshot`을 호출하세요:

```svelte
<!--- file: +page.svelte --->
<script>
	import { snapshot } from '$app/navigation';

	let comment = $state('');

	snapshot({
		capture: () => comment,
		restore: (value) => (comment = value)
	});
</script>

<form method="POST">
	<label for="comment">Comment</label>
	<textarea id="comment" bind:value={comment} />
	<button>Post comment</button>
</form>
```

이 페이지에서 다른 곳으로 이동하면([얕은 라우팅](shallow-routing)으로 이동하는 경우 포함), 페이지가 업데이트되기 직전에 `capture` 함수가 호출되고, 반환된 값은 브라우저 기록 스택의 현재 항목과 연결됩니다. 다시 돌아오면 페이지가 업데이트되자마자 저장된 값으로 `restore` 함수가 호출됩니다.

스냅샷이 컴포넌트 재마운트와 페이지 새로고침 뒤에도 유지되려면 고유한 ID가 있어야 합니다. 기본적으로 이 ID는 `snapshot(...)`이 호출될 때의 스택 트레이스로 생성되지만, `id`를 직접 지정할 수도 있습니다. 예를 들어 소스 코드가 바뀌어 스택 트레이스가 달라지더라도 배포 간에 스냅샷을 안정적으로 유지하고 싶을 때, 또는 공유 래퍼 함수로 만든 스냅샷이나 같은 컴포넌트의 여러 인스턴스에서 만든 스냅샷을 구분하고 싶을 때 유용합니다:

```js
import { snapshot } from '$app/navigation';

let comment = '';

// ---cut---
snapshot({
	+++id: 'comment',+++
	capture: () => comment,
	restore: (value) => (comment = value)
});
```

선택적인 `reset` 콜백은 새 기록 항목이 생성될 때처럼 복원할 캡처 값이 없는 내비게이션에서 실행됩니다.

캡처된 값은 [devalue](https://github.com/sveltejs/devalue)로 직렬화됩니다. devalue는 JSON, `Date`나 `Map` 같은 객체, 그리고 [`transport`](hooks#transport) 훅에 지정한 사용자 정의 타입을 처리합니다. 직렬화된 데이터는 `sessionStorage`에 저장되므로, 페이지를 새로고침하거나 사용자가 다른 사이트에서 뒤로 돌아왔을 때도 상태를 복원할 수 있습니다.

> [!NOTE] `capture`에서 아주 큰 객체를 반환하지 마세요. 한 번 캡처된 객체는 세션이 유지되는 동안 메모리에 남아 있으며, 극단적인 경우 너무 커서 `sessionStorage`에 저장하지 못할 수도 있습니다.

## export const snapshot

> [!LEGACY]
> 예전에는 `+page.svelte`나 `+layout.svelte`에서 `capture`와 `restore` 메서드를 가진 `snapshot` 객체를 내보내 스냅샷을 만들었습니다. 이 방식은 지원 중단(deprecated)되었으며, 어떤 컴포넌트에서든 호출할 수 있는 `snapshot` 헬퍼를 대신 사용합니다.

```svelte
<!--- file: +page.svelte --->
<script>
	let comment = $state('');

	/** @type {import('./$types').Snapshot<string>} */
	export const snapshot = {
		capture: () => comment,
		restore: (value) => comment = value
	};
</script>
```

이 방식으로 캡처된 값은 JSON으로 직렬화되며, 얕은 내비게이션에서는 캡처되지 않습니다.
