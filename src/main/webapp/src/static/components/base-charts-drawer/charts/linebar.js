import echarts from 'echarts';

/**
 * linebar 线柱组合图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            legend: {
                data:['销量','总量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            },{
                name: '总量',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });

    }
}