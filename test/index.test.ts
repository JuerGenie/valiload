import { valiload } from "../src/index";
import * as v from "valibot";
import { describe, it, expect, vi } from "vitest";

describe("valiload", () => {
  it("should execute the function when the input matches the schema", () => {
    const fn = vi.fn();
    const overloadedFn = valiload().overload([v.string(), v.number()], fn);

    overloadedFn("hello", 123);

    expect(fn).toHaveBeenCalledWith("hello", 123);
  });

  it("should throw an error when the input does not match the schema", () => {
    const fn = vi.fn();
    const overloadedFn = valiload().overload([v.string(), v.number()], fn);

    expect(() => overloadedFn("hello", "world")).toThrow(
      "No overload matched for arguments: [string, string]"
    );
  });

  it("should execute the first and second function when the input matches the first and second schema", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const overloadedFn = valiload()
      .overload([v.string(), v.number()], fn1)
      .overload([v.number(), v.string()], fn2);

    overloadedFn("hello", 123);
    overloadedFn(123, "hello");

    expect(fn1).toHaveBeenCalledWith("hello", 123);
    expect(fn2).toHaveBeenCalledWith(123, "hello");
  });

  it("should return a frozen function that cannot be overloaded", () => {
    const fn = vi.fn();
    const overloadedFn = valiload().overload([v.string(), v.number()], fn);
    const frozenFn = overloadedFn.freeze();

    // @ts-expect-error
    expect(() => frozenFn.overload([v.number(), v.string()], fn)).toThrow(
      "frozenFn.overload is not a function"
    );
  });

  it("should return a frozen function that still executes the original function", () => {
    const fn = vi.fn();
    const overloadedFn = valiload().overload([v.string(), v.number()], fn);
    const frozenFn = overloadedFn.freeze();

    frozenFn("hello", 123);

    expect(fn).toHaveBeenCalledWith("hello", 123);
  });

  it("should return a frozen function that throws an error when the input does not match the schema", () => {
    const fn = vi.fn();
    const overloadedFn = valiload().overload([v.string(), v.number()], fn);
    const frozenFn = overloadedFn.freeze();

    expect(() => frozenFn("hello", "world")).toThrow(
      "No overload matched for arguments: [string, string]"
    );
  });

  it("should return a cloned function that can be independently overloaded", () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const overloadedFn = valiload().overload([v.string(), v.number()], fn1);
    const clonedFn = overloadedFn.clone();

    clonedFn("hello", 123);
    expect(fn1).toHaveBeenCalledWith("hello", 123);

    clonedFn.overload([v.number(), v.string()], fn2);
    clonedFn(123, "hello");
    expect(fn2).toHaveBeenCalledWith(123, "hello");
  });
});
