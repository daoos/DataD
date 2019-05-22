import * as baseCharts from "../../base-charts-drawer/charts";

/**
 * 性能监控图（线柱组合图）
 */
export default{
    init(eCharts,theme,baseChartType="linebar"){
        if(baseChartType==null || baseChartType=="linebar"){
            eCharts.setOption({
                backgroundColor:"transparent",
                title: {
                    text: '性能监控图',
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
                    data:['成功数','失败数','成功率']
                },
                xAxis: {
                    axisLine:{show:false},
                    data: ["00:00","00:01","00:02","00:03","00:04","00:05"]
                },
                yAxis: [
                    {axisLine:{show:false}},
                    {axisLine:{show:false}}
                ],
                series: [{
                    name: '成功数',
                    type: 'bar',
                    data: [3, 10, 18, 5, 5, 10],
                    stack: '总'
                },{
                    name: '失败数',
                    type: 'bar',
                    data: [3, 10, 18, 5, 5, 10],
                    stack: '总'
                },{
                    name: '成功率',
                    type: 'line',
                    data: [6, 20, 36, 10, 10, 20],
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    }
                }]
            });
            return eCharts;
        }else{
            return baseCharts[baseChartType].init(eCharts);
        }
    },
    options(eCharts, paramsDevelop={}){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===SGM===",option,config,paramsDevelop);
        Object.assign(paramsDevelop,{app:config.app, service:config.service, method:config.method, chartType:config.baseChartType});
        baseCharts[config.baseChartType].options(eCharts,paramsDevelop);
        eCharts.extend = this;
    }
}