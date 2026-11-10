---
title: {@attach ...}
tags: attachments
---

어태치먼트는 요소가 DOM에 마운트될 때, 또는 함수 안에서 읽은 [상태]($state)가 갱신될 때 [이펙트]($effect) 안에서 실행되는 함수입니다.

선택적으로, 어태치먼트가 다시 실행되기 전이나 나중에 요소가 DOM에서 제거된 뒤에 호출될 함수를 반환할 수 있습니다.

> [!NOTE]
> 어태치먼트는 Svelte 5.29 이상에서 사용할 수 있습니다.

```svelte
<!--- file: App.svelte --->
<script>
	/** @type {import('svelte/attachments').Attachment} */
	function myAttachment(element) {
		console.log(element.nodeName); // 'DIV'

		return () => {
			console.log('cleaning up');
		};
	}
</script>

<div {@attach myAttachment}>...</div>
```

요소에는 어태치먼트를 몇 개든 둘 수 있습니다.

## 어태치먼트 팩토리 <!-- Attachment factories -->

이 예제의 `tooltip`처럼 함수가 어태치먼트를 *반환*하게 하는 것은 유용한 패턴입니다([데모](/playground/untitled#H4sIAAAAAAAAE3VT0XLaMBD8lavbDiaNCUlbHhTItG_5h5AH2T5ArdBppDOEMv73SkbGJGnH47F9t3un3TsfMyO3mInsh2SW1Sa7zlZKo8_E0zHjg42pGAjxBPxp7cTvUHOMldLjv-IVGUbDoUw295VTlh-WZslqa8kxsLL2ACtHWxh175NffnQfAAGikSGxYQGfPEvGfPSIWtOH0TiBVo2pWJEBJtKhQp4YYzjG9JIdcuMM5IZqHMPioY8vOSA997zQoevf4a7heO7cdp34olRiTGr07OhwH1IdoO2A7dLMbwahZq6MbRhKZWqxk7rBxTGVbuHmhCgb5qDgmIx_J6XtHHukHTrYYqx_YpzYng8aO4RYayql7hU-1ZJl0akqHBE_D9KLolwL-Dibzc7iSln9XjtqTF1UpMkJ2EmXR-BgQErsN4pxIJKr0RVO1qrxAqaTO4fbc9bKulZm3cfDY3aZDgvFGErWjmzhN7KmfX5rXyDeX8Pt1mU-hXjdBOrtuB97vK4GPUtmJ41XcRMEGDLD8do0nJ73zhUhSlyRw0t3vPqD8cjfLs-axiFgNBrkUd9Ulp50c-GLxlXAVlJX-ffpZyiSn7H0eLCUySZQcQdXlxj4El0Yv_FZvIKElqqGTruVLhzu7VRKCh22_5toOyxsWqLwwzK-cCbYNdg-hy-p9D7sbiZWUnts_wLUOF3CJgQAAA==)):

```svelte
<!--- file: App.svelte --->
<script>
	import tippy from 'tippy.js';

	let content = $state('Hello!');

	/**
	 * @param {string} content
	 * @returns {import('svelte/attachments').Attachment}
	 */
	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>

<input bind:value={content} />

<button {@attach tooltip(content)}>
	Hover me
</button>
```

`tooltip(content)` 표현식은 [이펙트]($effect) 안에서 실행되므로 `content`가 바뀔 때마다 어태치먼트가 파괴되고 다시 만들어집니다. 어태치먼트 함수가 처음 실행될 때 그 *안에서* 읽은 상태도 마찬가지입니다. (원하는 동작이 아니라면 [어태치먼트 재실행 시점 제어하기](#Controlling-when-attachments-re-run)를 참고하세요.)

## 인라인 어태치먼트 <!-- Inline attachments -->

어태치먼트는 인라인으로 만들 수도 있습니다([데모](/playground/untitled#H4sIAAAAAAAAE71Wf3OaWBT9KoyTTnW3MS-I3dYmnWXVtnRAazRJzbozRSQEApiRhwKO333vuY8m225m_9yZGOT9OPfcc84D943UTfxGr_G7K6Xr3TVeNW7D2M8avT_3DVk-YAoDNF4vNB8e2tnWjyXGlm7mPzfurVPpp5JgGmeZtwkf5PtFupCxLzVvHa832rl2lElX-s2Xm2DZFNqp_hs-rZetd4v07ORpT3qmQHu7MF2td0BZp8k6z_xkvfXP902_pZ2_1_aYWEiqm0kN8I4r79qbdZ6umnq3q_2iNf22F4dE6qt2oimwdpim_uY6XMm7Fuo-IQT_iTD_CeGTHwZ38ieIJUFQRxirR1Xf39Dw0X5z0I72Af4tD61vvPNwWKQnqmfPTbduhsEd2J3vO_oBd3dc6fF2X7umNdWGf0vBRhSS6qoV7cCXfTXWfKmvWG61_si_vfU92Wz-E4RhsLhNIYinsox9QKGVd8-tuACCeKXRX12P-T_eKf7fhTq0Hvt-f3ailtSeoxJHRo1-58NoPe1UiBc1hkL8Yeh45y_vQ3mcuNl9T8s3cXPRWLnS7YWJG_gn2Tb4tUjid8jua-PVl08j_ab8I14mH8Llx0s5Tz5Err4ql52r_GYg0mVy1bEGZuD0ze64b5TWYFiM-16wSuJ4JT5vfVpDcztrcG_YkRU4s6HxufzDWF4XuVeJ1P10IbzBemt3Vp1V2e04ZXfrJd7Wicyd039brRIv_RIVu_nXi7X1cfL2sy66ztToUp1TO7qJ7NlwZ0f30pld5qNSVE5o6PbMojFHjgZB7oSicPpGteyLclQap7SvY0dXtM_LR1NT2JFHey3aaxa0VxCeYJ7RMHemoiCcgPZV9pR7o7kgcOjeGliYk9hjDZx8FAq6enwlTPSZj_vYPw9Il64dXdIY8ZmapzwfEd8-1ZyaxWhqkIZOibXUd-6Upqi1pD4uMicCV1GA_7zi73UN8BaF4sC8peJtMjfmjbHZBFwq5ov50qRaE0l96NZggnW4KqypYRAW-uhSz9ADvklwJF2J-5W0Z5fQPBhDX92R6I_0IFxRgDftge4l4dP-gH1hjD7uqU6fsOEZ9UNrCdPB-nys6uXgY6O3ZMd9sy5T9PghqrWHdjo4jB51CgLiKJaDYYA-7WgYONf1FbjkI-mE3EAfUY_rijfuJ_CVPaR50oe9JF7Q0pI8Dw3osxxYHdYPGbp2CnwHF8KvwJv2wEv0Z3ilQI6U9uwbZxbYJXvEmjjQjjCHkvNLvNg3yhzXQd1olamsT4IRrZmX0MUDpwL7R8zzHj7pSh9hPHFSHjLezKqAST51uC5zmtQ87skDUaneLokT5RbXkPWSYz53Abgjc8_o4KFGUZ-Hgv2Z1l5OTYM9D-HfUD0L-EwxH5wRnIG61gS-khfgY1bq7IAP_DA4l5xRuh9xlm8yGjutc8t-wHtkhWv3hc7aqGwiK5KzgvM5xRkZYn193uEln-su55j1GaIv7oM4iPrsVHiG0Dx7TR9-1lBfqFdwfvSd5LNL5xyZVp5NoHFZ57FkfiF6vKs4k5zvIfrX5xX6MXmt0gM5MTu8DjnhukrHHzTRd3jm0dma0_f_x5cxP9f4jBdqHvmbq2fUjzqcKh2Cp-yWj9ntcHanXmBXxhu7Q--eyjhfNFpaV7zgz4nWEUb7zUOhpevjjf_gu_KZ99pxFlZ-T3sttkmYqrco_26q35v0Ewzv5EZPbnL_8BfduWGMnyyN3q0bZ_7hb_7KG_L4CQAA)):

```svelte
<!--- file: App.svelte --->
<canvas
	width={32}
	height={32}
	{@attach (canvas) => {
		const context = canvas.getContext('2d');

		$effect(() => {
			context.fillStyle = color;
			context.fillRect(0, 0, canvas.width, canvas.height);
		});
	}}
></canvas>
```

> [!NOTE]
> 중첩된 이펙트는 `color`가 바뀔 때마다 실행되지만, 바깥 이펙트(`canvas.getContext(...)`를 호출하는 곳)는 반응형 상태를 읽지 않으므로 한 번만 실행됩니다.

## 조건부 어태치먼트 <!-- Conditional attachments -->

`false`나 `undefined` 같은 falsy 값은 어태치먼트가 없는 것으로 취급되므로 조건부로 사용할 수 있습니다:

```svelte
<div {@attach enabled && myAttachment}>...</div>
```

## 컴포넌트에 어태치먼트 전달하기 <!-- Passing attachments to components -->

컴포넌트에 `{@attach ...}`를 사용하면 키가 [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)인 prop이 만들어집니다. 컴포넌트가 그 props를 요소에 [스프레드](/tutorial/svelte/spread-props)하면 요소가 해당 어태치먼트를 받습니다.

이를 이용해 요소를 확장하는 *래퍼 컴포넌트*를 만들 수 있습니다([데모](/playground/untitled#H4sIAAAAAAAAE3VUS3ObMBD-KxvajnFqsJM2PhA7TXrKob31FjITAbKtRkiMtDhJPfz3LiAMdpxhGJvdb1_fPnaeYjn3Iu-WIbJ04028lZDcetHDzsO3olbVApI74F1RhHbLJdayhFl-Sp5qhVwhufEWNjWiwJtYxSjyQhsEFEXxBiujcxg1_8O_dnQ9APwsEbVyiHDafjrvDZCgkiO4MLCEzxYZcn90z6XUZ6OxA61KlaIgV6i1pFC-sxjDrlbHaDiWRoGvdMbHsLzp5DES0mJnRxGaRBvcBHb7yFUTCQeunEWYcYtGv12TqgFUDbCK1WLaM6IWQhUlQiJUFm2ZLPly51xXMG0Rjoyd69C7UqqG2nu95QZyXvtvLVpri2-SN4hoLXXCZFfhQ8aQBU1VgdEaH_vSgyBZR_BpPp_vi0tY-rw2ulRZkGqpTQRbZvwa2BPgFC8bgbw31CbjJjAsE6WNYBZeGp7vtQXLMqHWnZx-5kM1TR5ycpkZXQR2wzL94l8Ur1C_3-g168SfQf1MyfRi3LW9fs77emJEw5QV9SREoLTq06tcczq7d6xEUcJX2vAhO1b843XK34e5unZEMBr15ekuKEusluWAF8lXhE2ZTP2r2RcIHJ-163FPKerCgYJLOB9i4GvNwviI5-gAQiFFBk3tBTOU3HFXEk0R8o86WvUD64aINhv5K3oRmpJXkw8uxMG6Hh6JY9X7OwGSqfUy9tDG3sHNoEi0d_d_fv9qndxRU0VClFqo3KVo3U655Hnt1PXB3Qra2Y2QGdEwgTAMCxopsoxOe6SD0gD8movDhT0LAnhqlE8gVCpLWnRoV7OJCkFAwEXitrYL1W7p7pbiE_P7XH6E_rihODm5s52XtiH9Ekaw0VgI9exadWL1uoEYjPtg2672k5szsxbKyWB2fdT0w5Y_0hcT8oXOlRetmLS8-g-6TLXXQgYAAA==)):

```svelte
<!--- file: Button.svelte --->
<script>
	/** @type {import('svelte/elements').HTMLButtonAttributes} */
	let { children, ...props } = $props();
</script>

<!-- `props` includes attachments -->
<button {...props}>
	{@render children?.()}
</button>
```

```svelte
<!--- file: App.svelte --->
<script>
	import tippy from 'tippy.js';
	import Button from './Button.svelte';

	let content = $state('Hello!');

	/**
	 * @param {string} content
	 * @returns {import('svelte/attachments').Attachment}
	 */
	function tooltip(content) {
		return (element) => {
			const tooltip = tippy(element, { content });
			return tooltip.destroy;
		};
	}
</script>

<input bind:value={content} />

<Button {@attach tooltip(content)}>
	Hover me
</Button>
```

## 어태치먼트 재실행 시점 제어하기 <!-- Controlling when attachments re-run -->

어태치먼트는 [액션](use)과 달리 완전히 반응형입니다. `{@attach foo(bar)}`는 `foo` *또는* `bar`가 바뀔 때(또는 `foo` 안에서 읽은 상태가 바뀔 때) 다시 실행됩니다:

```js
// @errors: 7006 2304 2552
function foo(bar) {
	return (node) => {
		veryExpensiveSetupWork(node);
		update(node, bar);
	};
}
```

이것이 문제가 되는 드문 경우(예를 들어 `foo`가 비용이 크고 피할 수 없는 설정 작업을 한다면)에는 데이터를 함수 안에 담아 전달하고 자식 이펙트에서 읽는 방법을 고려하세요:

```js
// @errors: 7006 2304 2552
function foo(+++getBar+++) {
	return (node) => {
		veryExpensiveSetupWork(node);

+++		$effect(() => {
			update(node, getBar());
		});+++
	}
}
```

## 프로그래밍 방식으로 어태치먼트 만들기 <!-- Creating attachments programmatically -->

컴포넌트나 요소에 스프레드할 객체에 어태치먼트를 추가하려면 [`createAttachmentKey`](svelte-attachments#createAttachmentKey)를 사용하세요.

## 액션을 어태치먼트로 변환하기 <!-- Converting actions to attachments -->

액션만 제공하는 라이브러리를 사용하고 있다면 [`fromAction`](svelte-attachments#fromAction)으로 어태치먼트로 변환할 수 있습니다. 그러면 (예를 들어) 컴포넌트에서도 사용할 수 있습니다.
