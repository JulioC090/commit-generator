import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  js.configs.recommended,
  
  {
    languageOptions: {
      parser: tsparser,
      globals: {
        ...globals.node,
        ...globals.es2022,
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules
    }
  },

  prettier,

  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          bracketSpacing: true,
          bracketSameLine: false,
          tabWidth: 2,
          endOfLine: "auto"
        }
      ]
    }
  },

  {
    ignores: ["node_modules", "dist"]
  }
];