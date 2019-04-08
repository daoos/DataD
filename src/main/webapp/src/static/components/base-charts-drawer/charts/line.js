import echarts from 'echarts'
import {chartData} from '../../../../service/serverApi'
import {formatDate} from '../../../../utils/formatDate'


const SecondReg = new RegExp("^1(\\d){9}$"),
       MillisecondReg = new RegExp("^1(\\d){12}$");
/**
 * line 线状图
 */
export default{
    isOverallSeries:true,
    windowDuration: 150, //图表窗口数据点数
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: 'ECharts 入门示例',
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
                data:['销量']
            },
            xAxis: [{
                axisLine:{show:false},
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"],
                _srcData: []
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
    options(eCharts, config){
        let option = eCharts.getOption();
        console.log("=====",option,config);
        let _legendData=[], _series=[], _yAxisIndexSet = new Set();
        option.title[0].text = config.title;
        config.api.forEach(x=> {
            let _seriesType = x.seriesType.split("_");
            _yAxisIndexSet.add(x.unit);
            _legendData.push(x.legendTitle);
            _series.push(Object.assign({
                name: x.legendTitle,
                unit: x.unit,
                yAxisIndex: [..._yAxisIndexSet].findIndex(v=> {
                    return v == x.unit;
                }),
                type: _seriesType[0],
                itemStyle: {normal: {color: x.color}},
                data: []
            },(+_seriesType[1]?{
                stack:_seriesType[1],
                areaStyle:{normal: {}}
            }:{})));
        });
        option.legend[0].data = _legendData;
        option.series = _series;
        eCharts.setOption(option);

        this.stop(eCharts);
        eCharts.showLoading();
        this.start(
            Object.assign(eCharts,{refurbishMode:config.refurbishMode, requestCount:1, timeout:null}),
            {legends:_legendData, duration:config.interval, startTime:"", endTime:""},
            config.interval
        );
    },
    start(chart, data, asynInterval=4) {
        let _this = this;
        let isSeries = _this.isOverallSeries;
        if(data.startTime!="" && data.endTime!=""){
            isSeries = false;
        }
        chartData(data).then((response)=>{
            let result = response.data;
            if(result){
                let _common = _this.common(chart, result)
                    .setSeries(isSeries)
                    .setAxis()
                    .setXAxisSeriesLen(isSeries)
                    .setYAxisFormatter()
                    .setSeriesTooltip()
                    .setRequestParameter(data);
                chart.setOption(_common.options);
                chart.hideLoading();
                chart.requestCount++;
            }
        }).finally(()=>{
            if(isSeries){
                chart.timeout = setTimeout(function () {
                    _this.start(chart, data, asynInterval);
                },Math.ceil(asynInterval)*1000);
            }
        });
    },
    stop(chart) {
        window.clearTimeout(chart.timeout);
    },
    common(chart, result) {
        let _this = this;
        let _wd = _this.windowDuration,
            _isCover = chart.refurbishMode,
            option = chart.getOption();
        let [seriesData, xAxisData, legends, xAxis, yAxis, series] = [result.series, result.xAxis, option.legend[0], option.xAxis[0],option.yAxis, option.series];
        return {
            options:option,
            //设置图中数据
            setSeries(isSeries){
                if(_isCover=="cover"){
                    /**数据覆盖 cover**/
                    if(seriesData && series && series.length > 0){
                        series.forEach(elem=>{
                            elem.data = seriesData[elem.name];
                        });
                    }
                }else{
                    /**数据追加 add**/
                    //对每条线数据进行最后一个时间点的验证( 其中任意一条线最后一个时间点为0者，则抛弃所有线最后一个点 ;原因1：由于同一时间点每条线写到Cassandra时存在延时)
                    if(isSeries) {
                        let legendData = legends.data;
                        for(let i in legendData){
                            let line = seriesData[legendData[i]];
                            if(xAxisData.length>0 && line && line.length>0 && line[line.length - 1]==0){
                                legendData.forEach(elem=>{
                                    if(seriesData[elem]) seriesData[elem].pop();
                                });
                                xAxisData.pop();
                                break;
                            }
                        }
                    }
                    //补全数据
                    if(seriesData && series){
                        series.forEach(elem=>{
                            elem.data.push.apply(elem.data, seriesData[elem.name]);
                        });
                    }
                }
                return this;
            },
            //设置图的x、y坐标的值
            setAxis(){
                if(xAxisData && xAxisData.length > 0){
                    if(_isCover=="cover"){
                        //数据覆盖 cover
                        xAxis.data = xAxisData;
                    }else{
                        //数据追加 add
                        let _xAxis = xAxis.data, srcXAxisData = xAxis._srcData;
                        _xAxis.push.apply(_xAxis, xAxisData.map(elem=>{
                            if(SecondReg.test(elem)){ //只对时间戳进行处理
                                return formatDate(+`${elem}000`,"hh:mm:ss") //秒
                            }else if(MillisecondReg.test(elem)){
                                return formatDate(elem,"hh:mm:ss") //毫秒
                            }
                            return elem;
                        }));
                        srcXAxisData.push.apply(srcXAxisData, xAxisData.map(elem=>{return elem;}));
                    }
                }
                return this;
            },
            //设置series的最大长度
            setXAxisSeriesLen(isSeries){
                if(isSeries){
                    if(xAxis && xAxis.data.length > _wd){
                        xAxis.data.splice(0, xAxis.data.length - _wd);
                        xAxis._srcData.splice(0, xAxis._srcData.length - _wd);
                    }
                    if(series){
                        series.forEach(elem=>{
                            if(elem && elem.data && elem.data.length > _wd){
                                elem.data.splice(0,elem.data.length - _wd);
                            }
                        });
                    }
                }
                return this;
            },
            //设置个指标（每条线）数值的单位以及倒序排序
            setSeriesTooltip(){
                option.tooltip = {
                    trigger: 'axis',
                    formatter:function (params) {
                        let res = "";
                        try{
                            let len=params.length, tmp;
                            for(let i=0;i<len-1;i++){
                                for(let j=0;j<len-1-i;j++){
                                    if((typeof(params[j].value)=="undefined"?-1:params[j].value) < (typeof(params[j+1].value)=="undefined"?-1:params[j+1].value)){
                                        tmp = params[j];
                                        params[j] = params[j+1];
                                        params[j+1] = tmp;
                                    }
                                }
                            }
                            res = params[0].name+'<br/>';
                            for(let i=0;i<12;i++){
                                let param = params[i], seriesName = param.seriesName, val = param.value;
                                if(!isNaN(val)){
                                    res += `<div style='text-align:left;'><span style='background-color:${param.color};display:inline-block;width:10px;height:10px;border-radius:10px;margin-right:5px;'></span>${seriesName}:${val}</div>`;
                                }
                            }
                        }catch(e){}
                        return res;
                    }
                };
                return this;
            },
            //设置纵坐标轴上数据单位
            setYAxisFormatter(){
                //如果图表中的线出现两种以上类型单位时，取自然数单位（后期可优化为出左右两数轴）
                series.forEach(x=>{
                    let axis = yAxis[x.yAxisIndex];
                    let unitType = x.unit;
                    if(axis && axis.show == true){
                        if(!axis.axisLabel) {
                            axis.axisLabel = {};
                        }
                        if(unitType==2){  //流量
                            axis.axisLabel.formatter = function(val) {
                                if(val > 0){
                                    if(val/1024/1024/1024/1024 >= 1){
                                        return (val/1024/1024/1024/1024).toFixed(1) + 'Tbps';
                                    }else if(val/1024/1024/1024 >= 1){
                                        return (val/1024/1024/1024).toFixed(1) + 'Gbps';
                                    }else if(val/1024/1024 >= 1){
                                        return (val/1024/1024).toFixed(1) + 'Mbps';
                                    }else if(val/1024 >= 1){
                                        return (val/1024).toFixed(1) + 'Kbps';
                                    }
                                }
                                return val;
                            }
                        }else if(unitType==3){ //百分比
                            axis.axisLabel.formatter = function(val) {
                                return val + " %";
                            }
                        }else if(unitType==1){   //时间
                            axis.axisLabel.formatter = function(val) {
                                if(val > 0){
                                    if(val / 3600000 >= 1){
                                        return (val / 3600000).toFixed(0) + ' H';
                                    } else if(val / 60000 >= 1){
                                        return (val / 60000).toFixed(0) + ' M';
                                    } else if(val / 1000 >= 1){
                                        return (val / 1000).toFixed(0) + ' S';
                                    } else{
                                        return val + " ms";
                                    }
                                }
                                return val;
                            }
                        }else{  //数值
                            axis.axisLabel.formatter = function(val) {
                                if(val > 0){
                                    if(val/100000000 >= 1){
                                        return (val/100000000).toFixed(0) + '亿';
                                    } else if(val/10000 >= 1){
                                        return (val/10000).toFixed(0) + '万';
                                    }
                                }
                                return val;
                            }
                        }
                    }
                });
                return this;
            },
            //设置图表附标题（日期）
            setTitleSubtext(startTime, endTime, duration){
                let startDate, endDate;
                if(startTime && endTime){
                    [startDate,endDate] = [formatDate(startTime*1000,'yyyy/MM/dd'), formatDate(endTime*1000,'yyyy/MM/dd')];
                }else{
                    if(!startTime){
                        endDate = parseInt(Date.now()/1000);
                    }else{
                        endDate = parseInt(startTime) + parseInt(duration);
                    }
                    startDate = formatDate((endDate-duration * (option.xAxis.data.length-1))*1000,'yyyy/MM/dd');
                    endDate = formatDate(endDate*1000,'yyyy/MM/dd');
                }
                if(duration<=86400){
                    option.title.subtext=(startDate==endDate?endDate:`${startDate} - ${endDate}`);
                }
                return this;
            },
            //设置请求参数
            setRequestParameter(data){
                if(_isCover=="add") {
                    let _xAxis = xAxisData;
                    if (_xAxis.length > 0) {
                        data.startTime = _xAxis.slice(-1).length > 0 ? _xAxis.slice(-1)[0] : "";
                    }
                }
                return this;
            },
            //鼠标点击
            setClickEvent(){
                return this;
            },
            //其它设置
            setOther(){
                return this;
            }
        }
    },
}