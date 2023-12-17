const path = require('path');
// const HandlebarsPlugin = require("handlebars-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CONFIG = {
  isDev: true,
}

module.exports = {
  mode: CONFIG.isDev ? 'development' : 'production',
  devtool: CONFIG.isDev ? 'eval-source-map' : false,

  entry: path.resolve(__dirname, 'public/js/index.js'),

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, '/public'),
      "@pages": path.resolve(__dirname, '/views/pages'),
    },
  },

  devServer: {
    port: 8084,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, './'),
      watch: true
    },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,

          },
          'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        type: 'asset/resource',
        generator: {
          filename: path.join('images', '[name].[contenthash][ext]'),
        },
      },
      {
        test: /\.(ttf)$/,
        type: 'asset/resource',
        generator: {
          filename: path.join('fonts', '[name].[contenthash][ext]'),
        },
      },
      {
        test: /\.handlebars$/,
        use: [
          {
            loader: 'handlebars-loader',
            options: {
              helperDirs: [path.resolve(__dirname, 'public/js/handlebars')],
              partialDirs: [path.resolve(__dirname, 'views/partials')]
            },
          },
        ],
      },
    ]
  },

  plugins: [

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public/images',
          to: './images',
        }
      ]
    }),

    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    new CleanWebpackPlugin(),
  ],

};
