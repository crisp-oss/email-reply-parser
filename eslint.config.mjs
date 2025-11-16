/*
 * This file is part of node-mirage-api
 *
 * Copyright (c) 2025 Mirage AI
 * All rights belong to Mirage AI
 */

/**************************************************************************
 * IMPORTS
 ***************************************************************************/

// NPM
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import crisp from "eslint-plugin-crisp";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import jsdoc from "eslint-plugin-jsdoc";

/**************************************************************************
 * CONFIGURATION
 ***************************************************************************/

export default defineConfig([
  // Additional TypeScript configuration
  {
    files: ["lib/*.ts", "lib/**/*.ts"],
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      ecmaVersion: 2020,

      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      crisp: crisp,
      "@typescript-eslint": tseslint,
      jsdoc: jsdoc
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",

      // General JS rules
      "arrow-parens": ["error", "always"],
      "brace-style": [
        "error",
        "1tbs",
        {
          "allowSingleLine": true
        }
      ],
      "comma-dangle": ["error", "never"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "comma-style": ["error", "last"],
      "curly": "error",
      "computed-property-spacing": ["error", "never"],
      "default-param-last": "error",
      "default-case-last": "error",
      "dot-notation": "error",
      "eqeqeq": "error",
      "eol-last": "error",
      "for-direction": "error",
      "indent": [
        "error",
        2,
        {
          "SwitchCase": 1,
          "FunctionDeclaration": {
            "parameters": "off"
          },
          "FunctionExpression": {
            "parameters": "off"
          },
          "CallExpression": {
            "arguments": "off"
          },
          "VariableDeclarator": 1,
          "outerIIFEBody": 0,
          "ArrayExpression": 1,
          "ObjectExpression": 1,
          "ImportDeclaration": 1,
          "flatTernaryExpressions": false,
          "offsetTernaryExpressions": true
        }
      ],
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "keyword-spacing": "error",
      "linebreak-style": ["error", "unix"],
      "newline-per-chained-call": "error",
      "no-console": "warn",
      "no-debugger": "warn",
      "no-eval": "error",
      "no-implicit-coercion": "error",
      "no-multi-str": "error",
      "no-multiple-empty-lines": ["error", { max: 1 }],
      "no-mixed-spaces-and-tabs": "error",
      "no-restricted-syntax": [
        "error",
        {
          "selector": "SwitchCase > *.consequent[type!='BlockStatement']",
          "message": "Switch cases without braces are disallowed."
        }
      ],
      "no-tabs": "error",
      "no-trailing-spaces": "error",
      "no-undef": "error",
      "no-unused-vars": "warn",
      "no-unsafe-optional-chaining": "error",
      "object-curly-newline": [
        "error",
        {
          "multiline": true, "consistent": true
        }
      ],
      "object-curly-spacing": ["error", "always"],
      "padded-blocks": ["error", "never"],
      "padding-line-between-statements": [
        "error",
        { "blankLine": "always", "prev": "let", "next": "*" },
        { "blankLine": "any", "prev": "let", "next": "let" },
        { "blankLine": "always", "prev": "const", "next": "*" },
        { "blankLine": "any", "prev": "const", "next": "const" },
        { "blankLine": "always", "prev": "block-like", "next": "*" },
        { "blankLine": "always", "prev": "*", "next": "break" },
        { "blankLine": "any", "prev": "empty", "next": "break" },
        { "blankLine": "always", "prev": "*", "next": "block-like" },
        { "blankLine": "any", "prev": "case", "next": "case" },
        { "blankLine": "always", "prev": "continue", "next": "*" },
        { "blankLine": "always", "prev": "break", "next": "*" }
      ],
      "prefer-arrow-callback": "error",
      "quotes": [
        "error",
        "double",
        {
          "avoidEscape": true, "allowTemplateLiterals": true
        }
      ],
      "quote-props": ["error", "as-needed"],
      "semi": ["error", "always"],
      "semi-style": ["error", "last"],
      "semi-spacing": ["error", { "before": false, "after": true }],
      "space-before-blocks": "error",
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",

      // Crisp JS rules
      "crisp/align-comments": "error",
      "crisp/enforce-optional": "error",
      "crisp/header-check": "error",
      "crisp/header-comments-check": "error",
      "crisp/import-group-comment": "error",
      "crisp/import-group-order": "error",
      "crisp/methods-naming": "error",
      "crisp/methods-ordering": "error",
      "crisp/multiline-comment-end-backslash": "error",
      "crisp/newline-after-switch-case": "error",
      "crisp/no-async": "off",
      "crisp/no-extra-line-within-function": "error",
      "crisp/no-short-parameters": [
        "error",
        {
          "exceptions": ["_", "$", "x", "y"]
        }
      ],
      "crisp/no-snake-case": "error",
      "crisp/no-useless-template-literals": "error",
      "crisp/no-var-in-blocks": "error",
      "crisp/one-space-after-operator": [
        "error",
        {
          "checkColon": false
        }
      ],
      "crisp/regex-in-constructor": "error",
      "crisp/ternary-parenthesis": "error",

      // General JSDoc rules
      "jsdoc/require-description": "error",
      "jsdoc/require-param-description": "off",
      "jsdoc/require-property-description": "off",
      "jsdoc/require-jsdoc": [
        "error",
        {
          "require": {
            "FunctionDeclaration": true,
            "MethodDefinition": true,
            "ClassDeclaration": true,
            "ArrowFunctionExpression": false,
            "FunctionExpression": false
          },
          "contexts": [
            "Property[key.name=\"getters\"] > ObjectExpression > Property",
            "Property[key.name=\"methods\"] > ObjectExpression > Property"
          ]
        }
      ]
    }
  },

  globalIgnores([
    "dist/*",
    "node_modules/*"
  ])
]);
