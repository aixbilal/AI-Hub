# AI Hub Roadmap

## Stage 1: Foundation
- Review dependencies and current MCP implementation.
- Verify server startup and real tool communication.
- Confirm the initial status and project-list tools work.

Done when: a compatible client calls both tools and receives valid results.

## Stage 2: First offline AI
- Install or verify Ollama.
- Run a small quantized model locally.
- Test it on simple explanations and summaries without private data.
- Record speed, memory use, and answer quality.

Done when: a real task completes locally and its limitations are understood.

## Stage 3: Connect the model
- Add a model adapter to the Hub.
- Keep model output separate from permission enforcement.
- Test failures and invalid responses.

Done when: the Hub can request a local model response reliably.

## Stage 4: Safe tools and memory
- Add approved-folder file search.
- Add structured task and decision storage.
- Add action approval and audit records.

Done when: permissions and persistence pass explicit tests.

## Stage 5: More capabilities
- Developer workflows and GitHub.
- Personal planning.
- Selected communication integrations.
- E-commerce reports and business workflows.

Each integration requires its own permissions and tests.

## Online AI
Evaluate free online models later based on privacy, access limits,
quality, and integration support. Keep providers replaceable.