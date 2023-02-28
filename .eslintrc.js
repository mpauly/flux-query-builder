module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
    "prettier"
  ],
  overrides: [
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', "prettier"],
  root: true,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    "@typescript-eslint/restrict-template-expressions": "warn",
    "@typescript-eslint/no-unused-vars": ["error", {"destructuredArrayIgnorePattern": "^_"}]
  }
}
