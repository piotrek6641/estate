export function validateMethod(method?: string) {
    if (!method) return { code: 500 };
    if (method in crudMethods) return { code: 200 };
    if (method === "OPTIONS") { return { code: 204 }; }

    return { code: 405, message: "Method not allowed" };
}

enum crudMethods {
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE"
}
