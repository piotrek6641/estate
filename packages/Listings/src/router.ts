import { request } from "http";

export class Router{
    databaseServiceUrl: string;
    constructor() {
        this.databaseServiceUrl = "http://localhost:13000";
    }
    async routeRequest(requestUrl: string): Promise<{statusCode: number, message: string}> {

        const urlArray = requestUrl.split("/").filter((part) => part !== "");
        switch (urlArray[1]) {
        case "get-all":
            return new Promise<{ statusCode: number, message: string }>((resolve, reject) => {
                request(this.databaseServiceUrl, (res) => {
                    const statusCode: number | undefined = res.statusCode;
                    const message: string | undefined = res.statusMessage;

                    if (statusCode === undefined || message === undefined) {
                        reject("Something went wrong (received empty response)");
                    } else {
                        resolve({ statusCode, message });
                    }
                });
            });

        default:
            return Promise.resolve({statusCode: 404, message: "Route Not Found"});
        }
    }
}
