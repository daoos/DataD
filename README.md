# DataD
Data Dashboard（数据仪表板）

<a href="https://yangjijiang.github.io/DataD/dist/index.html#/edit">效果演示： https://yangjijiang.github.io/DataD/dist/index.html#/edit</a>

<hr>
<h3>使用方式：</h3>
<pre>
    1、安装：npm install https://github.com/yangjijiang/DataD.git
    
    2、引用/调用（跟具自己具体情况进行调整）：
        a）将DataD中dist目录下的内容复制到自己的工程目录中（webpack.config.js中配置）
            const CopyPlugin = require('copy-webpack-plugin');
            module.exports = {
                ...,
                ...,
                plugins: [
                     new CopyPlugin([
                        { from:  path.join(__dirname, './node_modules/DataD/dist'), to:  path.join(__dirname, '../dist/DataD') }
                     ])
                ]
            }
        b）能过自己项目的路由，调用自己项目下/dist/DataD/index.html
</pre>
<hr>
<h3>功能介绍：</h3>
<pre>
    1、数据URL请求的三种策略（Default，Jsonp，Proxy）
        1.1、如果您将DataD嵌入到自己的项目做了一个功能使用时：
            a）Default（默认内部域名访问）  
                图表的数据URL可以如下形式填写（ /dashboard/data 等） 
            b）Jsonp（跨域名访问）--- JSOP回调函数:jsonpCallback 
                后台Controller方法返回值需要做进一步处理 ( return "jsonpCallback("+result.toString()+")" )
            c）Proxy（服务器 Http 代理转发）
                需自己在后端实现代理逻辑，代理方法接收的URL：/dashboard/http_proxy_forward，被代理的url及相关参数都 /dashboard/http_proxy_forward 下传递  
        1.2、策略验证： 
            图表第一次发起数据URL请求时，进行三种策略验证，从而达到在后续的请求以哪种策略进行轮询的目地。
            检测顺序为 Default -> Jsonp -> Proxy ，当Default请求失败时进行Jsonp，而当Jsonp也失败时再进行Proxy，Proxy还失败，三种策略验证都失败此时将报出该URL无法访问异常，该图表后续的轮询将终断。
            在第一次发起数据URL请求时只要有一个策略验证通过，将记录当前验证通过的策略，并在后续的请求轮询中都用该策略。如果在后续请求轮询中出现访问异常（如：网络终断、后端服务器宕机等）轮询不会停止，将一直轮询下去直到网络或服务器恢复正常状态。
    
    2：页面配置存储（本机存储、远端存储）
        配置主要是对两个配置信息的存储：布局模板（grids表）、 页面整体（page表），表结构都是以Key-Value的形式存储，其它Key默认为自增ID。             
        a）本机存储
            引入DataD默认情况下是本机存储，它是利用浏览器自带的IndexedDB数据库进行持久化（可在浏览器开发者模式下Appliction中进行查看）。
            优点：开箱即用，无需另准备持久化数据库。
            缺点：自己配置好的图表，只能在自己机器浏览器下查看，其它人访问不到。
        b）远程存储   
            1）在DataD的首页index.html中向主Js文件main.bundle.js传入配置参数，<script src="main.bundle.js?config=isUseIndexedDB=false"></script>
            2）后端自实现restful api ： 
                "/grids" ： addDdGrid、deleteDdGrid、selectAllDdGrid
                "/pages" ： addDdPage、deleteDdPage、updateDdPage、selectDdPage、selectAllDdPage
</pre>                