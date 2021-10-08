<h1 align="center">url-fmt</h1>

<div align="center">

![Build](https://github.com/rzane/url-fmt/workflows/build/badge.svg)
![Version](https://img.shields.io/npm/v/url-fmt)
![Size](https://img.shields.io/bundlephobia/minzip/url-fmt)
![License](https://img.shields.io/npm/l/url-fmt)

</div>

Functions that can be used to generate fully-typed URL helper methods.

This package uses Typescript's template literals to parse the URL and generate a type definition for the parameters that will be used to generate the URL.

## Install

    $ yarn add url-fmt

## Usage

#### `format`

This function will take a URL template and replace named parameters. The parameters passed to this function will be strictly validated by TypeScript. The parameter types are inferred from the URL template.

```typescript
import { format } from "url-fmt";

format("/users");
format("/users/:id", { id: 1 });

format("/users/:id?");
format("/users/:id?", { id: 1 });

format("/users/:id"); // error
format("/users/:id", {}); // error
```

#### `createNamedRoutes`

This function allows you to define named routes in your application. Named routes are a good practice because they'll allow you to decouple your URLs from application code.

The function returned from `createNamedRoutes` takes a route name and parameters. The parameters will be inferred from the URL template and will be strictly validated by TypeScript.

```typescript
import { createNamedRoutes } from "url-fmt";

const routes = {
  users: "/users",
  user: "/users/:id",
} as const;

const route = createNamedRoutes(routes);

route("users");
route("user", { id: 1 });
```

## Syntax

| Syntax    | Meaning               | Type                                                                 |
| --------- | --------------------- | -------------------------------------------------------------------- |
| `:param`  | One required segment  | `string \| number`                                                   |
| `:param?` | One optional segment  | `string \| number \| undefined`                                      |
| `:param*` | Zero or more segments | `string \| number \| undefined \| Array<string \| number>`           |
| `:param+` | One or more segment   | `string \| number \| [string \| number, ...Array<string \| number>]` |
