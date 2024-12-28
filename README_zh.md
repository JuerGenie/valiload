# valiload

> 请参阅 [`@chrock-studio/overload`](https://github.com/chrock-studio/toolbox/tree/main/packages/overload) 的新版本。

一个简单且轻量级的用于在 TypeScript 中进行函数重载的库。

[English Version](./README.md)

## 什么是 valiload？

`valiload` 是一个 TypeScript 库，允许您创建可以根据不同的参数模式进行重载的函数。它提供了一种方便的方式来定义多个版本的函数，以处理不同类型和组合的参数。

> `valiload` 的含义是 "validate/valibot" + "overload"。

## 使用方法

要使用 `valiload`，请按照以下步骤进行操作：

1. 在您的项目中将 `valiload` 安装为依赖项：

  ```bash
  npm install valiload valibot
  ```

2. 在您的 TypeScript 文件中导入 `valiload`：

  ```typescript
  import * as v from 'valiload';
  ```

3. 使用 `valiload` 语法定义您的重载函数：

  ```typescript
  const MailSchema = v.object({
    to: v.pipe(
      v.string(),
      v.trim(),
      v.email()
    ),
    subject: v.string(),
    body: v.string(),
  });

  const overloadedFn = v.valiload()
    .overload([v.string(), v.number()], (a, b) => {
     // 字符串和数字参数的函数实现
    })
    .overload([v.number(), v.string()], (a, b) => {
     // 数字和字符串参数的函数实现
    })
    .overload([MailSchema], (mail) => {
     // MailSchema 参数的函数实现
    });

  const overloadedWithFallback = v
    .valiload(() => {
      // 备用函数实现
    })
    .overload([v.string(), v.number()], (a, b) => {
     // 字符串和数字参数的函数实现
    });
  ```

4. 使用适当的参数调用重载函数：

  ```typescript
  overloadedFn("hello", 123); // 调用第一个重载
  overloadedFn(123, "hello"); // 调用第二个重载
  overloadedFn({ to: "juergenie@mock.mail", subject: "Hello", body: "World" }); // 调用第三个重载

  overloadedWithFallback("hello", 123); // 调用第一个重载
  overloadedWithFallback(123, "hello"); // 调用备用函数
  ```

  函数将执行与参数的类型和顺序匹配的实现。

5. 尽情享受 TypeScript 中重载函数的灵活性！

有关如何定义模式和处理不同参数类型的更多信息，请参阅 [valibot 文档](https://valibot.dev/)，并查看 [`valiload` 仓库](https://github.com/JuerGenie/valiload/tree/main/test) 中的 `test` 或 `examples` 目录以获取更多示例。
