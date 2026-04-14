export interface PromptRequest {
  prompt: string;
  model: string;
  mode?: string;
}

export interface ModelInfo {
  name: string;
}

export interface Conversation {
  id: number;
  prompt: string;
  response: string;
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

export async function getModels(): Promise<ModelInfo[]> {
  try {
    console.log('Fetching models from:', buildUrl("/api/ai/models"));
    return await fetchJson<ModelInfo[]>("/api/ai/models");
  } catch (error) {
    console.error('Failed to fetch models:', error);
    throw new Error(`Failed to fetch models: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
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
    const errorText = await response.text().catch(() => '');
    let parsed = { error: 'HTTP_ERROR', message: `HTTP ${response.status} ${response.statusText}` };
    try { 
      parsed = { ...parsed, ...JSON.parse(errorText) }; 
    } catch (e) {
      // Failed to parse error response
    }
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

export async function getConversations(): Promise<Conversation[]> {
  try {
    return await fetchJson<Conversation[]>("/api/conversations");
  } catch (error) {
    console.warn('Failed to fetch conversations:', error);
    return [];
  }
}

export async function deleteConversation(id: number): Promise<void> {
  const response = await fetch(buildUrl(`/api/conversations/${id}`), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(body || `Failed to delete conversation ${id}`);
  }
}

export async function postChat(prompt: string, model: string): Promise<string> {
  return fetchAiResponse(prompt, model);
}
