const config = {
  OPENAI_KEY: process.env.OPENAI_KEY || '',
  EXCLUDE_FILES: ['pnpm-lock.yaml', 'package-lock.json'],
};

export default config;
