import * as v from "../src";

class Test {
  say = v
    .valiload()
    .overload([v.string()], (message) => {
      console.log(message, "from string");
      return { message };
    })
    .overload([v.number()], (number) => {
      console.log(number, "from number");
      return { number };
    });
}

const test = new Test();
test.say("hello");
test.say(123);
