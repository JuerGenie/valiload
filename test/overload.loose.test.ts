import { overload } from "valiload";
import * as v from "valibot";
import { describe, it, expect, vi } from "vitest";

describe("overload", () => {
  it("should execute the function when the input matches the schema with options.loose set to true", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn, {
      loose: true,
    });

    overloadedFn("hello", 123, "extra");

    expect(fn).toHaveBeenCalledWith("hello", 123);
  });

  it("should ignore extra arguments when options.loose is set to true", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn, {
      loose: true,
    });

    overloadedFn("hello", 123, "extra");

    expect(fn).toHaveBeenCalledWith("hello", 123);
  });

  it("should throw an error when the input has fewer arguments than the schema and options.loose is set to false", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn, {
      loose: false,
    });

    expect(() => overloadedFn("hello")).toThrow("No overload matched for arguments: [string]");
  });

  it("should throw an error when the input has more arguments than the schema and options.loose is set to false", () => {
    const fn = vi.fn();
    const overloadedFn = overload([v.string(), v.number()], fn, {
      loose: false,
    });

    expect(() => overloadedFn("hello", 123, "extra")).toThrow(
      "No overload matched for arguments: [string, number, string]"
    );
  });
});
