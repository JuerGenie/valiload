import { Overload } from "./src/Overload";
import * as v from "valibot";

var oi = Overload.create()
  .overload([v.string()], (a) => console.log(a))
  .overload([v.string()], v.number(), (a, ...b) => console.log({ a, b }));
oi("233");
oi("233", 233, 234);
