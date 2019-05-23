import jquery from "jquery";
import qs from 'qs';

/**
 * 公共代码
 */
export default{
    requestCount:0,
    themes:[
        {id:"customed", colors: ["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a"],titleColor:"#333333"},
        {id:"dark",  colors: ["#dd6b66","#759aa0","#e69d87","#8dc1a9","#ea7e53","#eedd78","#73a373","#73b9bc"],titleColor:"#eeeeee"},
        {id:"shine", colors: ["#c12e34","#e6b600","#0098d9","#2b821d","#005eaa","#339ca8","#cda819","#32a487"],titleColor:"#333333"},
        {id:"infographic", colors: ["#c1232b","#27727b","#fcce10","#e87c25","#b5c334","#fe8463","#9bca63","#fad860"],titleColor:"#27727b"},
        {id:"macarons", colors: ["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552"],titleColor:"#008acd"},
        {id:"roma", colors: ["#e01f54","#001852","#f5e8c8","#b8d2c7","#c6b38e","#a4d8c2","#f3d999","#d3758f"],titleColor:"#333333"},
        {id:"vintage", colors: ["#d87c7c","#919e8b","#d7ab82","#6e7074","#61a0a8","#efa18d","#787464","#cc7e63"],titleColor:"#333333"}
    ],

    aJax(url, params){
        return {
            defual(){
                // 1：默认内部域名访问
                return new Promise((resolve,reject)=>{
                    jquery.ajax({url:url, data:JSON.stringify(params), type:"POST", dataType:"json", contentType:"application/json;charset=UTF-8"}).done(response=>{
                        resolve(response);
                    }).fail(error=>{
                        console.error("==1=Defual Access Fail===");
                        reject(error);
                    });
                });
            },
            jsonp(){
                // 2：Jsonp 跨域名访问
                return new Promise((resolve,reject)=>{
                    jquery.ajax({url:url, data:decodeURI(qs.stringify(params)).replace(/(\[\d\])/g,""), type:"GET", dataType:"jsonp", jsonp:"jsonpCallback"}).done(response=>{
                        resolve(response);
                    }).fail(error=>{
                        console.error("==2=Jsonp Access Fail===",error);
                        reject(error);
                    });
                });
            },
            proxy(proxy_url = "/dashboard/http_proxy_forward"){
                //3：服务器 Http 代理转发
                return new Promise((resolve,reject)=>{
                    jquery.ajax({url:proxy_url, data:JSON.stringify(Object.assign(params,{url:url})), type:"POST", dataType:"json", contentType:"application/json;charset=UTF-8"}).done(response=>{
                        resolve(response);
                    }).fail(error=>{
                        console.error("==3=Http Proxy Fail===",error);
                        reject(error);
                    });
                });
            }
        }
    },

    start(chart, url, params, asynInterval=4, isSeries=true, aJaxDefault=null){
        //aJaxDefault = [defual() | jsonp() | proxy()];  静态变量（默认请求方式）
        this.requestCount++;
        this.stop(chart);
        if(params["startTime"] && params["endTime"]){
            isSeries = false;
        }
        return (callback)=>{
            let _promise = null;
            let _ajax = this.aJax(url, params);
            if(this.requestCount==1){
                aJaxDefault = _ajax.defual;
                _promise = aJaxDefault()
                .catch(error=>{
                    return _ajax.jsonp().then(response=>{
                        aJaxDefault = _ajax.jsonp;
                        return response;
                    });
                })
                .catch(error=>{
                    let proxy_url = "/dashboard/http_proxy_forward";
                    return _ajax.proxy(proxy_url).then(response=>{
                        Object.assign(params,{url:url});
                        aJaxDefault = _ajax.proxy;
                        return response;
                    }).catch(error=>{
                        isSeries = false;
                        chart.hideLoading();
                        let _option = chart.getOption();
                        _option.title[0].subtext="访问失败!!!";
                        _option.title[0].subtextStyle = {
                            lineHeight:chart._dom.clientHeight-78,
                        };
                        chart.setOption(_option);
                        console.error("***三种方式尝试连接都失败,轮询将终断***");
                        return error;
                    });
                });
            }else{
                _promise = aJaxDefault();
            }
            _promise.then(response=>{
                callback(response, isSeries);
            })
            .catch(error=>{
                if(this.requestCount>2) {
                    console.error("===error=访问间接终端==", error);
                }
            })
            .finally(()=>{
                if(isSeries){
                    chart.timeout = setTimeout(()=>{
                        this.start(chart, url, params, asynInterval, isSeries, aJaxDefault)(callback);
                    },Math.ceil(asynInterval)*1000);
                }
            });
        }
    },

    stop(chart) {
        if(this.requestCount==1){
            try {
                chart.showLoading(null, {
                    text: 'loading',
                    color: '#c23531',
                    textColor: 'rgba(255, 255, 255, 1)',
                    maskColor: 'rgba(0, 0, 0, .1)',
                    zlevel: 0
                });
            }catch (e) {
            }
        }
        window.clearTimeout(chart.timeout);
    }
}