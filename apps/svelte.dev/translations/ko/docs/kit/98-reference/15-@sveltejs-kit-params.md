---
title: @sveltejs/kit/params
---



```js
// @noErrors
import { defineParams } from '@sveltejs/kit/params';
```

## defineParams

앱의 [매개변수 매처](/docs/kit/advanced-routing#Matching)를 정의합니다.

<div class="ts-block">

```dts
function defineParams<
	T extends Record<string, ParamDefinition>
>(definitions: T): DefinedParams<T>;
```

</div>



## DefinedParams

[`defineParams`](/docs/kit/@sveltejs-kit-params#defineParams)의 반환 타입입니다.

<div class="ts-block">

```dts
type DefinedParams<
	T extends Record<string, ParamDefinition>
> = {
	readonly [K in keyof T]: ParamEntry<T[K]>;
};
```

</div>

## MatcherParam

매처에서 매개변수 타입을 추출합니다.

<div class="ts-block">

```dts
type MatcherParam<M extends StandardSchemaV1<any, any>> =
	M extends StandardSchemaV1<any, infer Inner>
		? Inner extends ParamValue
			? Inner
			: Inner extends StandardSchemaV1<any, any>
				? StandardSchemaV1.InferOutput<Inner> extends ParamValue
					? StandardSchemaV1.InferOutput<Inner>
					: never
				: never
		: never;
```

</div>

## ParamDefinition

[`defineParams`](/docs/kit/@sveltejs-kit-params#defineParams)에 전달하는 매개변수 매처 정의입니다.

<div class="ts-block">

```dts
type ParamDefinition =
	| ((param: string) => ParamValue | undefined)
	| StandardSchemaV1<string, ParamValue>;
```

</div>

## ParamMatcher

매개변수 매처의 형태입니다. 자세한 내용은 [매칭](/docs/kit/advanced-routing#Matching)을 참고하세요.

<div class="ts-block">

```dts
type ParamMatcher<Output = any> = StandardSchemaV1<
	string,
	Output
>;
```

</div>

## ParamValue

URL 매개변수에서 파싱할 수 있고 `String(...)`으로 손실 없이 인코딩할 수 있는 값입니다.

<div class="ts-block">

```dts
type ParamValue = string | number | boolean | bigint;
```

</div>


