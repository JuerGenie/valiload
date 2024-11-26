import { overload } from "valiload";
import * as v from "valibot";
import { describe, it, expect, vi } from "vitest";

describe("overload.freeze", () => {
  it("should return a frozen function that cannot be overloaded", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn);
    const frozenFn = overloadedFn.freeze();

    // @ts-expect-error
    expect(() => frozenFn.overload([v.number(), v.string()], fn)).toThrow("frozenFn.overload is not a function");
  });

  it("should return a frozen function that still executes the original function", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn);
    const frozenFn = overloadedFn.freeze();

    frozenFn("hello", 123);

    expect(fn).toHaveBeenCalledWith("hello", 123);
  });

  it("should return a frozen function that throws an error when the input does not match the schema", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn);
    const frozenFn = overloadedFn.freeze();

    expect(() => frozenFn("hello", "world")).toThrow("No overload matched for arguments: [string, string]");
  });
});
