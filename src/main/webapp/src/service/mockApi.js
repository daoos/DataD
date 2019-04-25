import Mock from 'mockjs'

/****==============================格子模板API===========================****/
Mock.mock(/(grids)/,function(options){
    let [body,type] = [options.body, options.type];
    console.debug("---mock---",options,localStorage);
    let result = "";
    if(type=="POST"){ //增加
    }else if(type=="GET"){ //查询
    }
    return result;
});


/****==========================常规图表测试数据API===============================****/
//线、柱图测试数据
Mock.mock(/(charts\/linebar)/,function(options){
    console.debug("---mock---",options);
    let result = { series: {}, xAxis:[] };
    let {legends,duration,startTime,endTime} = options.body; //JSON.parse(options.body);
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
    return result
});

//饼图测试数据
Mock.mock(/(charts\/pie)/,function(options){
    console.debug("---mock---",options);
    let series = {};
    let {legends,startTime,endTime} = options.body; //JSON.parse(options.body);
    legends.forEach((legend)=>{
        series[legend] = Mock.Random.natural(0,1000);
    });
    return series;
});

//雷达图测试数据
Mock.mock(/(charts\/radar)/,function(options){
    console.debug("---mock---",options);
    let series = {};
    let {legends,startTime,endTime} = options.body; //JSON.parse(options.body);
    legends.forEach((legend)=>{
        series[legend] = [Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100)];
    });
    return series;
});

//水位图测试数据
Mock.mock(/(charts\/liquidfill)/,function(options){
    console.debug("---mock---",options);
    let {startTime,endTime} = options.body; //JSON.parse(options.body);
    let series = Mock.Random.natural(30,100)/100;
    return series;
});

//数据滚动图测试数据
Mock.mock(/(charts\/number)/,function(options){
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
Mock.mock(/(charts\/topo)/,function(options){
    /*数据滚动图: alarmlevel: 0 - 3
   {
       "series":[
            {id:'A', alarmlevel:0, items:'[{name:'TPS',value:123},{name:'AVG',value:456}]}',
            {id:'B', alarmlevel:2, items:[{name:'TPS',value:123},{name:'AVG',value:456}]},
        ]
   }
   */
    console.debug("---mock---",options);
    let {legends,startTime,endTime} = options.body; //JSON.parse(options.body);
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

