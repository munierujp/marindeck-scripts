import path from 'node:path'
import TerserPlugin from 'terser-webpack-plugin'
import type { Configuration } from 'webpack'

const config: Configuration = {
  target: 'web',
  entry: {
    keepTweetedHashtags: './src/keepTweetedHashtags/main.ts'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.ts']
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            preamble: '/* see https://github.com/munierujp/marindeck-scripts */',
            // always single
            quote_style: 1
          }
        }
      })
    ]
  }
}

export default config
