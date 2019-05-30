# DataD 开发环境
Data Dashboard（数据仪表板）

/** 安装使用说明 **/
1：将工程（DataD）源码安装到自己项目的node_modules目录下（可通过复制源码 或 npm link 或 npm install 的方式安装）
2：确认 DataD 工程模块下已经编译生成dist文件目录（如果没有dist目录，进入webapp下执行npm run prod）

   
/** 对外提供接口说明 **/
 默认参数：
 {
    isUseIndexedDB:true,           //是否使用前端数据库，用于存放页面配置（如为false用户需自实现RESTFUL接口"/grids"、"/pages"）
    isUseBusinessChartModule:true, //是否使用定制开发的内置图表（为true时用户需自行开发相应图表）
    businessChartModuleConfig:{
        sgm:{
            dataUrl:"",
            getAppListUrl:undefined,     // /apps?type=alias
            getServiceListUrl:undefined, // /service/get_list
            getMethodListUrl:undefined,  // /method/get_list
            getLegendListUrl:undefined   // /supplyconfig?type=monitor
        }
    } //定制开发的图表对外提供的参数配置（sgm为某一个内置图表，可自行扩展；isUseBusinessChartModule为false时，该参数可省略）
 }
 
 
/** 备注：webpack打包时（npm run prod 与 npm run dev）报错内存溢出 javaScript heap out of memory **/
打开自己项目文件：/node_modules/.bin/webpack.cmd 与 webpack-dev-server.cmd (使用本地开发环境启动)
    --设置前
    node  "%~dp0\..\xxxxxxxxxxxxx.js" %*
    --设置后
    node  --max_old_space_size=2048 "%~dp0\..\xxxxxxxxxxxxx.js" %*
  
// 调整NodeJs运行时内存限制的大小
node --max-old-space-size=2048  // 单位为MB 
node --max-new-space-size=1024  // 单位为KB


/** 优化点： **/
1：线柱状图 - 图例配置 可从后端传入过来，解决图例动态分配。
2：抽屉默认弹出优化。
4：蓝色主题开发一套图表图例主题。
5：添加模板 - 布局由4行6列调整为6行4列（调整后对之前的图找出影响）。
