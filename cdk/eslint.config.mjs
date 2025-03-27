import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import tsdoc from "eslint-plugin-tsdoc";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import eslintjs from "@eslint/js";
import eslintts from "typescript-eslint";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { includeIgnoreFile } from "@eslint/compat";
const gitignorePath = path.resolve(__dirname, "..", ".gitignore");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslintjs.configs.recommended,
  allConfig: eslintjs.configs.all,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ),
  ...eslintts.configs.recommended,
  {
    ...eslintjs.configs.recommended,
    plugins: {
      "@typescript-eslint": typescriptEslintEslintPlugin,
      "simple-import-sort": simpleImportSort,
      tsdoc,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },

      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        sourceType: "module",
        project: "./tsconfig.eslint.json",
      },
    },

    rules: {
      "tsdoc/syntax": "warn",

      "max-len": [
        "error",
        {
          code: 150,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: true,
          ignoreRegExpLiterals: true,
        },
      ],

      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
          trailingComma: "all",
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
    ignores: [
      "jest.config.js",
      "package.json",
      "package-lock.json",
      "tsconfig.json",
      "typedoc.json",
      "/cdk.out/**",
      "/dist/**",
      "/docs/**",
      "/test/**",
      "/tmp/**",
    ],
  },
  includeIgnoreFile(gitignorePath),
];
