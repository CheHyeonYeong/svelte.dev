---
title: 코드 공유하기
---

지금까지 본 모든 예제에서 `<script>` 블록에는 각 컴포넌트 인스턴스가 초기화될 때 실행되는 코드가 들어 있었습니다. 대부분의 컴포넌트에는 이것만으로 충분합니다.

아주 가끔은 개별 컴포넌트 인스턴스 바깥에서 코드를 실행해야 할 때가 있습니다. 예를 들어 [이전 연습 문제](media-elements)의 커스텀 오디오 플레이어로 돌아가 보면, 네 개의 트랙을 동시에 재생할 수 있습니다. 하나를 재생하면 나머지가 모두 멈추는 편이 더 좋을 것입니다.

`<script module>` 블록을 선언하면 이렇게 할 수 있습니다. 그 안의 코드는 컴포넌트가 인스턴스화될 때가 아니라 모듈이 처음 평가될 때 한 번 실행됩니다. 이 코드를 `AudioPlayer.svelte`의 맨 위에 넣으세요(이것은 *별도의* script 태그라는 점에 유의하세요):

```svelte
/// file: AudioPlayer.svelte
+++<script module>
	let current;
</script>+++
```

이제 상태 관리 없이도 컴포넌트끼리 '대화'할 수 있습니다:

```svelte
/// file: AudioPlayer.svelte
<audio
	src={src}
	bind:currentTime={time}
	bind:duration
	bind:paused
+++	onplay={(e) => {
		const audio = e.currentTarget;

		if (audio !== current) {
			current?.pause();
			current = audio;
		}
	}}+++
	onended={() => {
		time = 0;
	}}
/>
```
