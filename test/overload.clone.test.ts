import { overload } from "valiload";
import * as v from "valibot";
import { describe, it, expect, vi } from "vitest";

describe("overload", () => {
  it("should return a cloned function that can be independently overloaded", () => {
    const fn1 = vi.fn() as (...args: any[]) => any;
    const fn2 = vi.fn() as (...args: any[]) => any;
    const originalFn = overload([v.string(), v.number()], fn1);
    let clonedFn = originalFn.clone();

    clonedFn("hello", 123);
    expect(fn1).toHaveBeenCalledWith("hello", 123);

    clonedFn = clonedFn.overload([v.number(), v.string()], fn2);
    clonedFn(123, "hello");
    expect(fn2).toHaveBeenCalledWith(123, "hello");
  });
});
