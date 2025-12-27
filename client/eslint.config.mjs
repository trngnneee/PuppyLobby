import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Load standard Next.js rules
  ...compat.extends("next/core-web-vitals"),

  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**"
    ],
  },
  
  // FORCE ENABLE RULES HERE
  {
    rules: {
      // Show error (red squiggle) if variable is defined but not used
      "no-unused-vars": "error", 
      
      // Show error if using a variable that doesn't exist
      "no-undef": "error",
      
      // Optional: Show error for console.log
      "no-console": "warn", 
    }
  }
];

export default eslintConfig;