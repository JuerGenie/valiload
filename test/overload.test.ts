import { overload } from "valiload";
import * as v from "valibot";
import { describe, it, expect, vi } from "vitest";

describe("overload", () => {
  it("should execute the function when the input matches the schema", () => {
    const fn = vi.fn();

    const overloadedFn: (a: string, b: number) => void = overload([v.string(), v.number()], fn);
    overloadedFn("hello", 123);

    expect(fn).toHaveBeenCalledWith("hello", 123);
  });

  it("should execute the function when the input matches the schema with rest", () => {
    const fn = vi.fn();

    const overloadedFn: (a: string, b: number, ...args: number[]) => void = overload(
      [v.string(), v.number()],
      v.number(),
      fn
    );
    overloadedFn("hello", 123, 2333, 2334);

    expect(fn).toHaveBeenCalledWith("hello", 123, 2333, 2334);
  });

  it("should throw an error when the input does not match the schema", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn);

    expect(() => overloadedFn("hello", "world")).toThrow("No overload matched for arguments: [string, string]");
  });

  it("should execute the first and second function when the input matches the first and second schema", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn1).overload([v.number(), v.string()], fn2);

    overloadedFn("hello", 123);
    overloadedFn(123, "hello");

    expect(fn1).toHaveBeenCalledWith("hello", 123);
    expect(fn2).toHaveBeenCalledWith(123, "hello");
  });
});
