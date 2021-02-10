import { expectError, expectType } from "tsd";
import { createNamedRoutes, format, Params } from ".";

type Value = string | number;
type Glob = Value | Value[] | undefined;
type Plus = Value | [Value, ...Value[]];

const routes = {
  users: "/users",
  user: "/users/:id",
} as const;

const route = createNamedRoutes(routes);

function params<T extends string>(_: T): Params<T> {
  return {} as any;
}

/**
 * Params
 */
expectType<{ id: Value }>(params("/users/:id"));
expectType<{ id: Value }>(params("http://example.com/:id"));
expectType<{ id?: Value }>(params("/users/:id?"));
expectType<{ id?: Glob }>(params("/users/:id*"));
expectType<{ id?: Glob }>(params("http://example.com/:id*"));
expectType<{ id: Plus }>(params("/users/:id+"));
expectType<{ id: Value; name?: Value }>(params("/users/:id/:name?"));

/**
 * Format
 */
expectType<string>(format("/users"));
expectType<string>(format("/users", {}));

expectType<string>(format("/users/:id", { id: "1" }));
expectType<string>(format("/users/:id", { id: 1 }));

expectType<string>(format("/users/:id?"));
expectType<string>(format("/users/:id?", {}));

expectType<string>(format("/users/:id?", { id: "1" }));
expectType<string>(format("/users/:id?", { id: 1 }));

expectType<string>(format("/users/:id+", { id: "1" }));
expectType<string>(format("/users/:id+", { id: 1 }));
expectType<string>(format("/users/:id+", { id: ["1"] }));
expectType<string>(format("/users/:id+", { id: [1] }));

expectType<string>(format("/users/:id*"));
expectType<string>(format("/users/:id*", {}));
expectType<string>(format("/users/:id*", { id: "1" }));
expectType<string>(format("/users/:id*", { id: 1 }));
expectType<string>(format("/users/:id*", { id: ["1"] }));
expectType<string>(format("/users/:id*", { id: [1] }));

expectType<string>(format("/users/:id/:name", { id: 1, name: "name" }));

/**
 * Format errors
 */
expectError(format("/users", { id: "1" }));
expectError(format("/users/:id"));
expectError(format("/users/:id", {}));
expectError(format("/users/:id", { id: 1, extra: "extra" }));
expectError(format("/users/:id+"));
expectError(format("/users/:id+", {}));
expectError(format("/users/:id+", { id: [] }));
expectError(format("/users/:id/:name"));
expectError(format("/users/:id/:name", { id: 1 }));

/**
 * Routes
 */
expectType<string>(route("users"));
expectType<string>(route("users", {}));
expectType<string>(route("users", {}));
expectType<string>(route("user", { id: 1 }));
expectType<string>(route("user", { id: "1" }));

/**
 * Route errors
 */
expectError(route("users", { extra: "extra" }));
expectError(route("user", {}));
expectError(route("user", { id: "1", extra: "extra" }));
