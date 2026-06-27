export async function apiFetch<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(input, {
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.error || message;
    } catch {
      // keep raw text
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export async function apiFetchText(
  input: string,
  init?: RequestInit,
): Promise<string> {
  const res = await fetch(input, {
    credentials: "include",
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    let message = text;
    try {
      const parsed = JSON.parse(text);
      message = parsed.error || message;
    } catch {
      // keep raw text
    }
    throw new Error(message || `Request failed: ${res.status}`);
  }

  return res.text();
}
