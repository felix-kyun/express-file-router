import "reflect-metadata";
import { CONTROLLER } from "@/constants";
import type { Constructor } from "@/types/Constructor";
import type { ControllerMeta } from "@/types/Meta";

export function Controller(path: string = "/") {
	return (target: Constructor): void => {
		Reflect.defineMetadata(
			CONTROLLER,
			{ path, middleware: [] } satisfies ControllerMeta,
			target,
		);
	};
}
