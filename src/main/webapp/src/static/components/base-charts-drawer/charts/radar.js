import common from "./common";

/**
 * radar 雷达图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '雷达图表',
                left: 'center',
                top: 10,
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
                data:['预算分配（Allocated Budget）','实际开销（Actual Spending）']
            },
            radar: {
                radius: "60%",
                indicator: [
                    { name: '销售（sales）', max: 6500},
                    { name: '管理（Administration）', max: 16000},
                    { name: '信息技术（Information Techology）', max: 30000},
                    { name: '客服（Customer Support）', max: 38000},
                    { name: '研发（Development）', max: 52000},
                    { name: '市场（Marketing）', max: 25000}
                ]
            },
            series: [{
                type: 'radar',
                data : [
                    {
                        value : [4300, 10000, 28000, 35000, 50000, 19000],
                        name : '预算分配（Allocated Budget）'
                    },
                    {
                        value : [5000, 14000, 28000, 31000, 42000, 21000],
                        name : '实际开销（Actual Spending）'
                    }
                ]
            }]
        });
        return eCharts;
    },
    options(eCharts, paramsDevelop){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===radar===",option,config);
        let [_legendData, _seriesData] = [[],[]];
        _seriesData = config.api.legend.map(x=>{
            _legendData.push(x.legendTitle);
            return {
                value: [],
                name: x.legendTitle,
                itemStyle: {normal: {color: x.color}}
            }
        });
        option.title[0].text = config.title;
        option.legend[0].data = _legendData;
        option.series[0] = {
            type: 'radar',
            data : _seriesData
        };
        option.radar[0].indicator =  config.api.indicator;
        eCharts.setOption(option,true);
        eCharts.extend = this;

        let params = Object.assign({legends:_legendData, startTime:"", endTime:""}, paramsDevelop);
        let Common = Object.assign({},common);
        Common.start(eCharts, config.url||"/charts/radar", params, config.interval)(data =>{
            console.debug("===成功=radar==",data);
            _seriesData.forEach(x=> x.value = data[x.name]);
            option.series[0].data = _seriesData;
            eCharts.setOption(option);
            eCharts.hideLoading();
        });
    }
}