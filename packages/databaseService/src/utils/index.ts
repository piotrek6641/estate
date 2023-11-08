export function validateMethod(method?: string) {
    if (!method) return { code: 500 };
    if (method in HttpMethod) return { code: 200 };
    if (method === "OPTIONS") { return { code: 204 }; }

    return { code: 405, message: "Method not allowed" };
}

const HttpMethod = {
    "GET": "GET",
    "POST": "POST",
    "PUT": "PUT",
    "PATCH": "PATCH",
    "DELETE": "DELETE"
};

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];
