---
title: {@debug ...}
---

`{@debug ...}` 태그는 `console.log(...)`의 대안입니다. 지정한 변수의 값이 바뀔 때마다 로그로 출력하고, 개발자 도구가 열려 있으면 코드 실행을 일시 중지합니다.

```svelte
<script>
	let user = {
		firstname: 'Ada',
		lastname: 'Lovelace'
	};
</script>

{@debug user}

<h1>Hello {user.firstname}!</h1>
```

`{@debug ...}`는 쉼표로 구분한 변수 이름 목록을 받습니다(임의의 표현식은 받지 않습니다).

```svelte
<!-- Compiles -->
{@debug user}
{@debug user1, user2, user3}

<!-- WON'T compile -->
{@debug user.firstname}
{@debug myArray[0]}
{@debug !isReady}
{@debug typeof user === 'object'}
```

인자 없는 `{@debug}` 태그는 지정한 변수가 아니라 *어떤* 상태든 바뀔 때 실행되는 `debugger` 문을 삽입합니다.

