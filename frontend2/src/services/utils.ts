export const createHeaders = (companyId: number, hasBody: boolean = false): HeadersInit => {
    const headers: Record<string, string> = {
        "x-company-id": companyId.toString(),
        "Accept": "application/json",
    };
    if (hasBody) {
        headers["Content-Type"] = "application/json";
    }
    return headers;
};

export const handleResponse = async (response: Response, fallbackErrorMsg: string) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.title || errorData?.error || fallbackErrorMsg;
        throw new Error(errorMessage);
    }

    if (response.status === 204) return true;

    const text = await response.text();
    return text ? JSON.parse(text) : true;
};
