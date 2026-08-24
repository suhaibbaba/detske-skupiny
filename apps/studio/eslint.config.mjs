import studio from '@sanity/eslint-config-studio'
import prettier from 'eslint-config-prettier'

export default [
  ...studio,
  prettier,
  {
    rules: {
      // "@typescript-eslint/semi" used to sit next to this one, but the rule
      // was moved out of typescript-eslint and the plugin is not registered
      // here, so eslint refused to load this config at all. The core rule
      // below is what was actually being enforced.
      semi: ['error', 'always'],
    },
  },
]
