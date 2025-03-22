module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    env: {
        node: true,
        es2021: true,
    },
    rules: {
        quotes: ['error', 'single'],
        indent: ['error', 4],
        'import/order': ['error', {
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
        }],
        'space-in-parens': ['error', 'always'],
    },
};
