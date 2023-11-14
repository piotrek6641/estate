import { AbstractHttpRouter } from "@estates/utils";
import { DatabaseClient } from "@estates/database-client";
import { parse } from "url";
import { model } from "mongoose";
import { listingSchema } from "@estates/database-schemas";
import { IListing } from "@estates/types";

export class Router extends AbstractHttpRouter {
    private databaseClient?: DatabaseClient;

    constructor (databaseClient: DatabaseClient) {
        super();
        this.databaseClient = databaseClient;
    }
    defineApiRoutes() {
        this.get("/get-all", async (req, res) => {
            let dbResult;
            try {
                dbResult = await this.databaseClient?.getAll();
            } catch {
                res.writeHead(500)
                    .write(JSON.stringify({
                        "message": "Internal Server Error",
                    }));
                res.end();

                return;
            }
            try {
                dbResult = JSON.stringify(dbResult);
            } catch {
                console.log("unable to parse database result");
                res.writeHead(500);
                res.end();

                return;
            }
            res.writeHead(200)
                .end(dbResult);
        });

        this.get("/get", async (req, res) => {
            const query = parse(req.url as string).query?.split("=");
            if ( query && query[0] === "id" && query[1]) {
                let result;
                try {
                    const dbQuery = await this.databaseClient?.getListing(query[1]);
                    result = JSON.stringify(dbQuery);
                } catch(e) {
                    this.databaseClient?.logger.error(e as string);
                    res.writeHead(404)
                        .end("Not Found");
                    return;
                }
                res.appendHeader("Content-Type", "application/json");
                res.writeHead(200)
                    .end(result);

                return;
            }

            res.appendHeader("Content-Type", "application/json");
            res.writeHead(400)
                .write(JSON.stringify({
                    message: "Bad Request",
                    Error: "Wrong query parameter: id is required!",
                }));
            res.end();

        });
        this.post("/add-listing", async (req, res) => {
            let reqData = "";
            req.on("data", (chunk) => {
                reqData += chunk;
            });
            req.on("end", async () => {
                const parsedReqData: IListing= JSON.parse(reqData);
                const Listing = model<IListing>("Listing", listingSchema);
                const listing = new Listing(parsedReqData);
                const error = listing.validateSync();
                if (error) {
                    res.writeHead(400)
                        .write(JSON.stringify({
                            message: "Bad Request",
                            Error: "Unable to validate schema!",
                        }));
                    res.end();

                    return;
                }

                const dbData = await this.databaseClient?.addNewListing(parsedReqData);
                res.writeHead(200)
                    .end(dbData);
            });

        });
    }
}
