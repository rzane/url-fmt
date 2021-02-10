/**
 * In tooltips, intersections look a little ugly. This just flattens
 * the intersections into one nice type.
 */
type Merge<A, B> = B extends undefined ? A : { [K in keyof A & B]: (A & B)[K] };

/**
 * Parse a parameter. The following parameter formats are supported:
 *   - :name - Required
 *   - :name+ - Required
 *   - :name? - Optional
 *   - :name* - Optional
 */
type ParseParam<T extends string> = T extends `${infer Name}?`
  ? { [key in Name]?: string | number }
  : T extends `${infer Name}*`
  ? { [key in Name]?: string | number }
  : T extends `${infer Name}+`
  ? { [key in Name]: string | number }
  : { [key in T]: string | number };

/**
 * Chew through a string, looking for parameters.
 */
type Parse<T> = T extends `/:${infer Name}/${infer Next}`
  ? Merge<ParseParam<Name>, Parse<`/${Next}`>>
  : T extends `/:${infer Name}`
  ? ParseParam<Name>
  : T extends `${infer _}${infer Next}`
  ? Parse<Next>
  : undefined;

/**
 * Extract the URL parameters from a string.
 */
export type Params<URL extends string> = Parse<URL>;

/**
 * Constants
 */
const BLANK = "";
const EMPTY_OBJECT = {};

const RE_PARAMETER = /:(\w+)([\?\*\+]?)/g;
const RE_SLASH_REPEAT = /([^:]\/)\/+/g;
const RE_SLASH_TRAILING = /\/$/;

/**
 * If the URL doesn't have any required parameters, the
 * parameters argument should be optional.
 */
type OptionalArgs<T> = T extends undefined
  ? [T] | []
  : {} extends T
  ? [T] | []
  : [T];

type FormatArgs<T extends string> = OptionalArgs<Params<T>>;

/**
 * Format the URL
 */
export function format<URL extends string>(
  url: URL,
  ...args: FormatArgs<URL>
): string {
  const params = args[0] || EMPTY_OBJECT;

  const resolve = (_match: string, name: string, mode: string) => {
    const value = (params as any)[name];

    if (value !== undefined) return value;
    if (mode === "?" || mode === "*") return "";

    throw new Error(`Parameter '${name}' is required in '${url}'`);
  };

  return url
    .replace(RE_PARAMETER, resolve)
    .replace(RE_SLASH_REPEAT, "$1")
    .replace(RE_SLASH_TRAILING, BLANK);
}

/**
 * Represents a mapping of URLs.
 */
interface Routes {
  [key: string]: string;
}

/**
 * Create a named route mapper.
 */
export function createNamedRoutes<R extends Routes>(routes: R) {
  return <K extends keyof R>(name: K, ...args: FormatArgs<R[K]>): string => {
    const route = routes[name];

    if (route === undefined) {
      throw new Error(`Route '${name}' is not defined`);
    }

    return format(route, ...args);
  };
}
