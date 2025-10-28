/**
 * Utility for conditional className construction
 * @packageDocumentation
 */

export type ClassNameValue =
	| string
	| number
	| boolean
	| undefined
	| null
	| { [key: string]: unknown }
	| ClassNameValue[];

/**
 * Conditionally join classNames together
 * Similar to the popular 'clsx' library but simpler
 */
export function cn(...inputs: ClassNameValue[]): string {
	const classes: string[] = [];

	for (const input of inputs) {
		if (!input) continue;

		if (typeof input === "string" || typeof input === "number") {
			classes.push(String(input));
		} else if (Array.isArray(input)) {
			const result = cn(...input);
			if (result) classes.push(result);
		} else if (typeof input === "object") {
			for (const key in input) {
				if (input[key]) classes.push(key);
			}
		}
	}

	return classes.join(" ");
}
