import { Meta } from "@/class/Meta";
import { verbose } from "@/helpers/log";
import type { Condition } from "@/types/Condition";
import type { Constructor } from "@/types/Constructor";

export function Disabled(disabled: Condition) {
	function disabledDecorator(
		target: object,
		propertyKey: string | symbol,
		descriptor: PropertyDescriptor,
	): void;

	function disabledDecorator<T extends Constructor>(target: T): void;

	function disabledDecorator(
		target: object | Constructor,
		propertyKey?: string | symbol,
		descriptor?: PropertyDescriptor,
	) {
		if (propertyKey && descriptor) {
			verbose(
				() =>
					`disable-route: ${String(propertyKey)} with condition: ${disabled}`,
			);

			const route = Meta.get(target.constructor).getRoute(propertyKey);
			route.disabled = disabled;
		} else {
			verbose(() => {
				const name = target instanceof Function ? target.name : String(target);
				return `disable-controller: ${name} with condition: ${disabled}`;
			});

			const meta = Meta.get(target as Function);
			meta.disabled = disabled;
		}
	}

	return disabledDecorator;
}
