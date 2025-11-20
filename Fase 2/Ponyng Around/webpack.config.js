const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: ''
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: [
      {
        directory: path.join(__dirname, 'dist')
      },
      {
        directory: path.join(__dirname, 'src/assets'),
        publicPath: '/assets'
      }
    ],
    hot: true,
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/assets',
          to: 'assets'
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js']
  }
};
