const path = require('path')//核心模块，用于处理路径问题
const ESLintPlugin = require('eslint-webpack-plugin')//导入eslint模块
const htmlWebpackPlugin = require('html-webpack-plugin')//html打包
const {VueLoaderPlugin} =require('vue-loader')
const {DefinePlugin} =require('webpack')
//返回处理样式loader函数
const getStyleLoaders = (pre) => {
    return [
        'vue-style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env']
                }
            }
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    entry: "./src/main.js",
    output: {
        //__dirname为nodejs的内置变量，表示当前文件的文件目录的绝对路径
        //path.resolve表示第一个参数的路径后拼接第二个参数
        //此处__dirname为 D:\VS-Code\project\webpack-item
        //此处path.resolve结果为 D:\VS-Code\project\webpack-item\dist
        //path是所有文件的输出路径,在开发模式中可以是undefined，因为开发模式没有输出
        path: undefined,
        filename: 'static/js/[name].js',//入口文件打包输出文件名
        clean: true,//自动清空上次打包结果
        chunkFilename: 'static/js/[name].chunk.js',
        assetModuleFilename: 'static/media/[hash:10][ext][query]'
    },
    module: {
        //loader配置
        rules: [

            {
                test: /\.css$/,//只检测.css文件，$表示以什么结尾
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,//只检测.css文件，$表示以什么结尾
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,//只检测.css文件，$表示以什么结尾
                use: getStyleLoaders('sass-loader')
            },
            {
                //图片处理
                test: /\.(png|jpe?g|gif|webp|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        //小于10kb的图片转base64格式
                        //优点：减少请求 缺点：体积变大
                        maxSize: 10 * 1024//最大为10kb
                    }
                }
            },
            {
                test: /\.(ttf|woff2?|map3|map4|avi)$/,
                type: 'asset/resource'
            },
            {
                test: /\.js$/,
                exclude: '/node_modules/',//排除某文件夹下的文件
                // loader: 'babel-loader',//babel配置可以写在当前文件，也可以写在babel.config.js
                //options: {
                //     presets:['@babel/preset-env']
                // }
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,//开启babel缓存
                    cacheCompression: false//关闭缓存文件压缩
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            }
        ]
    },
    //plugins没有时，注释掉，否则报错
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),//检测src下的文件语法
            exclude: 'node_modules',//排除某文件夹下的文件
            cache: true,//开启缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/.eslintcache'),
        }),
        new htmlWebpackPlugin({
            //以public/index.html为模板打包新的html文件
            //新html文件特点：1.结构和原来一致  2.自动引入打包输出的资源
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new VueLoaderPlugin(),
        new DefinePlugin({
            __VUE_OPTIONS_API__:true,
            __VUE_PROD_DEVTOOLS__:false
        })
    ],
    optimization: {
        //代码分割设置，实现按需加载js文件
        splitChunks: {
            chunks: 'all'//对所有模块进行分割
            //....  其他配置
        },
        runtimeChunk: {
            name: (point) => `runtime~${point.name}.js`
        }
    },
    //开发服务器配置
    //不会输出资源，只会在内存中编译打包资源
    devServer: {
        host: 'localhost',
        port: '8000',
        open: true,//是否自动打开浏览器
        hot: true,//热模块替换,true为默认值
        historyApiFallback: true//解决前端路由刷新404问题
    },
    mode: "development",
    devtool: "cheap-module-source-map",
    resolve: {
        //自动补全文件扩展名
        extensions: ['.vue', '.js', '.json']
    }
}