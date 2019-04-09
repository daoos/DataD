import linebar from "./linebar";

/**
 * line 线状图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '线状图表',
                left: 'center'
            },
            tooltip: {},
            grid:{
                top: 60,
                bottom:40,
                left: 40,
                right: 40,
                containLabel: true
            },
            legend: {
                top:30,
                itemWidth:14,
                itemHeight:6,
                data:['销量']
            },
            xAxis: [{
                axisLine:{show:false},
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            }],
            yAxis: [
                {axisLine:{show:false}},
                {axisLine:{show:false}}
            ],
            series: [{
                name: '销量',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });
    },
    options(eCharts){
        linebar.options(eCharts);
    }
}