import * as v from "valiload";
import { describe, it, expect, vi } from "vitest";

describe("overload.valiload", () => {
  it("should execute the fallback function when no overload matches the arguments", () => {
    const fallbackFn = vi.fn();
    let overloadedFn = v
      .valiload(fallbackFn)
      .overload([v.string(), v.number()], vi.fn())
      .overload([v.number(), v.string()], vi.fn());
    overloadedFn(true, false);

    expect(fallbackFn).toHaveBeenCalled();
  });
});
