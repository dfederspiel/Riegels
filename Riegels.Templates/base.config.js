const fs = require("fs");

module.exports = {
    entry: [ 'babel-polyfill' ],
    devServer: {
        host: 'localhost',
        port: 3000,
        historyApiFallback: true,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: [ 'babel-loader' ],
                exclude: /node_modules/
            },
            {
                test: /\.pug$/,
                use: ['html-loader', 'pug-html-loader?pretty&exports=false'],
            },
        ]
    }
};