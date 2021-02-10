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

| Syntax    | Type                                                                 |
| --------- | -------------------------------------------------------------------- |
| `:param`  | `string \| number`                                                   |
| `:param?` | `string \| number \| undefined`                                      |
| `:param*` | `string \| number \| undefined \| Array<string \| number>`           |
| `:param+` | `string \| number \| [string \| number, ...Array<string \| number>]` |
