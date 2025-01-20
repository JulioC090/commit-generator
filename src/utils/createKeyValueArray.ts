export function createKeyValueArray(keyValue: string[]) {
  return keyValue
    .map((pair) => {
      const [key, value] = pair.split('=');
      return { key, value };
    })
    .filter((pair) => pair.key && pair.value);
}
