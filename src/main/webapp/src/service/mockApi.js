import Mock from 'mockjs'

//线、柱图测试数据
Mock.mock(/(charts\/data)/,function(options){
    console.log("---mock---",options);
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
    console.log("*********",result);
    return result
});


//饼图测试数据
Mock.mock(/(charts\/pie)/,function(options){
    console.log("---mock---",options);
    let series = {};
    let {legends,startTime,endTime} = JSON.parse(options.body);
    legends.forEach((legend)=>{
        series[legend] = Mock.Random.natural(0,1000);
    });
    return series;
});


//雷达图测试数据
Mock.mock(/(charts\/radar)/,function(options){
    console.log("---mock---",options);
    let series = {};
    let {legends,startTime,endTime} = JSON.parse(options.body);
    legends.forEach((legend)=>{
        series[legend] = [Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100),Mock.Random.natural(0,100)];
    });
    return series;
});