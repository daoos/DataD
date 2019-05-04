import jquery from "jquery";

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

    aJax(url, params, dataType){
        let ajaxOption = { url:url, data:params, dataType:dataType, type:"POST", jsonp:"jsonpcallback", processData:false};
        return {
            defual(){
                // 1：默认内部域名访问
                return new Promise((resolve,reject)=>{
                    jquery.ajax(ajaxOption).done(response=>{
                        resolve(response);
                    }).fail(error=>{
                        console.error(JSON.stringify(ajaxOption,null,4));
                        console.error("==1=Defual Access Fail -> Jsonp Access===",error);
                        reject(error);
                    });
                });
            },
            jsonp(){
                // 2：Jsonp 跨域名访问
                return new Promise((resolve,reject)=>{
                    jquery.ajax(Object.assign(ajaxOption,{dataType:"jsonp"})).done(response=>{
                        resolve(response);
                    }).fail(error=>{
                        console.error("==2=Jsonp Access Fail -> Http Proxy===",error);
                        reject(error);
                    });
                });
            },
            proxy(proxy_url = "/chart/http_proxy_forward"){
                // 3：服务器 Http 代理转发
                return new Promise((resolve,reject)=>{
                    Object.assign(params,{url:url});
                    jquery.ajax(Object.assign(ajaxOption,{url:proxy_url})).done(response=>{
                        resolve(response);
                    }).fail(error=>{
                        console.error("==3=Http Proxy Fail===",error);
                        reject(error);
                    });
                });
            }
        }
    },

    start(chart, url, params, asynInterval=3, dataType="json", isSeries=true){
        this.requestCount++;
        this.stop(chart);
        if(params["startTime"] && params["endTime"]){
            isSeries = false;
        }
        return (callback)=>{
            let _ajax = this.aJax(url, params, dataType);
            let _defual = _ajax.defual();
            if(this.requestCount==1){
                _defual
                .catch(error=>{
                    return _ajax.jsonp().then(response=>{
                        dataType="jsonp";
                        return response;
                    });
                })
                .catch(error=>{
                    let proxy_url = "/chart/http_proxy_forward";
                    return _ajax.proxy(proxy_url).then(response=>{
                        Object.assign(params,{url:url});
                        url=proxy_url;
                        return response;
                    }).catch(error=>{
                        isSeries = false;
                        let theme = this.themes.filter(x=> x.id.includes(chart.themeName));
                        chart.showLoading(null, {
                            text: '无效访问',
                            color: '#c23531',
                            textColor: theme.length==0?"#333333":theme[0].titleColor,
                            maskColor: 'rgba(0, 0, 0, 0)'
                        });
                        return error;
                    });
                });
            }
            _defual
            .then(response=>{
                callback(response, isSeries);
            }).catch(error=>{
                if(this.requestCount>2) {
                    console.error("===error=访问间接终端==", error);
                }
            })
            .finally(()=>{
                if(isSeries){
                    chart.timeout = setTimeout(()=>{
                        this.start(chart, url, params, asynInterval, dataType, isSeries)(callback);
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