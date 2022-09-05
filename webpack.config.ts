import path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
import type { Configuration } from 'webpack'

const config: Configuration = {
  target: 'web',
  entry: {
    keepTweetedHashtags: './src/keepTweetedHashtags.ts'
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
    minimizer: [new TerserPlugin({
      terserOptions: {
        format: {
          // always single
          quote_style: 1
        }
      }
    })]
  }
}

export default config
