const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

// Task API
export const taskAPI = {
  getAll: () => fetchAPI<any[]>('/tasks'),
  getById: (id: string) => fetchAPI<any>(`/tasks/${id}`),
  create: (task: Partial<any>) => fetchAPI<any>('/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  update: (id: string, updates: Partial<any>) => fetchAPI<any>(`/tasks/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
  delete: (id: string) => fetchAPI<void>(`/tasks/${id}`, {
    method: 'DELETE',
  }),
};

// Agent API
export const agentAPI = {
  getAll: () => fetchAPI<any[]>('/agents'),
  getById: (id: string) => fetchAPI<any>(`/agents/${id}`),
  spawn: (config: Partial<any>) => fetchAPI<any>('/agents/spawn', {
    method: 'POST',
    body: JSON.stringify(config),
  }),
  update: (id: string, updates: Partial<any>) => fetchAPI<any>(`/agents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  }),
};

// Session API
export const sessionAPI = {
  getAll: () => fetchAPI<any[]>('/sessions'),
  getById: (id: string) => fetchAPI<any>(`/sessions/${id}`),
  attach: (sessionId: string, userId: string) => fetchAPI<any>(`/sessions/${sessionId}/attach`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  detach: (sessionId: string, userId: string) => fetchAPI<any>(`/sessions/${sessionId}/detach`, {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  setMode: (sessionId: string, mode: string) => fetchAPI<any>(`/sessions/${sessionId}/mode`, {
    method: 'PATCH',
    body: JSON.stringify({ mode }),
  }),
  sendCommand: (sessionId: string, command: string) => fetchAPI<any>(`/sessions/${sessionId}/command`, {
    method: 'POST',
    body: JSON.stringify({ command }),
  }),
};

// Review API
export const reviewAPI = {
  approve: (taskId: string, reviewId: string) => fetchAPI<any>(`/tasks/${taskId}/reviews/${reviewId}/approve`, {
    method: 'POST',
  }),
  requestChanges: (taskId: string, reviewId: string, comments: string[]) => fetchAPI<any>(`/tasks/${taskId}/reviews/${reviewId}/request-changes`, {
    method: 'POST',
    body: JSON.stringify({ comments }),
  }),
  block: (taskId: string, reviewId: string, reason: string) => fetchAPI<any>(`/tasks/${taskId}/reviews/${reviewId}/block`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  }),
};

