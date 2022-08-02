export function isDefined<T>(value: T | undefined): value is T {
  return value != null;
}

export function ensureDefined<T extends object>(value: T | null | unknown, error: () => string): T {
  if (value != null) return value as T;
  throw new Error(error());
}

export function ensureString(value: unknown): string {
  if (typeof value === 'string') return value;
  else throw new Error('expected string: ' + value);
}
