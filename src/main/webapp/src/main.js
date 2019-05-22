import Vue from 'vue'
import Main from './Main.vue'
import router from './routes.js'
import { formatDate } from './utils/formatDate'
import { formatNumber } from './utils/formatNumber'
import ECharts from 'vue-echarts'
import "echarts-liquidfill"
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/radar'
import iView from 'iview';
import 'iview/dist/styles/iview.css';


/** 获取main.bundle.js文件由src属性传递过来的参数（即：主文件参数传入）**/
// ?config={isUseBusinessChartModule:true, businessChartModuleConfig:{sgm:{dataUrl:'/api/dashboard/data', getAppsUrl:'/apps?type=alias', getServicesUrl:'/service/get_list', getMethodsUrl:'/method/get_list', getLegendsUrl:'/dashboard/legends',customAdd:'/custom/add',customUpdate:'/custom/update', getCustom:'/dashboard'}}}
const sysMain = [... document.getElementsByTagName('script')].find(x=>(x.src && x.src.indexOf('main')) !== -1);
const sysConfig = decodeURI(sysMain.src.split('config=')[1]);
let argsOption = {};
if(sysConfig){
    argsOption = eval('(' + sysConfig + ')');
    console.debug("==main args==",argsOption);
}
const defaultOption = {
    isUseIndexedDB:true,           //是否使用前端数据库，用于存放页面配置（如为false用户需自实现RESTFUL接口"/grids"、"/pages"）
    isUseBusinessChartModule:true, //是否使用企业定制开发的内置图表（为true时用户需自行开发相应图表）
    businessChartModuleConfig:{
        sgm:{
            dataUrl:"/dashboard/data",
            getAppsUrl:"/apps?type=alias",
            getServicesUrl:"/service/get_list",
            getMethodsUrl:"/method/get_list",
            getLegendsUrl:"/dashboard/legends",
            customAdd:"/custom/add",
            customUpdate:"/custom/update",
            getCustom:"/dashboard"
        }
    } //定制开发的图表对外提供的参数配置（sgm为某一个内置图表，可自行扩展；isUseBusinessChartModule为false时，该参数可省略）
};
//对外接口传入的值,存入Vue作用域.
Vue.prototype.$DataDOption = Object.assign(defaultOption, argsOption);
//Vue扩展方法
Vue.prototype.$formatDate = formatDate;
Vue.prototype.$formatNumber = formatNumber;


// 注册组件后即可使用
Vue.component('chart', ECharts);
Vue.use(iView);
new Vue({
    el: "#DataD",
    router,
    render:h=>h(Main)
});