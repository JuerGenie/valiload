import * as v from "../src";

const overloadedFn = v
  .valiload((..._: any) => "fallback")
  // #region duplicate overload
  // When the arguments are the same, the last overload will be used.
  .overload([v.number(), v.string()], (a, b) => {
    console.log("number and string", { a, b });
    return false as const;
  })
  .overload([v.number(), v.string()], (a, b) => {
    console.log("number and string", { a, b });
    return true;
  })
  // so this overload will be used
  .overload([v.number(), v.string()], (a, b) =>
    console.log("number and string", { a, b })
  )
  // #endregion
  .overload([v.string(), v.number()], (a, b) =>
    console.log("string and number", { a, b })
  );

const r1 = overloadedFn("hello", 123);
// logs "string and number" { a: "hello", b: 123 }
console.log(typeof r1);
// r1 is void 0 (undefined).

const r2 = overloadedFn(123, "hello");
// logs "number and string" { a: 123, b: "hello" }
console.log(typeof r2);
// r2 is void 0 (undefined), because the return type of the last overload is void.
// You can change the return type to what you want, and it will be returned.

const r3 = overloadedFn(true, "world");
// returns "fallback" as no overload matches
console.log(typeof r3);
// r3 is string ("fallback").
