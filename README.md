# valiload

A simple and lightweight library for overloading functions in TypeScript.

[中文版本](./README_zh.md)

## What is valiload?

`valiload` is a TypeScript library that allows you to create functions that can be overloaded with different argument schemas. It provides a convenient way to define multiple versions of a function that can handle different types and combinations of arguments.

## Usage

To use `valiload`, follow these steps:

1. Install `valiload` as a dependency in your project:

  ```bash
  npm install valiload valibot
  ```

2. Import `valiload` into your TypeScript file:

  ```typescript
  import * as v from 'valiload';
  ```

3. Define your overloaded function using the `valiload` syntax:

  ```typescript
  const MailSchema = z.object({
    to: z.pipe(
      v.string(),
      v.trim(),
      v.email()
    ),
    subject: z.string(),
    body: z.string(),
  });

  const overloadedFn = v.valiload()
    .overload([v.string(), v.number()], (a, b) => {
     // Function implementation for string and number arguments
    })
    .overload([v.number(), v.string()], (a, b) => {
     // Function implementation for number and string arguments
    })
    .overload([MailSchema], (mail) => {
     // Function implementation for MailSchema arguments
    });
  ```

4. Call the overloaded function with the appropriate arguments:

  ```typescript
  overloadedFn("hello", 123); // Calls the first overload
  overloadedFn(123, "hello"); // Calls the second overload
  overloadedFn({ to: "juergenie@mock.mail", subject: "Hello", body: "World" }); // Calls the third overload
  ```

  The function will execute the implementation that matches the types and order of the arguments.

5. Enjoy the flexibility of overloaded functions in TypeScript!

For more information on how to define schemas and handle different argument types, refer to the [valibot documentation](https://valibot.dev/).
