/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

const main = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
});

module.exports = main;
