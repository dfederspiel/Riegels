
const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractSass = new ExtractTextPlugin({
    filename: '[name].bundle.css',
    disable: process.env.NODE_ENV === 'production'
});
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    entry: {
        production: path.resolve(__dirname, '../src/prod')
    },
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                use: ExtractSass.extract({
                    use: [
                        { loader: 'css-loader' }, 
                        { loader: 'sass-loader' }
                    ],
                    // use style-loader in development
                    fallback: 'style-loader'
                }),
                exclude: /node_modules/
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: '/images/[name]_[sha512:hash:base64:7].[ext]'
                        }
                    },
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
    plugins: [
        // Extract imported CSS into own file
        new ExtractTextPlugin('[name].bundle.css'),
        // Minify JS
        new UglifyJsPlugin({
            sourceMap: false,
            compress: false,
        }),
        // Minify CSS
        new webpack.LoaderOptionsPlugin({
            minimize: true,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        ExtractSass
    ],
    devtool: 'cheap-module-source-map'
});