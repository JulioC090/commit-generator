import configManager from '@/config';
import maskSecret from '@/utils/maskSecret';
import chalk from 'chalk';

export default async function list(): Promise<void> {
  const config = await configManager.loadConfig();

  if (Object.keys(config).length === 0) {
    console.log('No configuration set.');
    return;
  }

  console.log(chalk.bold('\n🛠️  Current Configuration:\n'));

  if (config.provider) {
    console.log(
      `${chalk.white('🚀 Active Provider: ')} ${chalk.blue(config.provider)}`,
    );
    const providerConfig = config[config.provider];

    if (providerConfig && typeof providerConfig === 'object') {
      Object.entries(providerConfig).forEach(([key, value]) => {
        if (key === 'key') {
          console.log(
            `  🔹 ${chalk.white(key)}: ${chalk.green(maskSecret(value))}`,
          );
          return;
        }
        console.log(`  🔹 ${chalk.white(key)}: ${chalk.green(value)}`);
      });
    }
    console.log('');
  }

  if (config.exclude && config.exclude.files.length > 0) {
    console.log(chalk.white('📂 Excluded Files:'));
    config.exclude.files.forEach((file) =>
      console.log(`  - ${chalk.green(file)}`),
    );
    console.log('');
  }
}
