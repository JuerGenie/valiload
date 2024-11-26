import type { CloneFn, FreezeFn, OverloadFn, OverloadRestFn } from "./Overload.types";
import type { TupleToIntersection } from "./utils";
import { Valiload, type ErrorOverload, type ValiloadCreateOptions } from "./Valiload";
import * as v from "valibot";

export class Overload<T extends Array<(...args: any[]) => any> = [ErrorOverload]> extends Valiload<ErrorOverload, T> {
  freeze: FreezeFn<T> = () => Valiload.create<ErrorOverload, T>({ cache: [...this.cache] });

  overload = Valiload.create<OverloadFn<T> & OverloadRestFn<T>>({
    cache: [
      // (schema, fn, options) => Overload
      {
        schema: v.tuple([v.array(v.unknown()), v.function(), v.optional(v.unknown())]),
        fn: (items, fn, options) => {
          return Overload.create({
            cache: [{ schema: options?.loose ? v.tuple(items) : v.strictTuple(items), fn }, ...this.cache],
            fallback: this.fallback,
          });
        },
      },
      // (schema, rest, fn, options) => Overload
      {
        schema: v.tuple([v.array(v.unknown()), v.unknown(), v.function(), v.optional(v.unknown())]),
        fn: (items, rest, fn, options) => {
          return Overload.create({
            cache: [{ schema: v.tupleWithRest(items, rest), fn }, ...this.cache],
            fallback: this.fallback,
          });
        },
      },
    ],
  });
  clone: CloneFn<T> = () => Overload.create<T>({ cache: [...this.cache] });

  static create<T extends Array<(...args: any[]) => any> = [ErrorOverload]>(options: ValiloadCreateOptions = {}) {
    return new Overload<T>(options) as Overload<T> & TupleToIntersection<T>;
  }
}
