import typescript from '@rollup/plugin-typescript'
import type { RollupOptions } from 'rollup'

const createOptions = (id: string): RollupOptions => {
  return {
    input: `src/${id}/main.ts`,
    output: {
      file: `dist/${id}.js`,
      format: 'iife',
      banner: `/* see https://github.com/munierujp/marindeck-scripts/tree/master/src/${id} */`
    },
    plugins: [
      typescript()
    ]
  }
}

const config: RollupOptions[] = [
  createOptions('keepTweetedHashtags')
]

export default config
