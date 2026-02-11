import { CONTROLLER, ROUTES } from "@/constants";
import type { Constructor } from "@/types/Constructor";
import type { RouteMeta } from "@/types/Meta";
import type { Middleware as IMiddleware } from "@/types/Middleware";

export function Middleware(...middlewares: Array<IMiddleware>) {
	// overloads
	function middlewareDecorator(
		target: object,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	): void;
	function middlewareDecorator<T extends Constructor>(target: T): void;

	function middlewareDecorator(
		target: object | Constructor,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) {
		if (propertyKey && descriptor) {
			const routes: Array<RouteMeta> = Reflect.getMetadata(
				ROUTES,
				target.constructor,
			);
			const route = routes.find((r) => r.name === propertyKey);
			if (route) {
				route.middleware.push(...middlewares);
			} else
				throw new Error(
					`Method ${String(propertyKey)} is not decorated with a HTTP method decorator`,
				);
		} else {
			const controllerMeta = Reflect.getMetadata(CONTROLLER, target);
			if (controllerMeta) {
				controllerMeta.middleware.push(...middlewares);
			} else
				throw new Error(`Class ${target} is not decorated with @Controller`);
		}
	}

	return middlewareDecorator;
}
