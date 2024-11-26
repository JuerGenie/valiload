import type * as v from "valibot";
import type { Overload } from "./Overload";
import type { ErrorOverload } from "./Valiload";
import { TupleToIntersection } from "./utils";

type GetOverloaded<T extends Array<(...args: any[]) => any>, Fn extends (...args: any[]) => any> = T extends [
  ErrorOverload
]
  ? [Fn]
  : [Fn, ...T];

export interface OverloadOptions {
  /**
   * Whether the schema should be matched loosely. Defaults to `false`,
   * which means that the schema will be matched against the arguments
   * in the order they are provided, and if there are more arguments than
   * the schema, an error will be thrown.
   *
   * If `true`, the schema will be matched against the arguments in the
   * order they are provided, but if there are more arguments than the
   * schema, the extra arguments will be ignored.
   *
   * @default false
   */
  loose?: boolean;
}

export interface OverloadFn<T extends Array<(...args: any[]) => any>> {
  /**
   * Creates a new overloaded function with a new schema.
   *
   * @param schema the `valibot` schema to match the arguments against.
   * @param fn the function to execute when the arguments match the schema.
   * @returns the overloaded function.
   *
   * @example
   *
   * ```ts
   * const overloadedFn = overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }))
   *                     .overload([v.number(), v.string()], (a, b) => console.log("number and string", { a, b }));
   *
   * overloadedFn("hello", 123); // logs "string and number" { a: "hello", b: 123 }
   * overloadedFn(123, "hello"); // logs "number and string" { a: 123, b: "hello" }
   * ```
   */
  <
    const Items extends v.TupleItems,
    Schema extends v.TupleSchema<Items, undefined> = v.TupleSchema<Items, undefined>,
    const Fn extends (...args: v.InferOutput<Schema>) => any = (...args: v.InferOutput<Schema>) => any,
    Overloaded extends GetOverloaded<T, Fn> = GetOverloaded<T, Fn>
  >(
    schema: Items,
    fn: Fn,
    options?: OverloadOptions
  ): Overload<Overloaded> & TupleToIntersection<Overloaded>;
}

export interface OverloadRestFn<T extends Array<(...args: any[]) => any>> {
  /**
   * Creates a new overloaded function with a new schema and a rest argument.
   *
   * @param schema the `valibot` schema to match the arguments against.
   * @param rest the `valibot` schema to match the rest of the arguments against.
   * @param fn the function to execute when the arguments match the schema.
   * @returns the overloaded function.
   *
   * @example
   *
   * ```ts
   * const overloadedFn = overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }))
   *                     .overload([v.number(), v.string()], v.any(), (a, b, ...rest) => console.log("number and string", { a, b, rest }));
   *
   * overloadedFn("hello", 123); // logs "string and number" { a: "hello", b: 123 }
   * overloadedFn(123, "hello", 456, 789); // logs "number and string" { a: 123, b: "hello", rest: [456, 789] }
   * ```
   */
  <
    const Items extends v.TupleItems,
    const Rest extends v.TupleItems[0],
    Schema extends v.TupleWithRestSchema<Items, Rest, undefined> = v.TupleWithRestSchema<Items, Rest, undefined>,
    const Fn extends (...args: v.InferOutput<Schema>) => any = (...args: v.InferOutput<Schema>) => any,
    Overloaded extends GetOverloaded<T, Fn> = GetOverloaded<T, Fn>
  >(
    schema: Items,
    rest: Rest,
    fn: Fn,
    options?: OverloadOptions
  ): Overload<Overloaded> & TupleToIntersection<Overloaded>;
}

export interface FreezeFn<T extends Array<(...args: any[]) => any>> {
  /**
   * Creates a new function that is the same as the current one but is frozen.
   *
   * @returns the overloaded function.
   */
  (): TupleToIntersection<T>;
}

export interface CloneFn<T extends Array<(...args: any[]) => any>> {
  /**
   * Creates a new function that is the same as the current one.
   *
   * @returns the overloaded function
   */
  (): Overload<T> & TupleToIntersection<T>;
}
