const path = require('path');
const fs = require('fs');
// const HandlebarsPlugin = require("handlebars-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

const CONFIG = {
  isDev: true,
}

module.exports = {
  mode: CONFIG.isDev ? 'development' : 'production',
  devtool: CONFIG.isDev ? 'eval-source-map' : false,

  entry: {
    main: {
      import: path.resolve(__dirname, 'public/js/index.js'),
    }
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, '/public'),
      "@pages": path.resolve(__dirname, '/views/pages'),
    },
  },

  devServer: {
    historyApiFallback: true,
    port: 8085,
    devMiddleware: {
      index: true,
      mimeTypes: { phtml: 'text/html' },
      publicPath: '/',
      serverSideRender: true,
      writeToDisk: true,
    },
    // host: 'hunt-n-hire.ru',
    // server: {
    //   type: 'https',
    //   options: {
    //   },
    // },
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,

          },
          'css-loader', "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,

          },
          'css-loader', "less-loader"],
      },
      {
        test: /\.mp3$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'mp3/',
            },
          },
        ],
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
        },
        {
          from: './public/js/workers/sw.js',
        }
      ]
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
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
