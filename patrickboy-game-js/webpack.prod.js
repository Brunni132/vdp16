const path = require('path');

module.exports = {
	entry: './src/game-main.js',
	devtool: false,
	resolve: {
		extensions: [ '.js' ]
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		publicPath: '/build/',
		filename: 'game.bundle.js'
	},
	mode: 'production',
};
