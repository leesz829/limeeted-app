module.exports = {
  root: true,
  extends: ["@react-native-community", "eslint-config-prettier"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-shadow": ["error"],
        "no-shadow": "off",
        "no-undef": "off",
        // "prettier/prettier": [
        //   "error",
        //   {
        //     endOfLine: "auto",
        //   },
        // ],
        "prettier/prettier": 0,
        "comma-dangle": ["error", "always-multiline"],
        quotes: ["error", "single"],
        semi: ["error", "always"],
      },
    },
  ],
};
