import { isDefined, isObject } from './object';

export function loadUnknown(key: string): unknown | undefined {
  const json = localStorage.getItem(key);
  if (!json) return undefined;
  return JSON.parse(json) as unknown;
}

export function loadArray(key: string): any[] | undefined {
  const array = loadUnknown(key);
  if (!Array.isArray(array)) return undefined;
  return array;
}

export function loadObject(key: string): object | undefined {
  const object = loadUnknown(key);
  if (!isObject(object)) return undefined;
  return object;
}

export function parseArray<T>(key: string, parse: (json: Record<string, any>) => T | undefined): T[] {
  const array = loadArray(key);
  if (!array) return [];
  try {
    return array.map(json => isObject(json) ? parse(json) : undefined).filter(isDefined);
  } catch (e) {
    console.error('failed parse key: ' + key, e);
    return [];
  }
}
