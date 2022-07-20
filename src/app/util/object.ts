export function isDefined<T>(value: T | undefined): value is T {
  return value != null;
}

export function ensureDefined<T extends object>(value: T | null | unknown, error: () => string): T {
  if (value != null) return value as T;
  throw new Error(error());
}

export function isObject(value: unknown): value is object {
  return value != null && typeof value === 'object' && !Array.isArray(value);
}

export function optionalString(value: unknown): string | undefined;
export function optionalString(value: unknown, def: string): string;
export function optionalString(value: unknown, def?: string): string | undefined {
  if (typeof value === 'string') return value;
  else return def;
}

export function ensureString(value: unknown): string {
  if (typeof value === 'string') return value;
  else throw new Error('expected string: ' + value);
}
