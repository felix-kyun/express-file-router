import "reflect-metadata";
import type { Constructor } from "@/types/Constructor";
import { Meta } from "@/class/Meta";
import { verbose } from "@/helpers/log";

export function Controller(path?: string) {
	return (target: Constructor): void => {
		verbose(
			() => `register-controller: ${target.name} at path: ${path ?? "/"}`,
		);
		const meta = Meta.getOrAttach(target, path);
		meta.path = path ?? meta.path;
	};
}
