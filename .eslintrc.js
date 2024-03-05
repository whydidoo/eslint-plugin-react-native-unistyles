module.exports = {
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["airbnb-base", "airbnb-typescript/base"],
      plugins: ["prettier"],
      parserOptions: {
        project: ["./tsconfig.eslint.json"],
      },
      rules: {
        "@typescript-eslint/no-redeclare": "off",
        "import/prefer-default-export": "off",
        "class-methods-use-this": "off",
        "@typescript-eslint/no-shadow": "off",
      },
      settings: {
        "import/resolver": {
          node: {
            paths: ["src"],
          },
        },
      },
    },
  ],
};
