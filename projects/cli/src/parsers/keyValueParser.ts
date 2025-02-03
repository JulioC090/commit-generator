import { InvalidArgumentError } from '@commander-js/extra-typings';

export default function keyValueParser(
  pair: string,
  pairs?: Array<{ key: string; value: string }>,
) {
  const [key, value] = pair.split('=');

  if (!key || !value)
    throw new InvalidArgumentError(
      'Invalid key-value pair format. Expected "key=value".',
    );

  if (!pairs) {
    pairs = [];
  }

  pairs.push({ key, value });
  return pairs;
}
