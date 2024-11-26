import type { TupleToIntersection } from "./utils";
import * as v from "valibot";
import { createError } from "./utils";
import { SchemaCacheEntry } from "./SchemaCacheEntry";

const defaultFallback: ErrorOverload = (...args: any[]) => {
  throw createError(args);
};

export type ErrorOverload = () => "Call valiload().overload() before calling this function.";

export interface ValiloadCreateOptions<Fallback extends (...args: any[]) => any = (...args: any[]) => any> {
  cache?: SchemaCacheEntry[];
  fallback?: Fallback;
}

export class Valiload<
  Fallback extends (...args: any[]) => any = ErrorOverload,
  T extends Array<(...args: any[]) => any> = [Fallback]
> extends Function {
  protected cache!: SchemaCacheEntry[];
  protected fallback!: (...args: any[]) => any;

  protected constructor({ cache = [], fallback = defaultFallback as Fallback }: ValiloadCreateOptions<Fallback> = {}) {
    super();

    const instance = (...args: any[]) => {
      for (const { schema, fn } of instance.cache) {
        const result = v.safeParse(schema, args);
        if (result.success) {
          return fn(...(result.output as any[]));
        }
      }

      instance.fallback(...args);
    };
    Object.setPrototypeOf(instance, new.target.prototype);
    instance.cache = cache;
    instance.fallback = fallback;

    return instance as unknown as Valiload<Fallback, T>;
  }

  /**
   * Internal method to create a new instance of Valiload with the given cache.
   *
   * It's just a helper method to avoid having to use `new Valiload<T>(options)` in the code, and given the instance the correct type.
   */
  protected static create<
    Fallback extends (...args: any[]) => any = ErrorOverload,
    T extends Array<(...args: any[]) => any> = [Fallback]
  >(options: ValiloadCreateOptions<Fallback> = {}) {
    return new Valiload<Fallback, T>(options) as TupleToIntersection<T>;
  }
}
