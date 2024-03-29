import linebar from "./linebar";

/**
 * bar 柱状图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '柱状图表',
                left: 'center',
                top: 10,
                subtext:''
            },
            tooltip: {},
            grid:{
                top: 40,
                bottom:40,
                left: 30,
                right: 40,
                containLabel: true
            },
            legend: {
                bottom:10,
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
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        },true);
        return eCharts;
    },
    options(eCharts, paramsDevelop){
        linebar.options(eCharts, paramsDevelop);
    }
}