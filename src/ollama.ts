export async function askOllama(prompt: string): Promise<string> {
  const response = await fetch("http://127.0.0.1:11434/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "qwen3:4b",
      prompt,
      stream: false
    }),
    signal: AbortSignal.timeout(120_000)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(
      `Ollama returned HTTP ${response.status}: ${details}`
    );
  }

  const data: unknown = await response.json();

  if (
    typeof data !== "object" ||
    data === null ||
    !("response" in data) ||
    typeof data.response !== "string"
  ) {
    throw new Error("Ollama returned an unexpected response.");
  }

  return data.response.trim();
}
