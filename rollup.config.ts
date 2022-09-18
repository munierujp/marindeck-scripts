import { readFileSync } from 'node:fs'
import typescript from '@rollup/plugin-typescript'
import { sync as globSync } from 'glob'
import type { RollupOptions } from 'rollup'

const readFile = (path: string): string | undefined => {
  try {
    return readFileSync(path, 'utf8')
  } catch {
    return undefined
  }
}

const files = globSync('src/**/main.ts')
const config: RollupOptions[] = files.map(file => ({
  input: file,
  output: {
    file: file.replace(/^src\//, 'dist/').replace(/\/main\.ts$/, '.js'),
    format: 'iife',
    banner: readFile(file.replace(/\/main\.ts$/, '/header.txt'))
  },
  plugins: [
    typescript()
  ]
}))

export default config
