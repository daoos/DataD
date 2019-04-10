import axios from "axios";
require('../../../../service/serverApi');

/**
 * 公共代码
 */
export default{
    requestCount:0,

    start(chart, url, params, asynInterval=3){
        this.requestCount++;
        this.stop(chart);
        let isSeries = true;
        return (callback)=>{
            axios.post(url, params).then(response =>{
                callback(response.data);
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