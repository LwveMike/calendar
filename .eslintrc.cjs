module.exports = {
    root: true,
    parser: "vue-eslint-parser",
    parserOptions: {
        parser: "@typescript-eslint/parser",
    },
    extends: [
        "plugin:vue/strongly-recommended",
        "eslint:recommended",
        "@vue/typescript/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint", "prettier"],
    rules: {
        'indent': ['error', 2, { 'SwitchCase': 1 }],
        'arrow-parens': ['error', 'as-needed'],
        'eqeqeq': ['error', 'always'],
        "quotes": [2, "single", { "avoidEscape": true }],
        'no-async-promise-executor': 'error',
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        'semi': ['error', 'never'],
        'space-before-blocks': 'error',
        'keyword-spacing': ['error', { 'before': true, 'after': true }],
        'no-trailing-spaces': 'error',
        'camelcase': 1,
        'no-prototype-builtins': 'off',
        'vue/component-definition-name-casing': ['error', 'PascalCase'],
        'vue/match-component-file-name': ['error', { 'extensions': ['vue'], 'shouldMatchCase': false }],
        'vue/component-name-in-template-casing': ['error', 'kebab-case'],
        'vue/eqeqeq': 'error',
        'vue/object-curly-spacing': ['warn', 'always', { 'objectsInObjects': true, 'arraysInObjects': true }],
        'vue/comma-dangle': 'error',
        'vue/multi-word-component-names': 'off',
        'vue/max-attributes-per-line': ['warn', {
            'singleline': { 'max': 2 },
            'multiline': { 'max': 1 }
        }],
    },
}