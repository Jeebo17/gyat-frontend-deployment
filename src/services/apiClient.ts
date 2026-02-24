const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "" : "http://localhost:8080");

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorBody = await response.text().catch(() => "Unknown error");
        throw new Error(
        `API ${options.method ?? "GET"} ${endpoint} failed (${response.status}): ${errorBody}`
        );
    }

    // 204 No Content – nothing to parse
    if (response.status === 204) return undefined as T;

    return response.json() as Promise<T>;
}

export { API_BASE_URL, request };
