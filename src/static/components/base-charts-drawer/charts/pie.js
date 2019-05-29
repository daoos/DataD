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
                        {value:548, name:'直接访问'},
                        {value:548, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:48, name:'搜索引擎'}
                    ]
                }
            ]
        },true);
        return eCharts;
    },
    options(eCharts, paramsDevelop){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===pie===",option,config);
        let [_legendData, _seriesData] = [[],[]];
        _seriesData = config.api.map(x=> {
            _legendData.push(x.legendTitle);
            return {
                value: undefined,
                name: x.legendTitle,
                itemStyle: {normal: {color: x.color}}
            }
        });
        option.title[0].text = config.title;
        option.legend[0].data = _legendData;
        option.series[0].data = _seriesData;
        eCharts.setOption(option);
        eCharts.extend = this;

        let params = Object.assign({legends:_legendData, duration:config.interval, startTime:"", endTime:""}, paramsDevelop);
        let Common = Object.assign({},common);
        Common.start(eCharts, config.url||"/demo/charts/pie", params, config.interval)(data =>{
            console.debug("===成功=pie==",data);
            if(data["series"]) {
                _seriesData.forEach(x => x.value = data["series"][x.name]);
                option.series[0].data = _seriesData;
                eCharts.setOption(option);
                eCharts.hideLoading();
            }
        });
    }
}