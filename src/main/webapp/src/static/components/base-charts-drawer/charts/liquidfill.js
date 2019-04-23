import common from "./common";

/**
 * liquidFill 水位图
 */
export default{
    defaultColor:"#dd6b66",
    init(eCharts){
        if(eCharts._theme){
            this.defaultColor = eCharts._theme.color[0];
        }
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '水位图表',
                left: 'center',
                top: 10,
            },
            tooltip: {},
            grid:{
                top: 70,
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
                color: [this.defaultColor],
                backgroundStyle: {
                    borderWidth: 10,
                    color:'rgba(200, 200, 200, .2)',
                    shadowColor: 'rgba(0, 0, 0, .4)',
                    shadowBlur: 15,
                    borderColor: this.defaultColor
                },
                label: {
                    fontSize: 50,
                    fontFamily: 'Lobster Two',
                    color: this.defaultColor
                },
                shape:"circle",
                data: [0.5],
            }]
        });
        return eCharts;
    },
    options(eCharts, paramsDevelop){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===liquidFill===",option,config);
        let [_color, _seriesType, _seriesData] = [config.api.color||this.defaultColor, config.api.seriesType, [0]]
        option.title[0].text = config.title;
        Object.assign(option.series[0],{data:_seriesData, shape:_seriesType, color:[_color]});
        option.series[0].label.color = _color;
        option.series[0].backgroundStyle.borderColor = _color;
        eCharts.setOption(option);
        eCharts.extend = this;

        let params = Object.assign({startTime:"", endTime:""}, paramsDevelop);
        let Common = Object.assign({},common);
        Common.start(eCharts, config.url||"/charts/liquidfill", params, config.interval)((data, isSeries=true) =>{
            console.debug("===成功=liquidFill==",data);
            option.series[0].data = [data];

            eCharts.setOption(option);
            eCharts.hideLoading();
        });
    }
}