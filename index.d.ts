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
 * If the URL doesn't have any required parameters, the
 * parameters argument should be optional.
 */
type FormatArgs<Params> = Params extends undefined
  ? [Params] | []
  : {} extends Params
  ? [Params] | []
  : [Params];

/**
 * Format the URL
 */
export function format<URL extends string>(
  url: URL,
  ...args: FormatArgs<Params<URL>>
): string;

/**
 * Represents a mapping of URLs.
 */
interface Routes {
  [key: string]: string;
}

/**
 * Create a named route mapper.
 */
export function createNamedRoutes<R extends Routes>(
  routes: R
): <Name extends keyof R>(
  name: Name,
  ...args: FormatArgs<Params<R[Name]>>
) => string;