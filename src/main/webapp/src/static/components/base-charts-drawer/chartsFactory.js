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
        let chartDataId = this.chartElement.getAttribute("data-id");
        let eCharts = echarts.init(this.chartElement, 'dark');
        let chart = require("./charts/"+chartDataId);
        chart.default.init(eCharts);
        return instance.resize();
    };

    /**
     * 设置图表宽高自适应
     * @param gswElement
     */
    instance.resize= (gswElement)=>{
        if(!gswElement){
            gswElement = this.chartElement.parentNode.parentNode;
        }
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
        return instance;
    };

    /**
     * 销毁释放图表
     * @param chartTempletElement
     */
    instance.destroy= ()=>{
        let eCharts = echarts.getInstanceByDom(this.chartElement);
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