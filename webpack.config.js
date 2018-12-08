const path = require('path');

module.exports = {
	entry: './index.js',
	devtool: 'inline-source-map',
	module: {
	},
	resolve: {
		extensions: [ '.js' ]
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/',
		filename: 'game.bundle.js'
	},
	mode: 'development',
	watch: true
};
