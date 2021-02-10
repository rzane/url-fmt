/**
 * Constants
 */
const RE_PARAMETER = /:(\w+)([\?\*\+]?)/g;
const RE_SLASH_REPEAT = /([^:]\/)\/+/g;
const RE_SLASH_TRAILING = /\/$/;

const join = (value) => {
  if (Array.isArray(value)) {
    return value.join("/");
  }

  return value;
};

const isEmptyArray = (value) => {
  return Array.isArray(value) && value.length === 0;
};

/**
 * Format a URL
 */
const format = (url, params) => {
  const resolve = (_match, name, mode) => {
    const value = params && params[name];

    if (mode === "+" && isEmptyArray(value)) {
      throw new Error(`One or more '${name}' is required in '${url}'`);
    }

    if (value !== undefined && value !== "") {
      return join(value);
    }

    if (mode === "?" || mode === "*") {
      return "";
    }

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
