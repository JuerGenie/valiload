import * as v from "valibot";

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
export type Valiload<T extends (...args: any[]) => any = ErrorOverload> = T & {
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
  overload: <
    const Items extends v.TupleItems,
    Schema extends v.TupleSchema<Items, undefined> = v.TupleSchema<
      Items,
      undefined
    >,
    Fn extends (...args: v.InferOutput<Schema>) => any = (
      ...args: v.InferOutput<Schema>
    ) => any
  >(
    schema: Items,
    fn: Fn,
    options?: OverloadOptions
  ) => Valiload<T extends ErrorOverload ? Fn : T & Fn>;

  /**
   * Creates a new function that is the same as the current one but is frozen.
   *
   * @returns the overloaded function.
   */
  freeze: () => T;

  /**
   * Clones the current function.
   *
   * @returns the overloaded function
   */
  clone: () => Valiload<T>;
};

export type SchemaCacheEntry = [
  v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  (...args: any[]) => any
];
const create = (cache: SchemaCacheEntry[] = [], freeze: boolean = false) => {
  const loaded = [...cache];
  const result = ((...args: any[]) => {
    for (const [schema, fn] of loaded) {
      const result = v.safeParse(schema, args);
      if (result.success) {
        return fn(...(result.output as any[]));
      }
    }
    throw new Error(
      `No overload matched for arguments: [${args
        .map((a) => typeof a)
        .join(", ")}]`
    );
  }) as unknown as Valiload;
  if (!freeze) {
    result.overload = (schema, fn, options = {}) => {
      loaded.unshift([
        options.loose ? v.tuple(schema) : v.strictTuple(schema),
        fn,
      ]);
      return result as any;
    };
    result.freeze = () => create(loaded, true);
  }
  result.clone = () => create(loaded, freeze);
  return result;
};

/**
 * Creates a function that can be overloaded with different schemas.
 *
 * @returns a function that can be overloaded with different schemas.
 *
 * @example
 *
 * ```ts
 * const overloadedFn = valiload()
 *   .overload([v.string(), v.number()], (a, b) => console.log("string and number", { a, b }));
 *
 * overloadedFn("hello", 42); // logs "string and number" { a: "hello", b: 42 }
 * overloadedFn(42, "hello"); // throw "No overload matched for arguments: [number, string]"
 * ```
 */
export const valiload = () => create();

export * from "valibot";
