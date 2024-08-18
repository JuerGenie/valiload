import * as v from "../src";

class Test {
  say = v
    .valiload()
    .overload([v.string()], (message: string) => {
      console.log(message, "from string");
    })
    .overload([v.number()], (number: number) => {
      console.log(number, "from number");
    });
}

const test = new Test();
test.say("hello");
test.say(123);
