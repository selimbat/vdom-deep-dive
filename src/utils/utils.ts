
export function isEmpty<T>(array: Array<T>): array is [] {
  return array.length === 0;
}  