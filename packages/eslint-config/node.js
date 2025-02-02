import eslintJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import turbo from 'eslint-plugin-turbo';
import globals from "globals";
import tsEslint from "typescript-eslint";

export default [
  // Recommended JavaScript configuration
  eslintJs.configs.recommended,
  
  // Recommended TypeScript configuration
  ...tsEslint.configs.recommended,

  // Turbo-specific rules for monorepos
  turbo.configs['flat/recommended'],
  
  // Disables rules that conflict with Prettier
  prettierConfig,
  
  // Recommended rules from the Prettier plugin
  prettierPlugin,
  
  // Language and global environment settings
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
  
  // Directories ignored by ESLint
  {
    ignores: ["node_modules", "dist"],
  },
  
  // Prettier custom rules
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          bracketSpacing: true,
          bracketSameLine: false,
          tabWidth: 2,
          endOfLine: "auto",
        },
      ],
    },
  },
];
