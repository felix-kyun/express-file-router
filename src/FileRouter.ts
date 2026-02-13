import "reflect-metadata";
import { Router } from "express";
import { resolve, relative, join, dirname } from "node:path";
import { glob } from "node:fs/promises";
import { log } from "@/helpers/log";
import { ensureDirectoryExists } from "@/helpers/ensureDirectoryExists";
import type { Constructor } from "@/types/Constructor";
import { normalizeRoute } from "@/helpers/normalizeRoute";
import { fileURLToPath } from "node:url";
import { Meta } from "./class/Meta";

/*
 * @param directory - relative to runtime directory
 * @param callerUrl - optional, used to resolve relative paths based on the caller's location (import.meta.url)
 */

export async function FileRouter(
	directory: string,
	callerUrl?: string,
): Promise<Router> {
	const router = Router();

	if (callerUrl) {
		const callerPath = resolve(dirname(fileURLToPath(callerUrl)));
		directory = join(callerPath, directory);
	}

	const path = resolve(directory);
	ensureDirectoryExists(path);

	log(() => `scan: ${relative(process.cwd(), path)}`);

	const files = glob(`${path}/**/*.{ts,js}`);
	for await (const file of files) {
		log(() => `load: ${relative(path, file)}`);
		const module = await import(file);
		const baseRoute = join("/", dirname(relative(path, file)));

		Object.values(module).forEach((e) => {
			if (typeof e !== "function") return;

			log(() => `inspect: ${e.name}`);
			const controller = Meta.get(e);

			if (controller.isDisabled()) {
				log(() => `skip: ${e.name}`);
				return;
			}

			const instance = new (e as Constructor)();

			// register
			controller.routes.forEach((route) => {
				log(() => `inspect: ${e.name}.${route.name.toString()}`);
				if (route.isDisabled()) {
					log(() => `skip: ${e.name}.${route.name.toString()}`);
					return;
				}
				const path = normalizeRoute(
					join(baseRoute, controller.path, route.path),
				);

				log(() => {
					const count =
						controller.middlewares.length + route.middlewares.length;
					return `register: ${route.method.toUpperCase()} ${path} (${count})`;
				});

				router[route.method](
					path,
					...controller.middlewares,
					...route.middlewares,
					instance[route.name].bind(instance),
				);
			});
		});
	}

	return router;
}
