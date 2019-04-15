import common from "./common";

/**
 * pie 饼状图图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '饼状图表',
                left: 'center',
                top: 10,
            },
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            grid:{
                top: 70,
                bottom:40,
                left: 40,
                right: 40,
                containLabel: true
            },
            legend: {
                top:40,
                itemWidth:14,
                itemHeight:6,
                data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
            },
            series: [
                {
                    type:'pie',
                    radius: ['40%', '60%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'直接访问'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1548, name:'搜索引擎'}
                    ]
                }
            ]
        });
    },
    options(eCharts){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===pie===",option,config);
        let [_legendData, _seriesData] = [[],[]];
        _seriesData = config.api.map(x=> {
            _legendData.push(x.legendTitle);
            return {
                value: 0,
                name: x.legendTitle,
                itemStyle: {normal: {color: x.color}}
            }
        });
        option.title[0].text = config.title;
        option.legend[0].data = _legendData;
        option.series[0].data = _seriesData;
        eCharts.setOption(option);

        common.start(eCharts, config.url||"/charts/pie", {legends:_legendData, startTime:"", endTime:""}, config.interval)(data =>{
            console.debug("===成功=pie==",data);
            _seriesData.forEach(x=> x.value = data[x.name]);
            option.series[0].data = _seriesData;
            eCharts.setOption(option);
            eCharts.hideLoading();
        });
    }
}