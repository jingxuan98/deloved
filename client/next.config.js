/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = nextConfig;

//#endregion
const withAntdLess = require("next-plugin-antd-less");

module.exports = withAntdLess({
  // optional: you can modify antd less variables directly here
  modifyVars: { "@primary-color": "#004AAE" },
  // Or better still you can specify a path to a file
  lessVarsFilePath: "./styles/variables.less",
  // optional
  lessVarsFilePathAppendToEndOfContent: false,
  // optional https://github.com/webpack-contrib/css-loader#object
  cssLoaderOptions: {},

  // Other Config Here...

  webpack(config) {
    return config;
  },
});
