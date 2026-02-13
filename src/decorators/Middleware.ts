import { Meta } from "@/class/Meta";
import { verbose } from "@/helpers/log";
import type { Constructor } from "@/types/Constructor";
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
			verbose(() => `add-middlewares: ${propertyKey.toString()}`);

			const route = Meta.get(target.constructor).getRoute(propertyKey);
			route.addMiddlewares(...middlewares);
		} else {
			verbose(() => {
				const name = target instanceof Function ? target.name : String(target);
				return `add-middlewares: ${name}`;
			});

			const meta = Meta.get(target as Function);
			meta.addMiddlewares(...middlewares);
		}
	}

	return middlewareDecorator;
}
