const { createNamedRoutes, format } = require(".");

describe("format", () => {
  test("no params", () => {
    expect(format("/users")).toEqual("/users");
  });

  test("does not remove root slash", () => {
    expect(format("/")).toEqual("/");
    expect(format("/:path*", { path: "" })).toEqual("/");
  });

  test("required param", () => {
    expect(format("/users/:id", { id: "9" })).toEqual("/users/9");
    expect(format("/users/:id", { id: 9 })).toEqual("/users/9");
  });

  test("required param missing", () => {
    expect(() => format("/users/:id")).toThrow();
    expect(() => format("/users/:id", {})).toThrow();
    expect(() => format("/users/:id", { id: "" })).toThrow();
  });

  test("optional param", () => {
    expect(format("/users/:id?")).toEqual("/users");
    expect(format("/users/:id?", { id: 9 })).toEqual("/users/9");
    expect(format("/users/:id?", { id: "9" })).toEqual("/users/9");
  });

  test("optional param in the middle of the URL", () => {
    expect(format("/a/:b?/c")).toEqual("/a/c");
    expect(format("/a/:b?/c", { b: "b" })).toEqual("/a/b/c");
  });

  test("glob param", () => {
    expect(format("/users/:path*")).toEqual("/users");
    expect(format("/users/:path*", { path: "foo/bar" })).toEqual(
      "/users/foo/bar"
    );
    expect(format("/users/:path*", { path: ["foo", "bar"] })).toEqual(
      "/users/foo/bar"
    );
  });

  test("glob param in the middle of the URL", () => {
    expect(format("/a/:b*/c")).toEqual("/a/c");
    expect(format("/a/:b*/c", { b: "b" })).toEqual("/a/b/c");
  });

  test("one or more param", () => {
    expect(format("/users/:path+", { path: "foo/bar" })).toEqual(
      "/users/foo/bar"
    );
    expect(format("/users/:path+", { path: ["foo", "bar"] })).toEqual(
      "/users/foo/bar"
    );
  });

  test("one or more param missing", () => {
    expect(() => format("/users/:path+")).toThrow();
    expect(() => format("/users/:path+", {})).toThrow();
    expect(() => format("/users/:path+", { path: "" })).toThrow();
    expect(() => format("/users/:path+", { path: [] })).toThrow();
  });

  test("absolute url", () => {
    expect(format("http://example.com/:id", { id: "1" })).toEqual(
      "http://example.com/1"
    );
  });
});

describe("createNamedRoutes", () => {
  test("generates urls", () => {
    const routes = { users: "/users", user: "/users/:id" };
    const route = createNamedRoutes(routes);

    expect(route("users")).toEqual("/users");
    expect(route("user", { id: "1" })).toEqual("/users/1");
  });

  test("errors when an unexpected route is given", () => {
    const route = createNamedRoutes({});

    expect(() => route("users")).toThrow();
  });
});
