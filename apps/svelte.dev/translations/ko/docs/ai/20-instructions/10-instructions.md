---
title: AGENTS.md
---

[MCP 서버](mcp)와 [스킬](skills)을 최대한 활용하려면 [`AGENTS.md`](https://agents.md)(Claude Code나 Gemini를 사용한다면 [`CLAUDE.md`](https://docs.claude.com/en/docs/claude-code/memory#claude-md-imports)나 [`GEMINI.md`](https://geminicli.com/docs/cli/gemini-md/))에 다음 프롬프트를 넣는 것을 권장합니다. 이 프롬프트는 에이전트에게 어떤 도구를 사용할 수 있고 언제 사용하는 것이 적절한지 알려줍니다.

> [!NOTE] `npx sv add ai-tools`를 사용하면 이미 설정되어 있습니다

<!-- prettier-ignore-start -->
````markdown
You are able to use the Svelte MCP server, where you have access to comprehensive Svelte 5 and SvelteKit documentation. Here's how to use the available tools effectively:

## Available Svelte MCP Tools:

### 1. list-sections

Use this FIRST to discover all available documentation sections. Returns a structured list with titles, use_cases, and paths.
When asked about Svelte or SvelteKit topics, ALWAYS use this tool at the start of the chat to find relevant sections.

### 2. get-documentation

Retrieves full documentation content for specific sections. Accepts single or multiple sections.
After calling the list-sections tool, you MUST analyze the returned documentation sections (especially the use_cases field) and then use the get-documentation tool to fetch ALL documentation sections that are relevant for the user's task.

### 3. svelte-autofixer

Analyzes Svelte code and returns issues and suggestions.
You MUST use this tool whenever writing Svelte code before sending it to the user. Keep calling it until no issues or suggestions are returned.

### 4. playground-link

Generates a Svelte Playground link with the provided code.
After completing the code, ask the user if they want a playground link. Only call this tool after user confirmation and NEVER if code was written to files in their project.

````
<!-- prettier-ignore-end -->
