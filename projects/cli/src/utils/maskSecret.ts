export default function maskSecret(
  secret: string,
  visibleStart = 4,
  visibleEnd = 4,
): string {
  if (secret.length <= visibleStart + visibleEnd)
    return '*'.repeat(secret.length);
  return `${secret.slice(0, visibleStart)}...${secret.slice(-visibleEnd)}`;
}
