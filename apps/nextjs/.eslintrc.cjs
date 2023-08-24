/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../.eslintrc.cjs", "next"],
  ignorePatterns: ["src/components/ui/*.tsx"],
};
