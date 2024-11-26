import { Overload } from "./Overload";
import type { ErrorOverload } from "./Valiload";

/**
 * Creates a function that can be overloaded with different schemas, with a fallback function to execute when no overload matches the arguments.
 *
 * @param fallback the function to execute when no overload matches the arguments. If not provided, an error will be thrown when no overload matches.
 * @returns a function that can be overloaded with different schemas.
 *
 * @example
 *   ```ts
 *   const overloadedFn = fallback(() => "fallback")
 *     .overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }));
 *
 *   overloadedFn("hello", 42); // logs "string and number" { a: "hello", b: 42 }
 *   overloadedFn(42, "hello"); // return "fallback" as no overload matched
 *   ```
 */
export const fallback = <Fallback extends (...args: any[]) => any = ErrorOverload>(fallback?: Fallback) => {
  const result = Overload.create<[Fallback]>({ fallback });
  return result;
};
