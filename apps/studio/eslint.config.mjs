import studio from '@sanity/eslint-config-studio'
import prettier from 'eslint-config-prettier'

export default [
  ...studio,
  prettier,
  {
    rules: {
      semi: ['error', 'always'],
      '@typescript-eslint/semi': ['error', 'always'],
    },
  },
]
