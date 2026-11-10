---
title: better-auth
---

[Better Auth](https://www.better-auth.com/)는 프레임워크에 구애받지 않는 TypeScript용 인증 라이브러리입니다.

## 사용법 <!-- Usage -->

```sh
npx sv add better-auth
```

## 제공되는 것 <!-- What you get -->

- Drizzle을 데이터베이스 어댑터로 사용하는 SvelteKit용 완전한 인증 설정
- 기본으로 활성화된 이메일/비밀번호 인증
- 선택적으로 추가할 수 있는 데모 회원가입 및 로그인 페이지

## 옵션 <!-- Options -->

### demo

포함할 데모 페이지입니다. 사용할 수 있는 값: `password`(이메일 & 비밀번호), `github`(GitHub OAuth).

```sh
# Email & Password only (default)
npx sv add better-auth="demo:password"

# GitHub OAuth only
npx sv add better-auth="demo:github"

# Both Email & Password and GitHub OAuth
npx sv add better-auth="demo:password,github"
```
