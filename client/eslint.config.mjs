import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";
import stylisticJs from "@stylistic/eslint-plugin-js";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: { 
        ...globals.browser, 
        ...jest.environments.globals.globals
      }
    } 
  },
  pluginReact.configs.flat.recommended,
  {
    plugins: { 
      "@stylistic/js": stylisticJs,
      jest
    },
    rules: { 
      "@stylistic/js/indent": ["error", 2],
      "@stylistic/js/linebreak-style": 0,
      "@stylistic/js/quotes": ["error", "double"],
      "@stylistic/js/semi": ["error", "always"],
    },
  },
  {
    ignores: ["tailwind.config.js", "build"],
  }
]);
