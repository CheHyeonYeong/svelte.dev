---
title: $service-worker
---

`service-worker` 모듈은 SvelteKit 2에 있던 모듈로, 다음 export를 제공했습니다:

## base

애플리케이션의 기본 경로를 나타내는 루트 기준 상대 경로입니다. 대신 `$app/paths`의 [`resolve(...)`]($app-paths#resolve)를 사용하세요.

## build

Vite가 생성한 파일들의 `string[]` 배열입니다. 개발 중에는 비어 있습니다. 대신 `$app/manifest`의 [`immutable`]($app-manifest#immutable)을 사용하세요.

## files

`static` 디렉터리에 있는 파일들의 `string[]` 배열입니다. 대신 `$app/manifest`의 [`assets`]($app-manifest#assets)를 사용하세요.


## prerendered

프리렌더링된 페이지들의 `string[]` 배열입니다. 개발 중에는 비어 있습니다. 대신 `$app/manifest`의 [`prerendered`]($app-manifest#prerendered)를 사용하세요.

## version

캐시를 채우는 데 쓰이는 [`config.version.name`](@sveltejs-kit-vite#version)의 값입니다. 대신 `$app/env`의 [`version`]($app-env#version)을 사용하세요.
