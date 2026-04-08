export interface PromptRequest {
  prompt: string;
  model: string;
  mode: string;
  conversationId?: string;
}

export interface ModelInfo {
  name: string;
}

export interface ModelInfo {
  name: string;
}

const API_BASE = "";
function buildUrl(path: string, query?: Record<string, string | number | boolean | undefined>) {
  const base = API_BASE || window.location.origin;
  const url = new URL(path, base);
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      "Content-Type": "application/json",
    },
    ...init,
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || response.statusText);
  }

  return response.json();
}

export async function fetchModels(): Promise<ModelInfo[]> {
  console.log('Fetching models from:', buildUrl("/api/ai/models"));
  return fetchJson<ModelInfo[]>("/api/ai/models");
}

export async function fetchAiResponse(prompt: string, model: string, mode: string = 'summary'): Promise<string> {
  const url = buildUrl("/api/ollama/chat");
  console.log('Calling AI endpoint:', url, { prompt, model, mode });
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      model,
      mode,
    }),
  });

  if (!response.ok) {
    // Read raw text first. Spring Boot default errors often omit the "message" field.
    const errorText = await response.text().catch(() => '');
    let parsed = { error: 'HTTP_ERROR', message: `HTTP ${response.status} ${response.statusText}` };
    try { parsed = { ...parsed, ...JSON.parse(errorText) }; } catch (e) {}
    if (!parsed.message) {
      parsed.message = `HTTP ${response.status} ${response.statusText} (Path: /api/ollama/chat)`;
    }
    console.error('API error response:', parsed);
    throw new Error(JSON.stringify(parsed));
  }

  const text = await response.text();
  console.log('AI Response:', text);
  return text;
}
