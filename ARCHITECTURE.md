# AI Hub Architecture

## Initial stack
- Node.js and TypeScript for orchestration and tools.
- MCP for exposing tools to compatible clients.
- Git for version history.
- SQLite is a candidate for structured local memory.
- Ollama is a candidate for running a local language model.

These choices remain subject to verification and testing.

## Main components
1. Tool gateway: receives requests and validates inputs.
2. Permission layer: restricts access to approved paths and actions.
3. Tools: file search, project inspection, tests, and later integrations.
4. Model adapter: allows approved requests to use a local or online model.
5. Memory: stores tasks, decisions, and progress.
6. Review layer: presents findings, proposed actions, and results.

## Safety
- Read-only by default.
- Resolve and validate file paths against approved roots.
- Ask before modifying files, sending messages, or deleting data.
- Never expose credentials in prompts or logs.
- Record important operations and their outcomes.

## Data flow
Request -> validation -> permission check -> approved tool/model ->
result validation -> report to the user.

Models suggest and interpret; ordinary code enforces permissions.