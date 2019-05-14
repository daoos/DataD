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

//Vue扩展方法
Vue.prototype.$formatDate = formatDate;
Vue.prototype.$formatNumber = formatNumber;
//对外接口传入的值,存入Vue作用域.
const defaultOption = {
    isUseIndexedDB:true,           //是否使用前端数据库，用于存放页面配置（如为false用户需自实现RESTFUL接口"/grids"、"/pages"）
    isUseBusinessChartModule:true, //是否使用定制开发的内置图表（为true时用户需自行开发相应图表）
    businessChartModuleConfig:{
        sgm:{
            dataUrl:"",
            getAppListUrl:undefined,
            getServiceListUrl:undefined,
            getMethodListUrl:undefined,
            getLegendListUrl:undefined
        }
    } //定制开发的图表对外提供的参数配置（sgm为某一个内置图表，可自行扩展；isUseBusinessChartModule为false时，该参数可省略）
};
Vue.prototype.$DataDOption = Object.assign(defaultOption, window.DataDOption);

// 注册组件后即可使用
Vue.component('chart', ECharts);
Vue.use(iView);
new Vue({
    el: "#DataD",
    router,
    render:h=>h(Main)
});