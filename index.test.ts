import { createNamedRoutes, format } from "./index";

test("format", () => {
  expect(format("/users")).toEqual("/users");

  expect(format("/users/:id", { id: "9" })).toEqual("/users/9");
  expect(format("/users/:id", { id: 9 })).toEqual("/users/9");

  expect(format("/users/:id?")).toEqual("/users");
  expect(format("/users/:id?", { id: "9" })).toEqual("/users/9");

  expect(format("http://example.com/:id", { id: "1" })).toEqual(
    "http://example.com/1"
  );
});

test("format optional in the middle of the URL", () => {
  expect(format("/a/:b?/c")).toEqual("/a/c");
  expect(format("/a/:b?/c", { b: "b" })).toEqual("/a/b/c");
});

test("format errors when a required parameter is missing", () => {
  expect(() => format("/users/:id", {} as any)).toThrow();
  expect(() => format("/users/:id+", {} as any)).toThrow();
});

test("format does not error when an optional parameter is missing", () => {
  expect(() => format("/users/:id*", {} as any)).not.toThrow();
  expect(() => format("/users/:id?", {} as any)).not.toThrow();
});

test("createNamedRoutes", () => {
  const routes = { users: "/users", user: "/users/:id" } as const;
  const route = createNamedRoutes(routes);

  expect(route("users")).toEqual("/users");
  expect(route("user", { id: "1" })).toEqual("/users/1");
});

test("createNamedRoutes errors when an unexpected route is given", () => {
  const route = createNamedRoutes({} as any);

  expect(() => route("users")).toThrow();
});
