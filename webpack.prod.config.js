const path = require('path')
const webpackBaseConfig = require('./webpack.base.config.js');
const merge = require('webpack-merge');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(webpackBaseConfig, {
    output: {
        //publicPath: 'dist/',
        path: path.join(__dirname, './dist/'),
        filename: '[name].bundle.js',
        chunkFilename: '[name].chunk.js'
    },
    module: {
        rules: []
    },
    plugins: [
        new htmlWebpackPlugin({
            filename: path.join(__dirname, './dist/index.html'),
            template: path.join(__dirname, './src/template/index.ejs'),
            inject: false,
            // minify:{ //压缩HTML文件
            //     removeComments:true,    //移除HTML中的注释
            //     collapseWhitespace:true    //删除空白符与换行符
            // }
        })
    ]
});
