module.exports = {
    entry: './src/git-history-flow.js',
    output: {
        path: __dirname + '/out',
        filename: 'git-history-flow.js',
        library: 'GitHistoryFlow',
        libraryTarget: 'umd',
		umdNamedDefine: true
    },
    devServer: {
        inline: true,
        contentBase: './dev'
    }
};
