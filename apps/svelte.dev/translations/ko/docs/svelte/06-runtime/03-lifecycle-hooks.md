---
title: 생명주기 훅
---

<!-- - onMount/onDestroy
- mention that `$effect` might be better for your use case
- beforeUpdate/afterUpdate with deprecation notice?
- or skip this entirely and only have it in the reference docs? -->

Svelte 5에서 컴포넌트 생명주기는 생성과 제거, 두 부분으로만 이루어집니다. 그 사이에 일어나는 일(특정 상태가 업데이트되는 것)은 컴포넌트 전체와는 관련이 없으며, 상태 변화에 반응해야 하는 부분만 알림을 받습니다. 내부적으로 가장 작은 변경 단위가 사실 컴포넌트가 아니라, 컴포넌트가 초기화될 때 설정하는 (렌더) 이펙트이기 때문입니다. 따라서 "업데이트 전"/"업데이트 후" 훅 같은 것은 없습니다.

## `onMount`

`onMount` 함수는 컴포넌트가 DOM에 마운트되자마자 실행될 콜백을 예약합니다. 이 함수는 컴포넌트 초기화 중에 호출해야 합니다(하지만 컴포넌트 *안에* 있을 필요는 없으며, 외부 모듈에서 호출해도 됩니다).

서버에서 렌더링되는 컴포넌트 안에서는 `onMount`가 실행되지 않습니다.

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('the component has mounted');
	});
</script>
```

`onMount`에서 함수를 반환하면, 그 함수는 컴포넌트가 언마운트될 때 호출됩니다.

```svelte
<script>
	import { onMount } from 'svelte';

	onMount(() => {
		const interval = setInterval(() => {
			console.log('beep');
		}, 1000);

		return () => clearInterval(interval);
	});
</script>
```

> [!NOTE] 이 동작은 `onMount`에 전달한 함수가 *동기* 함수일 때만 작동합니다. `async` 함수는 항상 `Promise`를 반환합니다.

## `onDestroy`

컴포넌트가 언마운트되기 직전에 실행될 콜백을 예약합니다.

`onMount`, `beforeUpdate`, `afterUpdate`, `onDestroy` 중에서 서버 사이드 컴포넌트 안에서 실행되는 것은 이것뿐입니다.

```svelte
<script>
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		console.log('the component is being destroyed');
	});
</script>
```

## `tick`

"업데이트 후" 훅은 없지만, `tick`을 사용하면 다음으로 진행하기 전에 UI가 업데이트되었음을 보장할 수 있습니다. `tick`은 대기 중인 상태 변경이 모두 적용되면 resolve되는 프로미스를 반환하며, 대기 중인 변경이 없으면 다음 마이크로태스크에서 resolve됩니다.

```svelte
<script>
	import { tick } from 'svelte';

	$effect.pre(() => {
		console.log('the component is about to update');
		tick().then(() => {
				console.log('the component just updated');
		});
	});
</script>
```

## 지원 중단: `beforeUpdate` / `afterUpdate` <!-- Deprecated: `beforeUpdate` / `afterUpdate` -->

Svelte 4에는 컴포넌트 전체가 업데이트되기 전과 후에 실행되는 훅이 있었습니다. 하위 호환성을 위해 Svelte 5에서도 이 훅들을 심(shim)으로 제공하지만, 룬을 사용하는 컴포넌트 안에서는 쓸 수 없습니다.

```svelte
<script>
	import { beforeUpdate, afterUpdate } from 'svelte';

	beforeUpdate(() => {
		console.log('the component is about to update');
	});

	afterUpdate(() => {
		console.log('the component just updated');
	});
</script>
```

`beforeUpdate` 대신 `$effect.pre`를, `afterUpdate` 대신 `$effect`를 사용하세요. 이 룬들은 더 세밀하게 제어할 수 있고 실제로 관심 있는 변경에만 반응합니다.

### 채팅 창 예시 <!-- Chat window example -->

새 메시지가 나타나면 맨 아래로 자동 스크롤하는(단, 사용자가 *이미* 맨 아래까지 스크롤한 경우에만) 채팅 창을 구현하려면, DOM을 업데이트하기 전에 DOM을 측정해야 합니다.

Svelte 4에서는 `beforeUpdate`로 이 작업을 하지만, 이는 결함이 있는 방식입니다. 관련이 있든 없든 *모든* 업데이트 전에 실행되기 때문입니다. 아래 예시에서는 누군가 다크 모드를 전환할 때 스크롤 위치를 건드리지 않도록 `updatingMessages` 같은 검사를 추가해야 합니다.

룬을 사용하면 `$effect.pre`를 쓸 수 있습니다. `$effect.pre`는 `$effect`와 똑같이 동작하지만 그 뒤에 예약된 DOM 업데이트보다 먼저 실행됩니다(정확한 순서는 [$effect.pre]($effect#$effect.pre)를 참고하세요). 이펙트 본문 안에서 `messages`를 명시적으로 참조하기만 하면, 이펙트는 `messages`가 바뀔 때마다 실행되고 `theme`이 바뀔 때는 실행되지 *않습니다*.

따라서 `beforeUpdate`와, 그만큼 골치 아픈 짝인 `afterUpdate`는 Svelte 5에서 지원 중단되었습니다.

- [이전](/playground/untitled#H4sIAAAAAAAAE31WXa_bNgz9K6yL1QmWOLlrC-w6H8MeBgwY9tY9NfdBtmlbiywZkpyPBfnvo2zLcZK28AWuRPGI5OGhkEuQc4EmiL9eAskqDOLg97oOZoE9125jDigs0t6oRqfOsjap5rXd7uTO8qpW2sIFEsyVxn_qjFmcAcstar-xPN3DFXKtKgi768IVgQku0ELj3Lgs_kZjWIEGNpAzYXDlHWyJFZI1zJjeh4O5uvl_DY8oUkVeVoFuJKYls-_CGYS25Aboj0EtWNqel0wWoBoLTGZgmdgDS9zW4Uz4NsrswPHoyutN4xInkylstnBxdmIhh8m7xzqmoNE2Wq46n1RJQzEbq4g-JQSl7e-HDx-GdaTy3KD9E3lRWvj5Zu9QX1QN20dj7zyHz8s-1S6lW7Cpz3RnXTcm04hIlfdFuO8p2mQ5-3a06cqjrn559bF_2NHOnRZ5I1PLlXQNyQT-hedMHeUEDyjtdMxsa4n2eIbNhlTwhyRthaOKOmYtniwF6pwt0wXa6MBEg0OibZec27gz_dk3UrZ6hB2LLYoiv521Yd8Gt-foTrfhiCDP0lC9VUUhcDLU49Xe_9943cNvEArHfAjxeBTovvXiNpFynfEDpIIZs9kFbg52QbeNHWZzebz32s7xHco3nJAJl1nshmhz8dYOQJDyZetnbb2gTWe-vEeWlrfpZMavr56ldb29eNt6UXvgwgFbp_WC0tl2RK25rGk6lYz3nUI2lzvBXGHhPZPGWmKUXFNBKqdaW259wl_aHbiqoVIZdpE60Nax6IOujT0LbFFxIVTCxCRR2XloUcYNvSbnGHKBp763jHoj59xiZWJI0Wm0P_m3MSS985xkasn-cFq20xTDy3J5KFcjgUTD69BHdcHIjz431z28IqlxGcPSfdFnrGDZn6gD6lyo45zyHAD-btczf-98nhQxHEvKfeUtOVkSejD3q-9X7JbzjGtsdUxlKdFU8qGsT78uaw848syWMXz85Waq2Gnem4mAn3prweq4q6Y3JEpnqMmnPoFRgmd3ySW0LLRqSKlwYHriCvJvUs2yjMaaoA-XzTXLeGMe45zmhv_XAno3Mj0xF7USuqNvnE9H343QHlq-eAgxpbTPNR9yzUkgLjwSR0NK4wKoxy-jDg-9vy8sUSToakzW-9fX13Em9Q8T6Z26uZhBN36XUYo5q7ggLXBZoub2Ofv7g6GCZfTxe034NCjiudXj7Omla0eTfo7QBPOcYxbE7qG-vl3_B1G-_i_JCAAA)
- [이후](/playground/untitled#H4sIAAAAAAAAE31WXa-jNhD9K7PsdknUQJLurtRLPqo-VKrU1327uQ8GBnBjbGSb5KZR_nvHgMlXtyIS9njO-MyZGZRzUHCBJkhez4FkNQZJ8HvTBLPAnhq3MQcUFmlvVKszZ1mbTPPGbndyZ3ndKG3hDJZne7hAoVUNYY8JV-RBPgIt2AprhA18MpZZnIQ50_twuvLHNRrDSjRXj9fwiCJTBLIKdCsxq5j9EM4gtBU3QD8GjWBZd14xWYJqLTCZg2ViDyx1W4cz4dv0hsiB49FRHkyfsCgws3GjcTKZwmYLZ2feWc9o1W8zJQ2Fb62i5JUQRNRHgs-fx3WsisKg_RN5WVn4-WrvUd9VA9tH4-AcwbfFQIpkLWByvWzqSe2sk3kyjUlOec_XPU-3TRaz_75tuvKoi19e3OvipSpamVmupJM2F_gXnnJ1lBM8oLQjHceys8R7PMFms4HwD2lRhzeEe-EsvluSrHe2TJdo4wMTLY48XKwPzm0KGm2r5ajFtRYU4TWOY7-ddWHfxhDP0QkQhnf5PWRnVVkKnIx8fZsOb5dR16nwG4TCCRdCMphWQ7z1_DoOcp3zA2SCGbPZBa5jd0G_TRxmc36Me-mG6A7l60XIlMs8ce2-OXtrDyBItdz6qVjPadObzx-RZdV1nJjx64tXad1sz962njceOHfAzmk9JzrbXqg1lw3NkZL7vgE257t-uMDcO6attSSokpmgFqVMO2U93e_dDlzOUKsc-3t6zNZp6K9cG3sS2KGSUqiUiUmq8tNYoJwbmvpTAoXA96GyjCojI26xNglk6DpwOPm7NdRYp4ia0JL94bTqRiGB5WJxqFY37RGPoz3c6i4jP3rcUA7wmhqNywQW7om_YQ2L4UQdUBdCHSPiOQJ8bFcxHzeK0jKBY0XcV95SkCWlD9t-9eOM3TLKucauiyktJdpaPqT19ddF4wFHntsqgS-_XE01e48GMwnw02AtWZP02QyGVOkcNfk072CU4PkduZSWpVYt9SkcmJ64hPwHpWF5ziVls3wIFmmW89Y83vMeGf5PBxjcyPSkXNy10J18t3x6-a6CDtBq6SGklNKeazFyLahB3PVIGo2UbhOgGi9vKjzW_j6xVFFD17difXx5ebll0vwvkcGpn4sZ9MN3vqFYsJoL6gUuK9TcPrO_PxgzWMRfflSEr2NHPJf6lj1957rRpH8CNMG84JgHidUtXt4u_wK21LXERAgAAA==)

<!-- prettier-ignore -->
```svelte
<script>
	import { ---beforeUpdate, afterUpdate,--- tick } from 'svelte';

	---let updatingMessages = false;---
	let theme = +++$state('dark')+++;
	let messages = +++$state([])+++;

	let viewport;

	---beforeUpdate(() => {---
	+++$effect.pre(() => {+++
		---if (!updatingMessages) return;---
		+++messages;+++
		const autoscroll = viewport && viewport.offsetHeight + viewport.scrollTop > viewport.scrollHeight - 50;

		if (autoscroll) {
			tick().then(() => {
				viewport.scrollTo(0, viewport.scrollHeight);
			});
		}

		---updatingMessages = false;---
	});

	function handleKeydown(event) {
		if (event.key === 'Enter') {
			const text = event.target.value;
			if (!text) return;

			---updatingMessages = true;---
			messages = [...messages, text];
			event.target.value = '';
		}
	}

	function toggle() {
		theme = theme === 'dark' ? 'light' : 'dark';
	}
</script>

<div class:dark={theme === 'dark'}>
	<div bind:this={viewport}>
		{#each messages as message}
			<p>{message}</p>
		{/each}
	</div>

	<input +++onkeydown+++={handleKeydown} />

	<button +++onclick+++={toggle}> Toggle dark mode </button>
</div>
```
