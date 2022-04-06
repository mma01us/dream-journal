const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const config = require('./config')

module.exports = {
  entry: ['./src/scss/styles.scss'],
  output: {
    path: path.join(__dirname, 'public'),
    publicPath: '/',
    filename: 'stylesheets/[name].css'
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
					{
						loader: 'file-loader',
						options: {
							name: 'stylesheets/[name].css',
						}
					},
					{
						loader: 'extract-loader'
					},
					{
						loader: 'css-loader'
					},
					{
						loader: 'postcss-loader'
					},
					{
						loader: 'sass-loader'
					}
				],
      }
    ]
  },
  mode: config.get('env')
};
