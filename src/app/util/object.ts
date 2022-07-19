export function isDefined<T>(object: T | undefined): object is T {
  return object != null;
}

export function isObject(object: unknown): object is object {
  return object != null && typeof object === 'object' && !Array.isArray(object);
}
