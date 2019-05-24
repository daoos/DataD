const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const isDev = process.env.NODE_ENV === 'development' //设置的环境变量都是存放在 process.env 中

module.exports = {
    entry: path.join(__dirname, './src/main.js'),
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'less-loader'],
                            fallback: 'vue-style-loader'
                        })
                    }
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader','css-loader']
            },
            {
                test: /\.less/,
                use: ['style-loader','css-loader','less-loader']
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url-loader',//loader: 'file-loader',
                options: {
                    limit: 1024*600, //小于600K的图片将直接以base64的形式内联在代码中,反之存入输出路径"images/"文件夹下.
                    name: path.posix.join("", 'images/[name].[ext]?[hash]')
                }
            },
            { //整合iview 时需要处理
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 1024*500,
                    name: path.posix.join("", 'fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            'process.env':{
                NODE_ENV: isDev ? '"development"' : '"production"'  //1:可以在要打包的js文件中引用环境变量；2：vue等框架会跟具不同环境区分打包（如：开发环境会包含一些很好的错误提示代码，而生产环境就没有必须加入这些，不然会影响效率）
            }
        })
    ]
}
