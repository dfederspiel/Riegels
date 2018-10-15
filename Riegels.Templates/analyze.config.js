
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./prod.config.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(baseConfig, {
    plugins: [
        new BundleAnalyzerPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('analysis'),
        })
    ]
});