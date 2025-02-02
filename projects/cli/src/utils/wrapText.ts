export default function wrapText(
  text: string,
  width: number,
  spaces: number = 0,
) {
  const regex = new RegExp(`(.{1,${width}})(\\s|$)`, 'g');
  const indent = '\u0020'.repeat(spaces);
  return text.match(regex)?.join(`\n${indent}`);
}
