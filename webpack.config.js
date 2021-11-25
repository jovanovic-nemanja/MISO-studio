const path = require('path')
const WebpackBarPlugin = require('webpackbar')
// const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
	mode: 'production',
	entry: {
		server: path.resolve(__dirname, './server.js'),
		serverless: path.resolve(__dirname, './serverless.js'),
	},
	output: {
		path: path.resolve(__dirname, './.nuxt/dist'),
		filename: '[name].js',
		libraryTarget: 'commonjs',
	},
	target: 'node',
	externals: ['nuxt'],
	stats: 'errors-only',
	plugins: [
		// new CompressionPlugin({
		//   filename: '[path].gz[query]',
		//   algorithm: 'gzip',
		//   minRatio: 1,
		//   test: /\.(js|css|html|svg)$/
		// }),
		new WebpackBarPlugin({
			name: 'Serverless',
			color: '#228be6',
		}),
	],
}
