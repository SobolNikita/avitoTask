import { getApiUrl } from './config'

type HttpMethod = 'GET' | 'POST';

interface RequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, body } = options;

  const url = getApiUrl(endpoint);
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`Error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export function get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, { method: 'GET', headers });
}

export function post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>): Promise<T> {
  return request<T>(endpoint, { method: 'POST', body, headers });
}

export const api = {
  get,
  post,
};
