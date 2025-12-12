import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: globals.node,
      ecmaVersion: 2020,
      sourceType: "module"
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-undef": "error",
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used" }],
      "no-constant-condition": "warn",
      "no-unreachable": "error",
      "no-console": "off",
      // Check import 
      "import/no-unresolved": "off",
      "import/no-unresolved": "error",
      "import/no-unused-modules": "warn",
      "import/order": ["warn", { "groups": ["builtin", "external", "internal"] }]

    }
  }
];