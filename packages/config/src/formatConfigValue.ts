export default function formatConfigValue(value: string) {
  return value.includes(',') ? value.split(',') : value;
}
