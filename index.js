/**
 * Constants
 */
const RE_PARAMETER = /:(\w+)([\?\*\+]?)/g;
const RE_SLASH_REPEAT = /([^:]\/)\/+/g;
const RE_SLASH_TRAILING = /\/$/;

/**
 * Format a URL
 */
const format = (url, params) => {
  const resolve = (_match, name, mode) => {
    const value = params && params[name];

    if (value !== undefined) return value;
    if (mode === "?" || mode === "*") return "";

    throw new Error(`Parameter '${name}' is required in '${url}'`);
  };

  return url
    .replace(RE_PARAMETER, resolve)
    .replace(RE_SLASH_REPEAT, "$1")
    .replace(RE_SLASH_TRAILING, "");
};

/**
 * Create a named route mapper.
 */
const createNamedRoutes = (routes) => (name, params) => {
  const route = routes[name];

  if (route === undefined) {
    throw new Error(`Route '${name}' is not defined`);
  }

  return format(route, params);
};

exports.format = format;
exports.createNamedRoutes = createNamedRoutes;
