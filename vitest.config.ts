import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.spec.ts'],
    exclude: [...configDefaults.exclude],
    testTimeout: 30000,
    retry: 3,
    coverage: {
      include: ['src/application', 'src/infrastructure'],
      exclude: ['src/domain/**'],
      provider: 'v8',
      thresholds: {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100
      }
    }
  }
})
