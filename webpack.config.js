const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const WorkboxPlugin = require("workbox-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const manifest = {
  filename: "manifest.json",
  start_url: "/",
  publicPath: "./",
  display: "standalone",
  name: "Bitcoin Glance",
  short_name: "Bitcoin Glance",
  description: "Quickly glance at the Bitcoin market.",
  background_color: "#fff",
  theme_color: "#ff9900",
  prefer_related_applications: true,
  icons: [
    {
      src: path.resolve("src/Assets/icon_512x512.png"),
      sizes: [96, 128, 192, 256, 384, 512],
    },
  ],
};

const config = {
  entry: "./src/index.ts",
  mode: "",
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
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new WebpackPwaManifest(manifest),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
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
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
