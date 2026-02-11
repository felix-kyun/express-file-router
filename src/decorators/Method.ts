import "reflect-metadata";
import { ROUTES } from "@/constants";
import type { RouteMeta } from "@/types/Meta";
import type { HttpMethod } from "@/types/HttpMethod";

export function Method(method: HttpMethod) {
	return function (path: string = "/"): MethodDecorator {
		return <T>(
			target: Object,
			propertyKey: string | symbol,
			_descriptor: TypedPropertyDescriptor<T>,
		): void => {
			const routes: RouteMeta[] =
				Reflect.getMetadata(ROUTES, target.constructor) || [];
			routes.push({ path, method, name: propertyKey, middleware: [] });
			Reflect.defineMetadata(ROUTES, routes, target.constructor);
		};
	};
}
