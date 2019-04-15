import echarts from 'echarts';

/**
 * 调用生成图表入口函数（图表工厂类）
 * @param chartJq
 * @constructor
 */
export function ChartsFactory(){
    const instance = {};

    /**
     * 初始化指定图表
     */
    instance.init= ()=>{
        this.chartElement.innerHTML = "";
        let eCharts = echarts.init(this.chartElement, 'dark');
        let chart = require("./charts/" + this.chartElement.getAttribute("data-id"));
        chart.default.init(eCharts);
        return instance.resize();
    };

    /**
     * 设置或获取图表原始配置
     * @param config
     * @returns {*}
     */
    instance.configs=(config)=>{
        let eCharts = echarts.getInstanceByDom(this.chartElement);
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
            let charElements = gswElement.querySelectorAll(".chart");
            charElements.forEach(x=> {
                let [_height,_dataLayout] = [gswElement.clientHeight, gswElement.getAttribute("data-l")];
                if(_dataLayout==0){
                    _height = _height / charElements.length;
                }else if(_dataLayout > 1){
                    _height = _height / Math.ceil(charElements.length / _dataLayout);
                }
                x.style.height = _height+'px';
                echarts.getInstanceByDom(x).resize();
            });
            charElements.forEach(x=> echarts.getInstanceByDom(x).resize());
        });
        return instance;
    };

    /**
     * 销毁释放图表
     * @param chartTempletElement
     */
    instance.destroy= ()=>{
        let eCharts = echarts.getInstanceByDom(this.chartElement);
        window.clearTimeout(eCharts.timeout);
        eCharts.dispose();
        eCharts=null;
        let chartTemplet = this.chartElement.parentNode;
        let gswElement = chartTemplet.parentNode;
        chartTemplet.remove();
        chartTemplet = null;
        return instance.resize(gswElement);
    };

    return instance;
}