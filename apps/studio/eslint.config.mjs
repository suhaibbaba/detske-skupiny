import studio from '@sanity/eslint-config-studio'
import prettier from 'eslint-config-prettier'

export default [
  ...studio,
  prettier,
  {
    rules: {
      // The core `semi` rule, not "@typescript-eslint/semi": that rule is no
      // longer part of typescript-eslint, and the plugin is not registered
      // here, so naming it stops eslint loading this config at all.
      semi: ['error', 'always'],
    },
  },
]
