const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const src = path.join(__dirname, 'src');

module.exports = merge(baseConfig, {
    mode: 'development',
    devtool: 'eval-source-map',
    stats: {
        assets: false,
        colors: true,
        version: false,
        hash: true,
        timings: true,
        chunks: false,
        chunkModules: false
    },
    entry: {
        pug: glob.sync(path.join(src, '/markup/base.pug'), {
            cwd: src
        }),
        index: path.join(src, 'index.js')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader'}, 
                    { loader: 'css-loader', options: { sourceMap: true } }, 
                    { loader: 'sass-loader', options: { sourceMap: true } }
                ]
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    'file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                        },
                    },
                ],
            }
        ]
    },
    devServer: {
        hot: true,
        host: 'localhost',
        port: 3010,
        historyApiFallback: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            fileName: 'base.pug'
        }),
    ]
});