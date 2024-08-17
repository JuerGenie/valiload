import * as v from "valibot";

export interface Valiload {
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
    fn: Fn
  ) => this & Fn;
}

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
export const valiload = (): Valiload => {
  const loaded = [] as [
    v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
    (...args: any[]) => any
  ][];
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
  result.overload = (schema, fn) => {
    loaded.unshift([v.tuple(schema), fn]);
    return result as any;
  };
  return result;
};

export * from "valibot";
