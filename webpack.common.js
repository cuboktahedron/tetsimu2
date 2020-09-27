/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

const main = {
  entry: path.join(__dirname, "src", "main", "index"),
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      constants: path.resolve(__dirname, "src", "main", "constants"),
      ducks: path.resolve(__dirname, "src", "main", "ducks"),
      renderers: path.resolve(__dirname, "src", "main", "renderers"),
      stores: path.resolve(__dirname, "src", "main", "stores"),
      types: path.resolve(__dirname, "src", "main", "types"),
      utils: path.resolve(__dirname, "src", "main", "utils"),
    },
    extensions: [".json", ".js", "jsx", ".css", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.ts[x]?$/,
        include: [path.resolve(__dirname, "src")],
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "src", "test"),
        ],
        use: ["ts-loader"],
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

module.exports = main;
