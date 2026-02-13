import "reflect-metadata";
import type { HttpMethod } from "@/types/HttpMethod";
import { Meta } from "@/class/Meta";
import { Route } from "@/class/Route";
import { verbose } from "@/helpers/log";

export function Method(method: HttpMethod) {
	return function (path?: string): MethodDecorator {
		return <T>(
			target: Object,
			propertyKey: string | symbol,
			_descriptor: TypedPropertyDescriptor<T>,
		): void => {
			verbose(
				() =>
					`register-route: ${String(propertyKey)} with method: ${method} at path: ${path ?? "/"}`,
			);
			const meta = Meta.getOrAttach(target.constructor);
			meta.addRoute(new Route(propertyKey, method, path ?? "/"));
		};
	};
}
