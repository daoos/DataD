import common from "./common";
import {formatDate} from "../../../../utils/formatDate";

const [SecondReg, MillisecondReg] = [new RegExp("^1(\\d){9}$"), new RegExp("^1(\\d){12}$")];

/**
 * linebar 线柱组合图
 */
export default{
    init(eCharts){
        eCharts.setOption({
            backgroundColor:"transparent",
            title: {
                text: '线柱状图表',
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
                data:['销量','总量']
            },
            xAxis: {
                axisLine:{show:false},
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: [
                {axisLine:{show:false}},
                {axisLine:{show:false}}
            ],
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            },{
                name: '总量',
                type: 'line',
                data: [5, 20, 36, 10, 10, 20],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                }
            }]
        },true);
        return eCharts;
    },
    options(eCharts, paramsDevelop){
        let [option, config] = [eCharts.getOption(), eCharts.myConfig];
        console.debug("===linebar===",option,config);
        let [_legendData, _series, _yAxisIndexSet] = [[],[],new Set()];
        JSON.parse(config.api).forEach(x=> {
            let _seriesType = x.seriesType.split("_");
            let _markPoint = _seriesType[0]=="line"?{
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }:"";
            _yAxisIndexSet.add(x.unit);
            _legendData.push(x.legendTitle);
            _series.push(Object.assign({
                unit: x.unit,
                name: x.legendTitle,
                type: _seriesType[0],
                itemStyle: {normal: {color: x.color}},
                yAxisIndex: [..._yAxisIndexSet].findIndex(y=>y==x.unit),
                data: [],
                markPoint: _markPoint
            },(+_seriesType[1]?{
                stack:_seriesType[1],
                areaStyle:{normal: {}},
                markPoint:{}
            }:{})));
        });
        option.xAxis[0].data = [];
        option.title[0].text = config.title;
        option.legend[0].data = _legendData;
        option.series = _series;
        eCharts.setOption(option,true); //第二个参数true == notMerge
        eCharts.extend = this;  //将当前出图逻辑.js配置加入到图表对象中（便于后面操作）

        let xAxisFormat = {format:"hh:mm:ss"};
        let params = Object.assign({legends:_legendData, duration:config.interval, startTime:"", endTime:""}, paramsDevelop);
        params.duration = params.duration||config.interval;
        let Common = Object.assign({},common);
        Common.start(eCharts, config.url||"/demo/charts/linebar", params, config.interval)((result, isSeries=true) =>{
           console.debug(isSeries,"===成功=linebar==",result);
           if(result){
               let _comm = this._common(eCharts, result, Common.requestCount)
                   .setSeries(isSeries)
                   .setAxis(xAxisFormat)
                   .setXAxisSeriesLen(isSeries)
                   .setYAxisFormatter()
                   .setSeriesTooltip()
                   .setTitleSubtext(params.startTime, params.endTime, params.duration,isSeries)
                   .setRequestParameter(params);
               eCharts.setOption(_comm.options);
               eCharts.hideLoading();
           }
        });
    },

    _common(chart, result, requestCount, windowDuration = 75) { //windowDuration:图表窗口显示数据点数
        let [_isCover, option] = [chart.myConfig.refurbishMode, chart.getOption()];
        let [seriesData, xAxisData, legends, xAxis, yAxis, series] = [result.series, result.xAxis, option.legend[0], option.xAxis[0], option.yAxis, option.series];
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
            setAxis(xAxisFormat){
                if(xAxisData && xAxisData.length > 0){
                    let dateFormatTransf = ()=>{
                        //只对时间戳进行处理
                        if(requestCount==1){
                            let yyyy = new Set(),MM = new Set(),dd = new Set(), HH = new Set(), mm = new Set(), ss = new Set(), _yyyy="",_MM="",_dd="",_HH="",_mm="",_ss="";
                            xAxisData.forEach(elem =>{
                                let dateTime = new Date(+(SecondReg.test(elem)?elem+`000`:elem));
                                yyyy.add( dateTime.getFullYear() );
                                MM.add( dateTime.getMonth()+1 );
                                dd.add( dateTime.getDate() );
                                HH.add( dateTime.getHours() );
                                mm.add( dateTime.getMinutes() );
                                ss.add( dateTime.getSeconds() );
                            });
                            if(yyyy.size>1) _yyyy = "yyyy/";
                            if(MM.size>1) _MM = "MM/";
                            if(dd.size>1) _dd = "dd";
                            if(HH.size>1) _HH = " hh";
                            if(mm.size>1) _mm = ":mm";
                            if(ss.size>1) _ss = ":ss";
                            xAxisFormat.format=_yyyy+_MM+_dd+_HH+_mm+_ss;
                            if(xAxisFormat.format==" hh:mm"){
                                xAxisFormat.format = "hh:mm:00";
                            }else if(xAxisFormat.format==":mm:ss" || xAxisFormat.format==":mm" || xAxisFormat.format==":ss"){
                                xAxisFormat.format = "hh:mm:ss";
                            }
                        }
                        return xAxisData.map(elem=>{
                            if(SecondReg.test(elem)){
                                return formatDate(+`${elem}000`,xAxisFormat.format) //秒
                            }else if(MillisecondReg.test(elem)){
                                return formatDate(elem,xAxisFormat.format) //毫秒
                            }
                            return elem;
                        });
                    };
                    if(_isCover=="cover"){
                        //数据覆盖 cover
                        if(SecondReg.test(xAxisData[0]) || MillisecondReg.test(xAxisData[0])){
                            xAxis.data = dateFormatTransf();
                        }else{
                            xAxis.data = xAxisData;
                        }
                    }else{
                        //数据追加 add
                        let _xAxis = xAxis.data;
                        if(SecondReg.test(xAxisData[0]) || MillisecondReg.test(xAxisData[0])){
                            _xAxis.push.apply(_xAxis, dateFormatTransf());
                        }else{
                            _xAxis.push.apply(_xAxis, xAxisData);
                        }
                    }
                }
                return this;
            },
            //设置series的最大长度
            setXAxisSeriesLen(isSeries){
                if(isSeries){
                    if(_isCover!="cover"){
                        /**数据追加 add**/
                        if(xAxis && xAxis.data.length > windowDuration){
                            xAxis.data.splice(0, xAxis.data.length - windowDuration);
                        }
                        if(series){
                            series.forEach(elem=>{
                                if(elem && elem.data && elem.data.length > windowDuration){
                                    elem.data.splice(0,elem.data.length - windowDuration);
                                }
                            });
                        }
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
            setTitleSubtext(startTime, endTime, duration,isSeries){
                if(!isSeries){
                    let startDate, endDate;
                    if(startTime && endTime){
                        [startDate,endDate] = [formatDate(startTime*1000,'yyyy/MM/dd'), formatDate(endTime*1000,'yyyy/MM/dd')];
                    }else{
                        if(!startTime){
                            endDate = parseInt(Date.now()/1000);
                        }else{
                            endDate = parseInt(startTime) + parseInt(duration);
                        }
                        startDate = formatDate((endDate-duration * (xAxis.data.length-1))*1000,'yyyy/MM/dd');
                        endDate = formatDate(endDate*1000,'yyyy/MM/dd');
                    }
                    if(duration<=86400){
                        option.title[0].subtext=(startDate==endDate?endDate:`${startDate} - ${endDate}`);
                    }
                }else{
                    option.title[0].subtext="";
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
    }
}