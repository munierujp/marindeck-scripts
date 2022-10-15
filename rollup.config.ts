import { readFileSync } from 'node:fs'
import typescript from '@rollup/plugin-typescript'
import glob from 'glob'
import type { RollupOptions } from 'rollup'
import watch from 'rollup-plugin-watch'

const configs: RollupOptions[] = glob.sync('src/**/main.ts').map(entryPath => ({
  input: entryPath,
  output: {
    file: entryPath.replace(/^src\//, 'dist/').replace(/\/(.+)\/main\.ts$/, '/$1.js'),
    format: 'iife',
    banner: () => readFileSync(entryPath.replace(/\/main\.ts$/, '/header.txt'), 'utf8')
  },
  plugins: [
    typescript(),
    watch({
      dir: 'src'
    })
  ]
}))

export default configs
