import axios from "axios";
require('../../../../service/serverApi');

/**
 * 公共代码
 */
export default{
    requestCount:0,
    themes:[
        {id:"customed", colors: ["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a"]},
        {id:"dark",  colors: ["#dd6b66","#759aa0","#e69d87","#8dc1a9","#ea7e53","#eedd78","#73a373","#73b9bc"]},
        {id:"shine", colors: ["#c12e34","#e6b600","#0098d9","#2b821d","#005eaa","#339ca8","#cda819","#32a487"]},
        {id:"infographic", colors: ["#c1232b","#27727b","#fcce10","#e87c25","#b5c334","#fe8463","#9bca63","#fad860"]},
        {id:"macarons", colors: ["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552"]},
        {id:"roma", colors: ["#e01f54","#001852","#f5e8c8","#b8d2c7","#c6b38e","#a4d8c2","#f3d999","#d3758f"]},
        {id:"vintage", colors: ["#d87c7c","#919e8b","#d7ab82","#6e7074","#61a0a8","#efa18d","#787464","#cc7e63"]}
    ],

    start(chart, url, params, asynInterval=3){
        this.requestCount++;
        this.stop(chart);
        let isSeries = true;
        if(params["startTime"] && params["endTime"]){
            isSeries = false;
        }
        return (callback)=>{
            axios.post(url, params).then(response =>{
                callback(response.data, isSeries);
            }).finally(()=>{
                if(isSeries){
                    chart.timeout = setTimeout(()=>{
                        this.start(chart, url, params, asynInterval)(callback);
                    },Math.ceil(asynInterval)*1000);
                }
            });
        }
    },

    stop(chart) {
        if(this.requestCount==1){
            chart.showLoading(null, {
                text: 'loading',
                color: '#c23531',
                textColor: 'rgba(255, 255, 255, 1)',
                maskColor: 'rgba(0, 0, 0, .1)',
                zlevel: 0
            });
        }
        window.clearTimeout(chart.timeout);
    }
}