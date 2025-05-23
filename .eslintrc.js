module.exports = {
    'ignorePatterns': ['.eslintrc.js'],
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
        'mocha': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module'
    },
    'rules': {
        'accessor-pairs': 'error',
        'array-bracket-spacing': [
            'error',
            'never'
        ],
        'array-callback-return': 'error',
        'arrow-body-style': 'off',
        'arrow-parens': 'off',
        'arrow-spacing': [
            'error',
            {
                'after': true,
                'before': true
            }
        ],
        'block-scoped-var': 'error',
        'block-spacing': 'off',
        'brace-style': 'error',
        'callback-return': 'off',
        'camelcase': 'off',
        'capitalized-comments': 'off',
        'class-methods-use-this': 'off',
        'comma-dangle': 'off',
        'comma-spacing': [
            'error',
            {
                'before': false,
                'after': true
            }
        ],
        'comma-style': [
            'error',
            'last'
        ],
        'complexity': 'error',
        'computed-property-spacing': [
            'error',
            'never'
        ],
        'consistent-return': 'off',
        'consistent-this': 'off',
        'curly': 'error',
        'default-case': 'error',
        'dot-location': [
            'error',
            'property'
        ],
        'dot-notation': [
            'error',
            {
                'allowKeywords': true
            }
        ],
        'eol-last': 'error',
        'eqeqeq': 'error',
        'func-call-spacing': 'off',
        'func-name-matching': 'error',
        'func-names': 'off',
        'func-style': 'off',
        'generator-star-spacing': 'off',
        'global-require': 'off',
        'guard-for-in': 'off',
        'handle-callback-err': 'error',
        'id-blacklist': 'error',
        'id-length': 'off',
        'id-match': 'error',
        'indent': ['error', 4],
        'init-declarations': 'off',
        'jsx-quotes': 'error',
        'key-spacing': [
            'error',
            {
                'beforeColon': false,
                'afterColon': true
            }
        ],
        'keyword-spacing': [
            'error',
            {
                'before': true,
                'after': true
            }
        ],
        'line-comment-position': 'off',
        'linebreak-style': [
            'error',
            'unix'
        ],
        'lines-around-comment': 'error',
        'lines-around-directive': 'off',
        'max-depth': 'error',
        'max-len': 'off',
        'max-lines': 'error',
        'max-nested-callbacks': 'error',
        'max-params': 'off',
        'max-statements': 'off',
        'max-statements-per-line': 'off',
        'multiline-ternary': [
            'error',
            'never'
        ],
        'new-parens': 'error',
        'newline-after-var': 'off',
        'newline-before-return': 'off',
        'newline-per-chained-call': 'error',
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-await-in-loop': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-catch-shadow': 'off',
        'no-cond-assign': [
            'error',
            'except-parens'
        ],
        'no-confusing-arrow': 'error',
        'no-continue': 'error',
        'no-div-regex': 'error',
        'no-duplicate-imports': 'error',
        'no-else-return': 'error',
        'no-empty-function': 'error',
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extend-native': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-extra-parens': 'off',
        'no-floating-decimal': 'error',
        'no-implicit-coercion': 'error',
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-inline-comments': 'off',
        'no-inner-declarations': [
            'error',
            'functions'
        ],
        'no-invalid-this': 'off',
        'no-iterator': 'error',
        'no-label-var': 'error',
        'no-labels': 'error',
        'no-lone-blocks': 'error',
        'no-lonely-if': 'error',
        'no-loop-func': 'off',
        'no-magic-numbers': 'off',
        'no-mixed-operators': 'error',
        'no-mixed-requires': 'off',
        'no-multi-assign': 'error',
        'no-multi-spaces': 'error',
        'no-multi-str': 'error',
        'no-multiple-empty-lines': [
            'error',
            {
                'max': 1,
                'maxEOF': 0
            }
        ],
        'no-native-reassign': 'error',
        'no-negated-condition': 'off',
        'no-negated-in-lhs': 'error',
        'no-nested-ternary': 'error',
        'no-new': 'off',
        'no-new-func': 'error',
        'no-new-object': 'error',
        'no-new-require': 'error',
        'no-new-wrappers': 'error',
        'no-octal-escape': 'error',
        'no-param-reassign': 'off',
        'no-path-concat': 'off',
        'no-plusplus': [
            'error',
            {
                'allowForLoopAfterthoughts': true
            }
        ],
        'no-process-env': 'off',
        'no-process-exit': 'error',
        'no-proto': 'error',
        'no-prototype-builtins': 'error',
        'no-restricted-globals': 'error',
        'no-restricted-imports': 'error',
        'no-restricted-modules': 'error',
        'no-restricted-properties': 'error',
        'no-restricted-syntax': 'error',
        'no-return-assign': 'error',
        'no-return-await': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-shadow': 'off',
        'no-shadow-restricted-names': 'error',
        'no-spaced-func': 'off',
        'no-sync': 'off',
        'no-tabs': 'off',
        'no-template-curly-in-string': 'error',
        'no-ternary': 'off',
        'no-throw-literal': 'error',
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-undefined': 'error',
        'no-underscore-dangle': 'off',
        'no-unmodified-loop-condition': 'error',
        'no-unneeded-ternary': 'error',
        'no-unused-expressions': 'error',
        'no-use-before-define': 'off',
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-constructor': 'error',
        'no-useless-escape': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'no-var': 'error',
        'no-void': 'error',
        'no-warning-comments': 'error',
        'no-whitespace-before-property': 'error',
        'no-with': 'error',
        'object-curly-newline': 'off',
        'object-curly-spacing': [
            'error',
            'never'
        ],
        'object-property-newline': [
            'error',
            {
                'allowMultiplePropertiesPerLine': true
            }
        ],
        'object-shorthand': 'off',
        'one-var': 'off',
        'one-var-declaration-per-line': [
            'error',
            'initializations'
        ],
        'operator-assignment': 'error',
        'operator-linebreak': 'error',
        'padded-blocks': 'off',
        'prefer-arrow-callback': 'off',
        'prefer-const': 'error',
        'prefer-numeric-literals': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-reflect': 'off',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'prefer-template': 'off',
        'quote-props': 'off',
        'quotes': [
            'error',
            'single'
        ],
        'radix': [
            'error',
            'as-needed'
        ],
        'require-atomic-updates': 'off',
        'require-await': 'error',
        'require-jsdoc': 'off',
        'rest-spread-spacing': 'error',
        'semi': [
            'error',
            'always'
        ],
        'semi-spacing': [
            'error',
            {
                'after': true,
                'before': false
            }
        ],
        'sort-imports': 'error',
        'sort-keys': 'off',
        'sort-vars': 'off',
        'space-before-blocks': 'error',
        'space-before-function-paren': 'off',
        'space-in-parens': [
            'error',
            'never'
        ],
        'space-infix-ops': 'off',
        'space-unary-ops': 'error',
        'spaced-comment': 'off',
        'strict': 'off',
        'symbol-description': 'error',
        'template-curly-spacing': [
            'error',
            'never'
        ],
        'template-tag-spacing': 'error',
        'unicode-bom': [
            'error',
            'never'
        ],
        'valid-jsdoc': 'error',
        'vars-on-top': 'off',
        'wrap-regex': 'error',
        'yield-star-spacing': 'error',
        'require-yield': 'off',
        'yoda': [
            'error',
            'never'
        ]
    },
    'globals': {
        'actor': true,
        'Feature': true,
        'Scenario': true,
        'xScenario': true,
        'Before': true,
        'After': true,
        'codecept_helper': true
    }
};
