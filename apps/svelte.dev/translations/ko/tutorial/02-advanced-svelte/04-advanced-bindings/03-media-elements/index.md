---
title: 미디어 요소
---

`<audio>`와 `<video>` 요소의 속성에 바인딩할 수 있어서, (예를 들어) `AudioPlayer.svelte`처럼 커스텀 플레이어 UI를 쉽게 만들 수 있습니다.

먼저 `<audio>` 요소와 바인딩을 추가하세요(`src`, `duration`, `paused`는 축약형을 사용합니다):

```svelte
/// file: AudioPlayer.svelte
<div class={['player', { paused }]}>
+++	<audio
		{src}
		bind:currentTime={time}
		bind:duration
		bind:paused
	></audio>+++

	<button
		class="play"
		aria-label={paused ? 'play' : 'pause'}
	></button>
```

다음으로 `<button>`에 `paused`를 토글하는 이벤트 핸들러를 추가하세요:

```svelte
/// file: AudioPlayer.svelte
<button
	class="play"
	aria-label={paused ? 'play' : 'pause'}
	+++onclick={() => paused = !paused}+++
></button>
```

이제 오디오 플레이어에 기본 기능이 생겼습니다. 슬라이더를 드래그해서 트랙의 특정 위치로 이동하는 기능을 추가해 봅시다. 슬라이더의 `pointerdown` 핸들러 안에 `seek` 함수가 있는데, 여기서 `time`을 업데이트하면 됩니다:

```js
/// file: AudioPlayer.svelte
function seek(e) {
	const { left, width } = div.getBoundingClientRect();

	let p = (e.clientX - left) / width;
	if (p < 0) p = 0;
	if (p > 1) p = 1;

	+++time = p * duration;+++
}
```

트랙이 끝나면 친절하게 되감아 줍시다:

```svelte
/// file: AudioPlayer.svelte
<audio
	{src}
	bind:currentTime={time}
	bind:duration
	bind:paused
+++	onended={() => {
		time = 0;
	}}+++
></audio>
```

`<audio>`와 `<video>`의 바인딩 전체는 다음과 같습니다. *읽기 전용* 바인딩 일곱 개와...

- `duration` — 전체 길이(초)
- `buffered` — `{start, end}` 객체의 배열
- `seekable` — 위와 같음
- `played` — 위와 같음
- `seeking` — 불리언
- `ended` — 불리언
- `readyState` — 0 이상 4 이하의 숫자

...*양방향* 바인딩 다섯 개가 있습니다:

- `currentTime` — 재생 헤드의 현재 위치(초)
- `playbackRate` — 재생 속도를 높이거나 낮춥니다(`1`이 '보통')
- `paused` — 이름 그대로입니다
- `volume` — 0과 1 사이의 값
- `muted` — true면 음소거되는 불리언 값

비디오에는 읽기 전용 `videoWidth`와 `videoHeight` 바인딩이 추가로 있습니다.
