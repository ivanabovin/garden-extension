export function toJson(object: unknown): string {
  if (object == null || typeof object !== 'object') return '' + object;
  return JSON.stringify(object)
    .replace(/"(\w+)":/g, '$1: ')
    .replace(/"/g, '\'')
    .replace(/,/g, ', ');
}
