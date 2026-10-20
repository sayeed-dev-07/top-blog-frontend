const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://top-blog-api-backend-nine.vercel.app";

export async function apiRequest(endpoint, options = {}) {
    const { method = "GET", data, headers: customHeaders } = options;

    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    const headers = new Headers({
        "Content-Type": "application/json",
        ...((token && { Authorization: `Bearer ${token}` }) || {}),
    });

    if (customHeaders) {
        new Headers(customHeaders).forEach((value, key) => {
            headers.set(key, value);
        });
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        ...(data !== undefined
            ? { body: JSON.stringify(data) }
            : {}),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
        if (response.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("token");
        }

        throw new Error(
            result?.message || `API Error: ${response.status}`
        );
    }

    return result;
}