// eslint.config.mjs
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Giữ nguyên các "extends" như file JSON cũ
  ...compat.extends(
    "next/core-web-vitals",
    "next/typescript",
    "eslint-config-prettier",
    "prettier",
    "plugin:@tanstack/eslint-plugin-query/recommended"
  ),

  // Thêm rules & plugin prettier như cấu hình JSON
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { prettier },
    rules: {
      "no-unused-vars": "warn",
      "prettier/prettier": [
        "warn",
        {
          arrowParens: "always",
          semi: false,
          trailingComma: "none",
          tabWidth: 2,
          endOfLine: "auto",
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true,
        },
      ],
    },
  },
];
