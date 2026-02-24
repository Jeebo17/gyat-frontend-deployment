import { API_BASE_URL } from "./apiClient";
import type {
    AuthResponse,
    LoginRequest,
    ManagerProfileResponse,
    RegisterRequest,
} from "../types/api";

type ErrorPayload = {
    message?: string;
    error?: string;
};

async function parseErrorMessage(response: Response): Promise<string> {
    const fallback = `Request failed (${response.status})`;
    const responseText = await response.text().catch(() => "");

    if (!responseText) {
        return fallback;
    }

    try {
        const parsed = JSON.parse(responseText) as ErrorPayload;
        if (typeof parsed.message === "string" && parsed.message.trim()) {
            return parsed.message;
        }
        if (typeof parsed.error === "string" && parsed.error.trim()) {
            return parsed.error;
        }
    } catch {
        // If it's not JSON, return raw response text.
    }

    return responseText;
}

async function authRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    if (!response.ok) {
        const message = await parseErrorMessage(response);
        throw new Error(message);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}

export function loginManager(data: LoginRequest): Promise<AuthResponse> {
    return authRequest<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function registerManager(data: RegisterRequest): Promise<AuthResponse> {
    return authRequest<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
    });
}

export function getManagerProfile(): Promise<ManagerProfileResponse> {
    return authRequest<ManagerProfileResponse>("/api/profile");
}

export async function logoutManager(): Promise<void> {
    const url = `${API_BASE_URL}/logout`;

    await fetch(url, {
        method: "POST",
        credentials: "include",
    }).catch(() => undefined);
}
