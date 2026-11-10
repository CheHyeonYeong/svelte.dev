---
title: updated
---

`updated` 상태는 페이지를 처음 연 뒤에 앱의 새 버전이 배포되었으면 `true`가 됩니다.

버전 폴링은 기본적으로 한 시간에 한 번 일어납니다. 또한 SvelteKit은 데이터 요청, 원격 함수 호출, 폼 액션에 대한 응답을 받은 뒤, 그리고 탭이 포커스를 얻거나 화면에 보이게 될 때도 새 버전이 있는지 확인합니다. 이 연습 문제에서는 데모용으로 `vite.config.js`에 더 짧은 `version.pollInterval`을 설정해 두었습니다.

```svelte
/// file: src/routes/+layout.svelte
<script>
	import { page, navigating, +++updated+++ } from '$app/state';
</script>
```

버전 확인은 개발 중에는 일어나지 않고 프로덕션에서만 일어납니다. 그래서 이 튜토리얼에서 `updated.current`는 항상 `false`입니다.

`pollInterval`과 상관없이 `updated.check()`를 호출해 새 버전을 직접 확인할 수도 있습니다.

```svelte
/// file: src/routes/+layout.svelte

+++{#if updated.current}+++
	<div class="toast">
		<p>
			A new version of the app is available

			<button onclick={() => location.reload()}>
				reload the page
			</button>
		</p>
	</div>
+++{/if}+++
```

> [!NOTE] SvelteKit 2.12 이전에는 이를 위해 `$app/stores`를 사용해야 했습니다. 이 모듈은 같은 정보를 담은 `$updated` 스토어를 제공합니다. SvelteKit 3에서는 `$app/state`로 대체되면서 제거되었습니다.

> [!NOTE] SvelteKit 2는 기본적으로 폴링하지 않았고, `updated.check()`를 호출하거나 내비게이션이 실패했을 때만 새 버전을 확인했습니다.
