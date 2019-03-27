import Mock from 'mockjs'

Mock.mock(/(aa\/test)/,'get',function(options){
    console.log("---mock---",options);
    return Mock.Random.natural(0,100)/100
});
