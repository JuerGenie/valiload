import * as v from "valibot";

const getArgsTip = (args: any[]) => args.map((a) => typeof a).join(", ");
const createError = (args: any[]) =>
  new Error(`No overload matched for arguments: [${getArgsTip(args)}]`);

type TupleToIntersection<T extends any[]> = {
  [K in keyof T]: (x: T[K]) => void;
} extends {
  [K: number]: (x: infer I) => void;
}
  ? I
  : never;

export interface OverloadFn<T extends Array<(...args: any[]) => any>> {
  <
    const Items extends v.TupleItems,
    Schema extends v.TupleSchema<Items, undefined> = v.TupleSchema<
      Items,
      undefined
    >,
    const Fn extends (...args: v.InferOutput<Schema>) => any = (
      ...args: v.InferOutput<Schema>
    ) => any
  >(
    schema: Items,
    fn: Fn,
    options?: OverloadOptions
  ): Valiload<T extends [ErrorOverload] ? [Fn] : [Fn, ...T]>;
}

export interface FreezeFn<T extends Array<(...args: any[]) => any>> {
  (): TupleToIntersection<T>;
}

export interface CloneFn<T extends Array<(...args: any[]) => any>> {
  (): Valiload<T>;
}

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

type ErrorOverload =
  () => "Call valiload().overload() before calling this function.";
export type Valiload<
  T extends Array<(...args: any[]) => any> = [ErrorOverload]
> = TupleToIntersection<T> & {
  /**
   * Overloads the function with a new schema.
   *
   * @param schema the `valibot` schema to match the arguments against.
   * @param fn the function to execute when the arguments match the schema.
   * @returns the overloaded function.
   *
   * @example
   *
   * ```ts
   * const overloadedFn = valiload()
   *   .overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }))
   *   .overload([v.number(), v.string()], (a, b) => console.log("number and string", { a, b }));
   *
   * overloadedFn("hello", 123); // logs "string and number" { a: "hello", b: 123 }
   * overloadedFn(123, "hello"); // logs "number and string" { a: 123, b: "hello" }
   * ```
   */
  overload: OverloadFn<T>;

  /**
   * Creates a new function that is the same as the current one but is frozen.
   *
   * @returns the overloaded function.
   */
  freeze: FreezeFn<T>;

  /**
   * Clones the current function.
   *
   * @returns the overloaded function
   */
  clone: CloneFn<T>;
};

export type SchemaCacheEntry = [
  v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  (...args: any[]) => any
];

interface CreateOptions<Fallback extends (...args: any[]) => any> {
  cache?: SchemaCacheEntry[];
  freeze?: boolean;

  fallback?: Fallback;
}
const create = <Fallback extends (...args: any[]) => any>({
  cache = [],
  freeze = false,
  fallback,
}: CreateOptions<Fallback> = {}) => {
  const loaded = [...cache];
  const result = ((...args: any[]) => {
    for (const [schema, fn] of loaded) {
      const result = v.safeParse(schema, args);
      if (result.success) {
        return fn(...(result.output as any[]));
      }
    }
    if (fallback) {
      return fallback(...args);
    }
    throw createError(args);
  }) as unknown as Valiload<[Fallback]>;
  if (!freeze) {
    result.overload = (schema, fn, options = {}) => {
      loaded.unshift([
        options.loose ? v.tuple(schema) : v.strictTuple(schema),
        fn,
      ]);
      return result as any;
    };
    result.freeze = () => create({ cache: loaded, freeze: true });
  }
  result.clone = () => create({ cache: loaded, freeze });
  return result;
};

/**
 * Creates a function that can be overloaded with different schemas.
 *
 * @param fallback the function to execute when no overload matches the arguments. If not provided, an error will be thrown when no overload matches.
 *
 * @returns a function that can be overloaded with different schemas.
 *
 * @example
 *
 * - Without fallback:
 *   ```ts
 *   const overloadedFn = valiload()
 *     .overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }));
 *
 *   overloadedFn("hello", 42); // logs "string and number" { a: "hello", b: 42 }
 *   overloadedFn(42, "hello"); // throw "No overload matched for arguments: [number, string]"
 *   ```
 * - With fallback:
 *   ```ts
 *   const overloadedFn = valiload(() => "fallback")
 *     .overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }));
 *
 *   overloadedFn("hello", 42); // logs "string and number" { a: "hello", b: 42 }
 *   overloadedFn(42, "hello"); // return "fallback" as no overload matched
 *   ```
 */
export const valiload = <
  Fallback extends (...args: any[]) => any = ErrorOverload
>(
  fallback?: Fallback
) => create({ fallback });

export * from "valibot";
