---
title: drizzle
---

[Drizzle ORM](https://orm.drizzle.team/)은 관계형 쿼리 API와 SQL 형태의 쿼리 API를 모두 제공하는 TypeScript ORM으로, 처음부터 서버리스 환경을 고려해 설계되었습니다.

## 사용법 <!-- Usage -->

```sh
npx sv add drizzle
```

## 제공되는 것 <!-- What you get -->

- 데이터베이스 접근을 SvelteKit의 서버 파일 안에 두는 설정
- 자격 증명을 저장할 `.env` 파일
- Better Auth 애드온과의 호환성
- 로컬 데이터베이스 실행을 돕는 선택적 Docker 설정

## 옵션 <!-- Options -->

### database

사용할 데이터베이스 종류:

- `postgresql` — 가장 인기 있는 오픈 소스 데이터베이스
- `mysql` — 또 하나의 인기 있는 오픈 소스 데이터베이스
- `sqlite` — 데이터베이스 서버가 필요 없는 파일 기반 데이터베이스

```sh
npx sv add drizzle="database:postgresql"
```

### client

사용할 SQL 클라이언트로, `database`에 따라 달라집니다:

- `postgresql`: `postgres.js`, `neon`,
- `mysql`: `mysql2`, `planetscale`
- `sqlite`: `better-sqlite3`, `libsql`, `turso`

```sh
npx sv add drizzle="database:postgresql+client:postgres.js"
```

Drizzle은 십여 개가 훨씬 넘는 데이터베이스 드라이버와 호환됩니다. 여기서는 간단하게 가장 흔히 쓰이는 몇 가지만 제공하지만, 다른 드라이버를 쓰고 싶다면 일단 아무거나 임시로 고른 뒤 설정이 끝나고 [Drizzle의 호환 드라이버 전체 목록](https://orm.drizzle.team/docs/connect-overview#next-steps)에서 골라 바꾸면 됩니다.

### docker

Docker Compose 설정을 추가할지 여부입니다. [`database`](#Options-database)가 `postgresql` 또는 `mysql`일 때만 사용할 수 있습니다

```sh
npx sv add drizzle="database:postgresql+client:postgres.js+docker:yes"
```
