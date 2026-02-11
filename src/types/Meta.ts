import type { HttpMethod } from "@/types/HttpMethod";
import type { Middleware } from "./Middleware";

export type ControllerMeta = {
	path: string;
	middleware: Array<Middleware>;
};

export type RouteMeta = {
	path: string;
	method: HttpMethod;
	name: string | symbol;
	middleware: Array<Middleware>;
};
