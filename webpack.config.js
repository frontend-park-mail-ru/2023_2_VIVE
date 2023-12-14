const path = require('path');
// const HandlebarsPlugin = require("handlebars-webpack-plugin");

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {

  entry: './public/js/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.[contenthash].js',
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, './public/'),
      "@pages": path.resolve(__dirname, './views/pages/'),
    },
  },

  devServer: {
    port: 8500,
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
      // { 
      //   test: /\.handlebars$/, 
      //   use: [
      //     {
      //       loader: 'handlebars-loader',
      //       options: {
      //         // runtime: 'handlebars/dist/cjs/handlebars.runtime',
      //         // precompileOptions: {
      //         //   knownHelpersOnly: false,
      //         // },
      //         helperDirs: [
      //           path.resolve(__dirname, 'public/js/handlebars'),
      //         ],
      //         // inlineRequires: '/assets/',
      //         rootRelative: './views/partials/',
      //       },
      //     },
      //   ],
      // },
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
      // filename: './index.html'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    }),

    new CleanWebpackPlugin(),
  ],

};
