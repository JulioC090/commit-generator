export default function sanitize(response: string) {
  if (!response || typeof response !== 'string') {
    throw new Error('Invalid AI response: Response is empty or not a string');
  }

  return response
    .replace(/^```json/, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim();
}
