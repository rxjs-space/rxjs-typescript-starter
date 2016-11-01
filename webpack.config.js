var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: './dist',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  // Source maps support ('inline-source-map' also works)
  devtool: 'source-map',

  // Add the loader for .ts files.
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'RxJS Typescript Starter'
    })
  ],
  devServer: { inline: true },
/*
 * polyfills or mocks for various node stuff
 */
  node: {
    // console: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};