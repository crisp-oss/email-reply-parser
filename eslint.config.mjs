/*
 * This file is part of email-reply-parser
 *
 * Copyright (c) 2025 Crisp IM SAS
 * All rights belong to Crisp IM SAS
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// NPM
import { defineConfig, globalIgnores } from "eslint/config";
import crisp from "eslint-plugin-crisp";

/**************************************************************************
 * CONFIGURATION
 ***************************************************************************/

export default defineConfig([
  globalIgnores([
    "dist/*",
    "node_modules/*"
  ]),

  {
    files: ["lib/**/*.ts"],
    extends: [crisp.configs["recommended-ts"]],
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off"
    }
  }
]);
