import { ErrorOverload } from "./Valiload";
import { Overload } from "./Overload";

export * from "valibot";

/**
 * Creates a function that can be overloaded with different schemas.
 */
export const overload = Overload.create().overload;
// export namespace overload {

import { fallback } from "./fallback";
/**
 * @deprecated use `"overload/fallback"` instead.
 */
export const valiload = fallback;
