module.exports = {
    entry: {
        'git-history-flow': ['babel-polyfill', './src/git-history-flow.js'],
        'main': ['./docs/main.js']
    },
    output: {
        path: __dirname + '/docs/out',
        filename: '[name].js',
        library: 'GitHistoryFlow',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [{
        	test: /\.css$/,
        	loader: "style!css"
        }, {
             test: /\.js$/,
             loader: 'babel-loader',
             query: {
                 presets: ['es2015']
             }
		}]
    },
    devServer: {
        inline: true,
        contentBase: './docs'
    }
};
