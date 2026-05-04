import { apiBaseUrl } from "@/config/env";
import type { ServiceResult } from "@/types/common";

export class ApiError extends Error {
  status: number;
  detail: unknown;

  constructor(message: string, status: number, detail?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export type ApiClientOptions = RequestInit & {
  json?: unknown;
  baseUrl?: string;
};

export async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildUrl(endpoint: string, baseUrl = apiBaseUrl) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${baseUrl.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }

  return fallback;
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { json, baseUrl, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);

  const requestInit: RequestInit = {
    credentials: "include",
    ...init,
    headers,
  };

  if (json !== undefined) {
    if (!headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }
    requestInit.body = JSON.stringify(json);
  }

  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }

  const response = await fetch(buildUrl(endpoint, baseUrl), requestInit);
  const payload = await parseJsonSafe(response);

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(payload, `Request failed (HTTP ${response.status})`),
      response.status,
      payload,
    );
  }

  return payload as T;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: ApiClientOptions,
): Promise<ServiceResult<T>> {
  try {
    return { data: await apiClient<T>(endpoint, options), error: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        data: null,
        error: {
          message: error.message,
          status: error.status,
          detail: error.detail,
        },
      };
    }

    return {
      data: null,
      error: {
        message:
          error instanceof Error ? error.message : "Something went wrong",
      },
    };
  }
}

export const api = {
  get: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "GET" }),
  post: <T>(endpoint: string, json?: unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "POST", json }),
  patch: <T>(endpoint: string, json?: unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PATCH", json }),
  put: <T>(endpoint: string, json?: unknown, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "PUT", json }),
  delete: <T>(endpoint: string, options?: ApiClientOptions) =>
    apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
