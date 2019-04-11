import common from "./common";

/**
 * liquidFill 水位图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '水位图表',
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
            series: [{
                type: 'liquidFill',
                radius: '60%',
                amplitude: 5,
                period: 1500,
                outline: {
                    show: false
                },
                color: ["#dd6b66"],
                backgroundStyle: {
                    borderWidth: 10,
                    color:'rgba(200, 200, 200, .2)',
                    shadowColor: 'rgba(0, 0, 0, .4)',
                    shadowBlur: 15,
                    borderColor: "#dd6b66"
                },
                label: {
                    fontSize: 50,
                    fontFamily: 'Lobster Two',
                    color: "#dd6b66"
                },
                shape:"circle",
                data: [0.5],
            }]
        });
    },
    options(eCharts){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===liquidFill===",option,config);
        let [_color, _seriesType, _seriesData] = [config.api.color||option.series[0].color, config.api.seriesType, [0]]
        option.title[0].text = config.title;
        Object.assign(option.series[0],{data:_seriesData, shape:_seriesType, color:[_color]});
        option.series[0].label.color = _color;
        option.series[0].backgroundStyle.borderColor = _color;
        eCharts.setOption(option);

        common.start(eCharts, config.url||"/charts/liquidfill", {startTime:"", endTime:""}, config.interval)(data =>{
            console.debug("===成功=liquidFill==",data);
            option.series[0].data = [data];
            eCharts.setOption(option);
            eCharts.hideLoading();
        });
    }
}