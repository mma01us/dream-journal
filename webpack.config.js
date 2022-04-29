const path = require('path');
const nodeExternals = require('webpack-node-externals');

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
    __dirname: false,
    __filename: false,
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
  }
};
