export function createShortendUrl(url?: string) {
    if(!url) return;
    url = url.replace(/^\/[^/]+/, "");
    if (url === "") {
        url = "/";
    }
    return url;
}
