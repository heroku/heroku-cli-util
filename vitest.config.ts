import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      include: ['src/**/*.ts'],
      provider: 'v8',
      reporter: ['lcov', 'text-summary'],
    },
    deps: {
      // tsheredoc's CJS export is `{default: fn}`. Vite's interop flattens it
      // (so `import x from 'tsheredoc'` becomes `fn`), but the source code uses
      // `tsheredoc.default()` matching Node's CJS interop (`{default: fn}`).
      interopDefault: false,
    },
    disableConsoleIntercept: true,
    include: ['test/**/*.test.ts'],
    setupFiles: ['test/setup.ts'],
    testTimeout: 15_000,
  },
})
