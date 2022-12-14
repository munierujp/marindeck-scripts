import typescript from '@rollup/plugin-typescript'
import glob from 'glob'
import type { RollupOptions } from 'rollup'

const configs: RollupOptions[] = glob.sync('src/**/main.ts').map(entryPath => ({
  input: entryPath,
  output: {
    file: entryPath.replace(/^src\//, 'dist/').replace(/\/(.+)\/main\.ts$/, '/$1.js'),
    format: 'iife'
  },
  plugins: [
    typescript()
  ]
}))

export default configs
