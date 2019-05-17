import Mock from 'mockjs'

/****==========================常规图表测试数据API===============================****/
//线、柱图测试数据
Mock.mock(/(demo\/charts\/linebar)/,function(options){
    console.debug("---mock---",options);
    let result = { series: {}, xAxis:[] };
    let {legends,duration,startTime,endTime} = JSON.parse(options.body);
    legends.forEach((legend)=>{
        result.series[legend] = [];
    });

    let nowSecond = Date.now();
    if(!startTime){
        startTime = parseInt(nowSecond/1000) - duration * 150;
    }else{
        startTime += duration;
    }
    if(!endTime){
        endTime = parseInt(nowSecond/1000);
    }
    for(let i=startTime; i<=endTime; i++){
        if(i%duration == 0){
            Object.keys(result.series).forEach(key=>{
                result.series[key].push(parseInt(Math.random()*1024)*1024 +1);
            });
            result.xAxis.push(i);
        }
    }
    return result;
});

//饼图测试数据
Mock.mock(/(demo\/charts\/pie)/,function(options){
    console.debug("---mock---",options);
    let series = {};
    let {legends,startTime,endTime} = JSON.parse(options.body);
    legends.forEach((legend)=>{
        series[legend] = Mock.Random.natural(0,1000);
    });
    return {series: series};
});

//雷达图测试数据
Mock.mock(/(demo\/charts\/radar)/,function(options){
    console.debug("---mock---",options);
    let series = {};
    let {legends,startTime,endTime} = JSON.parse(options.body);
    legends.forEach((legend)=>{
        series[legend] = [Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100)];
    });
    return {series: series};
});

//水位图测试数据
Mock.mock(/(demo\/charts\/liquidfill)/,function(options){
    console.debug("---mock---",options);
    let {startTime,endTime} = JSON.parse(options.body);
    let result = {
        series:Mock.Random.natural(30,100)/100
    };
    return result;
});

//数据滚动图测试数据
Mock.mock(/(demo\/charts\/number)/,function(options){
    /*数据滚动图
    {
      "series":2342
    }
    */
    console.debug("---mock---",options);
    let result = {
        series:"+"+Mock.Random.natural(100, 1000000000)+"."+Mock.Random.natural(10, 99)
    };
    return result;
});

//拓扑图测试数据
Mock.mock(/(demo\/charts\/topo)/,function(options){
    /*数据滚动图: alarmlevel: 0 - 3
   {
       "series":[
            {id:'A', alarmlevel:0, items:[{name:'TPS',value:123},{name:'AVG',value:456}]},
            {id:'B', alarmlevel:2, items:[{name:'TPS',value:123},{name:'AVG',value:456}]},
        ]
   }
   */
    console.debug("---mock---",options);
    let {legends,startTime,endTime} = JSON.parse(options.body);
    let result = {
        "series":[]
    };
    legends.forEach(id =>{
        let _items = [];
        for(let i=0;i<Mock.Random.natural(0, 10);i++){
            _items.push({name:Mock.Random.string('upper',1,5),value:Mock.Random.natural(10, 10000)});
        }
        result.series.push({id:id, alarmlevel:Mock.Random.natural(0, 3), items:_items});
    });
    return result;
});

//地图测试数据
Mock.mock(/(demo\/charts\/map)/,function(options){
    /*地图:
   {
       "series":[
            {name:"北京", value:100},
            {name:"长沙", value:60},
            {name:"上海", value:98, to:"北京"},
            {name:"广州", value:90, to:"北京"},
            {name:"深圳", value:75, from:"北京"},
            {name:"武汉", value:60, from:"上海"}
        ]
   }
   */
    console.debug("---mock---",options);
    function getValue(){
        return Mock.Random.natural(0, 100);
    };
    let {startTime,endTime,max,min} = JSON.parse(options.body);
    let series  = Mock.mock({
        "series|5-22": [
            {
                "name|+1": [
                    "北京",
                    "上海",
                    "广州",
                    "深圳",
                    "杭州",
                    "武汉",
                    "长沙",
                    "成都",
                    "重庆",
                    "拉萨",
                    "黑龙江",
                    "吉林",
                    "沈阳",
                    "海口",
                    "呼和浩特",
                    "乌鲁木齐",
                    "西安",
                    "贵阳",
                    "南京",
                    "天津",
                    "银川",
                    "长春",
                ],
                "value|1-100":1,
                "to|1": [
                    "北京",
                    "上海",
                    "广州",
                    "深圳"
                ],
            }
        ]
    });
    return series;
});


/****==============================性能监控===========================****/
//应用列表
Mock.mock(/(demo\/apps)/,function(options){
    let [body,type] = [options.body, options.type];
    console.debug("---mock---",options);
    let result = {
        PTG: "PTA(支付网关)",
        PTM: "PTB(核心mock)",
        PTRG: "PTC(退款网关)"
    };
    return result;
});

//服务列表
Mock.mock(/(demo\/services)/,function(options){
    let [body,type] = [options.body, options.type];
    console.debug("---mock---",options);
    let result = [
        "com.api.AccFrozenAndUnfrozenFacade"
    ];
    return result;
});

//方法列表
Mock.mock(/(demo\/methods)/,function(options){
    let [body,type] = [options.body, options.type];
    console.debug("---mock---",options);
    let result = [{"id":4849105,"appName":"PTG","serviceName":"com.jdacc.api.AccFrozenAndUnfrozenFacade","className":"com.jdacc.api.AccFrozenAndUnfrozenFacade","methodName":"unfrozen(java.lang.String,java.lang.String,java.lang.String)","methodAlias":null,"codePath":null,"msgPath":null,"succCode":null,"failCode":null,"exData":null,"topics":null,"subscription":null,"timeout":2147483647,"status":8,"configType":3,"endPoint":false,"enabled":true,"argShot":null,"mdCode":"0592388acf9c83980d084f36b087955c","rpc":"C","lastModifiedUser":"system","lastModifiedTime":"2017-08-21T16:34:52.000+0000","waterLevelThreshold":0.0,"waterLevelCalc":3571.0,"waterLevelUsed":0,"capacityLastCalcTime":"2017-08-21T16:34:52.000+0000","capacityChokePoint":"thread","modifiedTime":"2017-08-21T16:34:51.000+0000","createdTime":"2017-04-20T10:12:48.000+0000","methodIcon":null,"configTypeName":"sf","rpcClient":true,"enhanced":false,"type":"sf"},{"id":5579371,"appName":"PTG","serviceName":"com.jdacc.api.AccFrozenAndUnfrozenFacade","className":"com.jdacc.api.AccFrozenAndUnfrozenFacade","methodName":"unfrozenToPay(java.lang.String,java.lang.String,java.lang.String)","methodAlias":null,"codePath":null,"msgPath":null,"succCode":null,"failCode":null,"exData":null,"topics":null,"subscription":null,"timeout":2147483647,"status":8,"configType":3,"endPoint":false,"enabled":true,"argShot":null,"mdCode":"238d4756d1dd3d711860f072e1aa3d22","rpc":"C","lastModifiedUser":null,"lastModifiedTime":"2017-08-10T02:16:07.000+0000","waterLevelThreshold":0.0,"waterLevelCalc":0.0,"waterLevelUsed":0,"capacityLastCalcTime":null,"capacityChokePoint":null,"modifiedTime":"2017-08-10T02:16:06.000+0000","createdTime":"2017-05-05T02:23:20.000+0000","methodIcon":null,"configTypeName":"sf","rpcClient":true,"enhanced":false,"type":"sf"},{"id":4834455,"appName":"PTG","serviceName":"com.jdacc.api.AccFrozenAndUnfrozenFacade","className":"com.jdacc.api.AccFrozenAndUnfrozenFacade","methodName":"frozen(java.lang.String,java.lang.String,java.lang.String)","methodAlias":null,"codePath":null,"msgPath":null,"succCode":null,"failCode":null,"exData":null,"topics":null,"subscription":null,"timeout":2147483647,"status":8,"configType":3,"endPoint":false,"enabled":true,"argShot":null,"mdCode":"4c6fdd1a54b0eb98b90f1cc73557ee31","rpc":"C","lastModifiedUser":null,"lastModifiedTime":"2017-08-10T02:16:07.000+0000","waterLevelThreshold":0.0,"waterLevelCalc":0.0,"waterLevelUsed":0,"capacityLastCalcTime":null,"capacityChokePoint":null,"modifiedTime":"2017-08-10T02:16:06.000+0000","createdTime":"2017-04-20T10:06:12.000+0000","methodIcon":null,"configTypeName":"sf","rpcClient":true,"enhanced":false,"type":"sf"}];
    return result;
});

//获取指标
Mock.mock(/(demo\/supplyconfig)/,function(options){
    let [body,type] = [options.body, options.type];
    console.debug("---mock---",options);
    let result = ["TPS","AVG","TP","TP999"];
    return result;
});