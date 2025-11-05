module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    env: {
        node: true,
        es2021: true,
    },
    rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
        'prettier/prettier': 'error',
        quotes: ['error', 'single'],
        indent: 'off',
        '@typescript-eslint/indent': 'off',
        'space-in-parens': 'off',
        'import/order': [
            'error',
            {
                groups: [
                    'builtin',
                    'external',
                    'internal',
                    'parent',
                    'sibling',
                    'index',
                    'object',
                    'type',
                ],
                'newlines-between': 'always',
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
            },
        ],
    },
};
