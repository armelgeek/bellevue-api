import { config } from '@kolhe/eslint-config'

export default config(
  [
    {
      files: ['src/**/*.ts'],
      rules: {
        'import/no-default-export': 'off'
      }
    },
    {
      files: ['drizzle/**/*'],
      rules: {
        'unicorn/filename-case': 'off',
        'no-console': 'off'
      }
    },
    {
      files: ['docs/**/*'],
      rules: {
        'unicorn/filename-case': 'off',
        'no-console': 'off'
      }
    }
  ],
  {
    prettier: true,
    markdown: false,
    ignorePatterns: ['docs/**', 'drizzle/**']
  }
)
