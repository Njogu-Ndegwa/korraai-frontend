import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Allow unused variables with warning
      "@typescript-eslint/no-unused-vars": "warn",
      
      // Allow explicit 'any' type with warning
      "@typescript-eslint/no-explicit-any": "warn",
      
      // Allow 'let' without forcing 'const'
      "prefer-const": "off",
      
      // Disable missing dependency warnings
      "react-hooks/exhaustive-deps": "off",
      
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off"
    }
  }
];

export default eslintConfig;