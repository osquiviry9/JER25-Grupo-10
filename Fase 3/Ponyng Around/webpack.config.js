import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/client/main.js',

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },

  mode: 'development',
  devtool: 'inline-source-map',

  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false
        }
      }
    ]
  },

  // ❌ ELIMINADO → CAUSABA "Phaser is not defined"
  // externals: {
  //   phaser: 'Phaser'
  // },

  devServer: {
    static: './dist',
    hot: true,
    port: 8080
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true     // ⬅️ Esto AUTOINYECTA bundle.js en el dist/index.html
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public/assets',
          to: 'assets',
          noErrorOnMissing: true
        }
      ]
    })
  ],

  resolve: {
    extensions: ['.js'],
    alias: {
      '@client': path.resolve(__dirname, 'src/client'),
    }
  }
};
