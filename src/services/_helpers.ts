export type ServiceResult<T> = {
  data: T | null;
  error: { message: string; detail?: unknown } | null;
};

export async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text; // backend returned non-JSON
  }
}
