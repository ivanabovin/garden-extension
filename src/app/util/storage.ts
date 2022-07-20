import { isDefined, isObject } from './object';

export function loadUnknown(key: string): unknown | undefined {
  const json = localStorage.getItem(key);
  if (!json) return undefined;
  return JSON.parse(json) as unknown;
}

export function loadString(key: string): string | undefined {
  const value = loadUnknown(key);
  if (typeof value !== 'string') return undefined;
  return value;
}

export function loadArray(key: string): any[] | undefined {
  const value = loadUnknown(key);
  if (!Array.isArray(value)) return undefined;
  return value;
}

export function loadObject(key: string): object | undefined {
  const value = loadUnknown(key);
  if (!isObject(value)) return undefined;
  return value;
}

export function parseString<T>(key: string, parse: (json: string) => T | undefined): T | undefined {
  const text = loadString(key);
  if (!text) return undefined;
  try {
    return parse(text);
  } catch (e) {
    console.error('failed parse key: ' + key, e);
    return undefined;
  }
}

export function parseArray<T>(key: string, parse: (json: any) => T | undefined): T[] | undefined {
  const array = loadArray(key);
  if (!array) return undefined;
  try {
    return array.map(json => isDefined(json) ? parse(json) : undefined).filter(isDefined);
  } catch (e) {
    console.error('failed parse key: ' + key, e);
    return undefined;
  }
}
