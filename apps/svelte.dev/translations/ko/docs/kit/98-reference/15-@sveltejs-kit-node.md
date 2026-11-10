---
title:  @sveltejs/kit/node
---



```js
// @noErrors
import {
	createReadableStream,
	getRequest,
	setResponse
} from '@sveltejs/kit/node';
```

## createReadableStream

<blockquote class="since note">

2.4.0부터 사용 가능

</blockquote>

디스크의 파일을 읽기 가능한 스트림(readable stream)으로 변환합니다

<div class="ts-block">

```dts
function createReadableStream(file: string): ReadableStream;
```

</div>



## getRequest

<div class="ts-block">

```dts
function getRequest({
	request,
	response,
	base,
	bodySizeLimit
}: {
	request: import('http').IncomingMessage;
	response?: import('http').ServerResponse;
	base: string;
	bodySizeLimit?: number;
}): Request;
```

</div>



## setResponse

<div class="ts-block">

```dts
function setResponse(
	res: import('http').ServerResponse,
	response: Response
): void;
```

</div>




