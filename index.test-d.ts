import { expectError, expectType } from "tsd";
import { createNamedRoutes, format, Params } from ".";

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
expectType<{ id: string | number }>(params("/users/:id"));
expectType<{ id: string | number }>(params("/users/:id+"));
expectType<{ id: string | number }>(params("http://example.com/:id"));
expectType<{ id?: string | number }>(params("/users/:id?"));
expectType<{ id?: string | number }>(params("/users/:id*"));
expectType<{ id?: string | number }>(params("http://example.com/:id*"));
expectType<{ id: string | number; name?: string | number }>(
  params("/users/:id/:name?")
);

/**
 * Format
 */
expectType<string>(format("/users"));
expectType<string>(format("/users", {}));
expectType<string>(format("/users/:id", { id: "1" }));
expectType<string>(format("/users/:id", { id: 1 }));
expectType<string>(format("/users/:id+", { id: "1" }));
expectType<string>(format("/users/:id+", { id: 1 }));
expectType<string>(format("/users/:id?"));
expectType<string>(format("/users/:id?", {}));
expectType<string>(format("/users/:id?", { id: "1" }));
expectType<string>(format("/users/:id?", { id: 1 }));
expectType<string>(format("/users/:id*"));
expectType<string>(format("/users/:id*", {}));
expectType<string>(format("/users/:id*", { id: "1" }));
expectType<string>(format("/users/:id*", { id: 1 }));
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
