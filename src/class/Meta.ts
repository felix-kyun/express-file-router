import "reflect-metadata";
import type { Condition } from "@/types/Condition";
import type { Middleware } from "@/types/Middleware";
import type { Route } from "@/class/Route";

export class Meta {
	private static readonly symbol = Symbol("Meta");

	public path: string = "/";
	public middlewares: Array<Middleware> = [];
	public disabled: Condition = false;
	public routes: Array<Route> = [];

	private constructor(path?: string) {
		this.path = path ?? this.path;
	}

	public static has(target: Function): boolean {
		return Reflect.hasMetadata(Meta.symbol, target);
	}

	public static getOrAttach(target: Function, path?: string): Meta {
		let meta: Meta = Reflect.getMetadata(Meta.symbol, target);
		if (!meta) {
			meta = new Meta(path);
			Reflect.defineMetadata(Meta.symbol, meta, target);
		}

		return meta;
	}

	public static get(target: Function): Meta {
		let meta: Meta = Reflect.getMetadata(Meta.symbol, target);
		if (!meta) {
			throw new Error(
				`Class Metadata not found for ${target.name}. Did you forget to decorate the class with @Controller?`,
			);
		}

		return meta;
	}

	public static attach(target: Function, path?: string): void {
		const meta = new Meta(path);
		Reflect.defineMetadata(Meta.symbol, meta, target);
	}

	public isDisabled(): boolean {
		return typeof this.disabled === "function"
			? this.disabled()
			: this.disabled;
	}

	// Routes
	public getRoute(name: string | symbol): Route {
		const route = this.routes.find((route) => route.name === name);
		if (!route)
			throw new Error(
				`Method ${name.toString()} is not decorated with a HTTP method decorator`,
			);

		return route;
	}

	public addRoute(route: Route): void {
		this.routes.push(route);
	}

	public addMiddlewares(...middlewares: Array<Middleware>): void {
		this.middlewares.push(...middlewares);
	}
}
