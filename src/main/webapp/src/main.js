import Vue from 'vue'
import Main from './Main.vue'
import router from './routes.js'

import {formatDate} from './utils/formatDate'
import {formatNumber} from './utils/formatNumber'
import ECharts from 'vue-echarts'
import "echarts-liquidfill"
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/pie'
import 'echarts/lib/chart/radar'
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.prototype.$formatDate = formatDate;
Vue.prototype.$formatNumber = formatNumber;

// 注册组件后即可使用
//ECharts.registerTheme('dark', {});
Vue.component('chart', ECharts);

Vue.use(iView);

new Vue({
    el: "#app",
    router,
    render:h=>h(Main)
});