import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  target: 'node18',
  clean: true,
  tsconfig: 'tsconfig.build.json',
  treeshake: true,
  minify: true,
  shims: true,
});
