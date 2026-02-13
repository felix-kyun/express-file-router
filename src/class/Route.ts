import type { Condition } from "@/types/Condition";
import type { HttpMethod } from "@/types/HttpMethod";
import type { Middleware } from "@/types/Middleware";

export class Route {
	constructor(
		public name: string | symbol,
		public method: HttpMethod,
		public path: string = "/",
		public middlewares: Array<Middleware> = [],
		public disabled: Condition = false,
	) {}

	public isDisabled(): boolean {
		return typeof this.disabled === "function"
			? this.disabled()
			: this.disabled;
	}

	public addMiddlewares(...middlewares: Array<Middleware>): void {
		this.middlewares.push(...middlewares);
	}
}
