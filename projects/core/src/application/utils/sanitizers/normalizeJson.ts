export default function normalizeJson(json: string) {
  // Add double quotes around object keys
  const normalized = json.replace(/(\w+):/g, '"$1":');
  return normalized;
}
