import echarts from 'echarts';
import shine from 'echarts/theme/shine';
import infographic from 'echarts/theme/infographic';
import macarons from 'echarts/theme/macarons';
import roma from 'echarts/theme/roma';
import vintage from 'echarts/theme/vintage';

/**
 * 调用生成图表入口函数（图表工厂类）
 * @param chartJq
 * @constructor
 */
export function ChartsFactory(){
    const instance = {};

    /**
     * 初始化指定图表
     * @param theme
     */
    instance.init= (theme)=>{
        this.chartElement.innerHTML = "";
        if(!theme){
            let curTheme = sessionStorage.getItem("curTheme");
            theme = curTheme && JSON.parse(curTheme).theme;
        }
        let eCharts = null;
        let chartType = this.chartElement.getAttribute("data-id");
        let chart = require("./charts/" + chartType);
        let chartGroup = chart.default["group"];
        if(chartGroup==="MyCharts"){
            eCharts = this.chartElement;  // 自定义扩展图表
        }else{
            eCharts = echarts.init(this.chartElement, theme); // ECharts图表
        }
        this.chartElement["charts"] = chart.default.init(eCharts,theme); //将图表实例赋值到dom实例上(便于后面拿到dom就可以拿到对应图表实例)
        return instance.resize();
    };

    /**
     * 设置或获取图表原始配置
     * @param config
     * @returns {*}
     */
    instance.configs=(config)=>{
        let eCharts = this.chartElement.charts;
        if (!config) {
            let gswElement = this.chartElement.parentNode.parentNode;
            let dataLayout = +gswElement.getAttribute("data-l");
            if(eCharts.myConfig){
                return Object.assign(eCharts.myConfig,{layout:dataLayout});
            }
            return dataLayout;
        }
        let chart = require("./charts/" + this.chartElement.getAttribute("data-id"));
        eCharts.myConfig = config;
        chart.default.options(eCharts);
        return instance;
    };

    /**
     * 设置图表宽高自适应
     * @param gswElement
     */
    instance.resize= (gswElement)=>{
        if(!gswElement){
            gswElement = this.chartElement.parentNode.parentNode;
        }
        try{
           if(typeof(this.gswElementLayout)!="undefined"){
               gswElement.setAttribute("data-l",this.gswElementLayout);
           }
        }catch (e){}
        setTimeout(function(){ //延时执行等待echarts图表对象生成
            let chartElement = gswElement.querySelectorAll(".chart");
            chartElement.forEach(x=> {
                let [_height,_dataLayout] = [gswElement.clientHeight, gswElement.getAttribute("data-l")];
                if(_dataLayout==0){
                    _height = _height / chartElement.length;
                }else if(_dataLayout > 1){
                    _height = _height / Math.ceil(chartElement.length / _dataLayout);
                }
                x.style.height = _height+'px';
                //x.charts.resize();
            });
            chartElement.forEach(x=> {
                x.charts.resize();
            });
        });
        return instance;
    };

    /**
     * 销毁释放图表
     * @param chartTempletElement
     */
    instance.destroy= ()=>{
        let eCharts = this.chartElement.charts;
        window.clearTimeout(eCharts.timeout);
        eCharts.dispose();
        eCharts=null;
        let chartTemplet = this.chartElement.parentNode;
        let gswElement = chartTemplet.parentNode;
        chartTemplet.remove();
        chartTemplet = null;
        return instance.resize(gswElement);
    };

    /**
     * 统一设置全局图表参数（请求参数）
     * @param param
     */
    instance.settings= (param)=>{
        let charElements = document.querySelectorAll(".chart");
        charElements.forEach(x=> {
            let eCharts = x.charts;
            eCharts.extend.options(eCharts, param);
        });
    };

    return instance;
}