import { IncomingMessage, ServerResponse } from "http";
// eslint-disable-next-line no-unused-vars
export type HttpHandler = (req: IncomingMessage, res: ServerResponse) => void;
