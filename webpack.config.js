const path = require("path");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "src/View/index.html"),
      filename: "index.html",
      inject: "body",
    }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "src/View/brl.html"),
      filename: "brl.html",
      inject: "body",
    }),
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "src/View/about.html"),
      filename: "about.html",
      inject: "body",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        sideEffects: true,
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new WorkboxWebpackPlugin.GenerateSW());
  } else {
    config.mode = "development";
  }
  return config;
};
