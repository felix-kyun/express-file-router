import type { Request, Response, NextFunction } from "express";

export type Middleware = <
	ReqParams extends Record<string, unknown> = {},
	ReqBody = unknown,
	ReqQuery extends Record<string, unknown> = {},
	ResBody = unknown,
	Locals extends Record<string, unknown> = {},
>(
	req: Request<ReqParams, ResBody, ReqBody, ReqQuery, Locals>,
	res: Response<ResBody, Locals>,
	next: NextFunction,
) => void | Promise<void>;
