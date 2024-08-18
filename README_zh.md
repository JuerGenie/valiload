# valiload

一个简单且轻量级的用于在TypeScript中进行函数重载的库。

[English Version](./README.md)

## 什么是valiload？

`valiload`是一个TypeScript库，允许您创建可以使用不同参数模式进行重载的函数。它提供了一种方便的方式来定义可以处理不同类型和参数组合的函数的多个版本。

## 使用方法

要使用`valiload`，请按照以下步骤进行操作：

1. 在您的项目中将`valiload`作为依赖项进行安装：

  ```bash
  npm install valiload valibot
  ```

2. 在您的TypeScript文件中导入`valiload`：

  ```typescript
  import * as v from 'valiload';
  ```

3. 使用`valiload`语法定义您的重载函数：

  ```typescript
  const MailSchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    body: z.string(),
  });

  const overloadedFn = v.valiload()
    .overload([v.string(), v.number()], (a, b) => {
     // 字符串和数字参数的函数实现
    })
    .overload([v.number(), v.string()], (a, b) => {
     // 数字和字符串参数的函数实现
    })
    .overload([MailSchema], (mail) => {
     // MailSchema参数的函数实现
    });
  ```

4. 使用适当的参数调用重载函数：

  ```typescript
  overloadedFn("hello", 123); // 调用第一个重载
  overloadedFn(123, "hello"); // 调用第二个重载
  overloadedFn({ to: "juergenie@mock.mail", subject: "Hello", body: "World" }); // 调用第三个重载
  ```

  函数将执行与参数的类型和顺序匹配的实现。

5. 尽情享受在TypeScript中使用重载函数的灵活性！

有关如何定义模式和处理不同参数类型的更多信息，请参阅[valibot文档](https://valibot.dev/)。
