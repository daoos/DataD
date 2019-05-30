import Sortable from 'sortablejs';
import html2canvas from 'html2canvas';
import { WindowResize, CreateGridsLayoutStyle, fireworks, gridsDrawer, baseChartsDrawer, collectionDrawer, themeDrawer, searchDrawer, ChartsFactory, businessChartsDrawer} from './components'
import { addDdPage, deleteDdPage, updateDdPage, selectDdPage, addCustom, updateCustom, getCustom} from "../service/serverApi"
import {DrawNavgetion} from "./components/drawNavgetion";

export default {
    components: {
        'grids-drawer':gridsDrawer,
        'base-charts-drawer':baseChartsDrawer,
        'collection-drawer':collectionDrawer,
        'theme-drawer':themeDrawer,
        'search-drawer':searchDrawer,
        'business-charts-drawer':businessChartsDrawer
    },
    data() {
        return {
            isDrawerOpen:{
                'theme-drawer':[false, false],
                'grids-drawer':[false, false],
                'base-charts-drawer':[false, false],
                'business-charts-drawer':[false, false],
                'collection-drawer':[false, false],
                'search-drawer':[false, false]
            },
            isOpenFireworks:false,
            isEdit:false,
            app:{
                id:null,
                name: "",
                flag:1,
                theme:"",
                background:"",
                photo:"",
                bgEffects:{
                    datetime:"",
                    values:""
                }
            },
            sysDate:Date.now(),
            templet:[] //主板当前选中格子模型
        }
    },
    computed:{
        appName(){
            return this.app.name||"请定制您的页面";
        },
        fireworksSingle:function(){
            let fir = new fireworks("fireworks");
            fir.init();
            fir.stop();
            return fir;
        }
    },
    watch: {
        app:{
            handler(newName) {
                DrawNavgetion("#svgroot",newName.theme).setTheme();
            },
            deep: true
        },
        templet(){
            this.$nextTick(function(){
                CreateGridsLayoutStyle(this.$refs.gridMain);
                this.$refs.gsw.forEach(x=>{
                    Sortable.create(x, {
                        group: {
                            name:"omega",
                            put:true
                        },
                        animation: 150,
                        forceFallback:true,
                        handle:".move_handle",
                        onEnd:function(evt){
                            if(evt.to != evt.from){
                                [evt.from, evt.to].forEach(el=> ChartsFactory().resize(el));
                            }
                        }
                    });
                });
            });
        },
        isOpenFireworks:function(bool){
            let fir = this.fireworksSingle;
            if(bool){
                fir.start();
                //播放1分钟自动关闭背景特效
                window.clearTimeout(window.autoStopFireworks);
                window.autoStopFireworks = setTimeout(()=>{
                    this.isOpenFireworks = false;
                },60000);
            }else{
                fir.stop();
            }
        }
    },
    methods: {
        _bgEffects(_themeConf){
            let _this = this;
            //背景特效控制
            let _bgEffects = _themeConf["bgEffects"];
            if(_bgEffects) {
                let _date = _bgEffects["datetime"];
                if (_date) {
                    if (isNaN(_date)) {
                        if (new Date(_date).getTime() >= Date.now()) {
                            window.clearInterval(window.timeout1);
                            window.timeout1 = setInterval(() => {
                                if (new Date(_date).getTime() <= Date.now()) {
                                    _this.isOpenFireworks = true;
                                    window.clearInterval(window.timeout1);
                                }
                            }, 1000);
                        }
                    } else {
                        window.clearInterval(window.timeout2);
                        window.timeout2 = setInterval(() => {
                            _this.isOpenFireworks = true;
                        }, (+_date) * 60000);
                    }
                }
            }
        },
        openFireworks(bool){
            this.isOpenFireworks = bool;
        },
        openDrawerFun(componentName,isDrawerLeft=true, isDrawerRight=false){
            Object.keys(this.isDrawerOpen).forEach(x=>{
                this.isDrawerOpen[x] = [false,false];
            });
            this.isDrawerOpen[componentName] = [isDrawerLeft,isDrawerRight];
        },
        setTemplet(gridsConf){
            this.templet = gridsConf;
        },
        //预览
        previewFun(edit=""){
            if(!this.app.id && !edit){
                this.$Modal.confirm({
                    title: '确定预览 ?',
                    content:'页面未保存，配置的图表会丢失',
                    onOk: () => {
                        this.$router.push({path:'/'+edit});
                        window.location.reload();
                    }
                });
            }else{
                this.$router.push({
                    path:'/'+edit,
                    query:{
                        id:this.app.id ,
                    }
                });
                window.location.reload();
            }
        },
        //主板内容区域缩放
        zoom(){
            let box = document.querySelector(".main-box #box");
            if(this.isEdit){
                let [scrollMin,scrollMax,scrollCur,step] = [0.25,1,0.5,0.125];
                let scrollFunc = function (e) {
                    e = e || window.event;
                    if (e.wheelDelta) { //第一步：先判断浏览器IE，谷歌滑轮事件
                        if (e.wheelDelta > 0) { //当滑轮向上滚动时
                            scrollCur += step;
                            scrollCur = scrollCur>scrollMax?scrollMax:scrollCur;
                        }
                        if (e.wheelDelta < 0) { //当滑轮向下滚动时
                            scrollCur -= step;
                            scrollCur = scrollCur<scrollMin?scrollMin:scrollCur;
                        }
                    } else if (e.detail) { //Firefox滑轮事件
                        if (e.detail > 0) { //当滑轮向上滚动时
                            scrollCur += step;
                            scrollCur = scrollCur>scrollMax?scrollMax:scrollCur;
                        }
                        if (e.detail < 0) { //当滑轮向下滚动时
                            scrollCur -= step;
                            scrollCur = scrollCur<scrollMin?scrollMin:scrollCur;
                        }
                    }
                    box.style=`transform:scale(${scrollCur})`;
                }
                //给页面绑定滑轮滚动事件
                if (document.addEventListener) {//firefox
                    document.addEventListener('DOMMouseScroll', scrollFunc, false);
                }
                //滚动滑轮触发scrollFunc方法 //ie 谷歌
                window.onmousewheel = document.onmousewheel = scrollFunc;
            }else{
                box.style="transform:scale(1);transition:initial";
            }
        },
        //主板内容拍照
        photograph(){
            return new Promise(resolve=>{
                let targetDom =document.querySelector(".main-box #box");
                targetDom.style.transform="scale(1)";
                html2canvas(targetDom).then((canvas)=>{
                    return canvas.toDataURL("image/png");
                }).then((beforeCompressImgBase64)=>{
                    let imgEl = this.$refs.photograph;
                    this.app.photo = beforeCompressImgBase64;
                    html2canvas(imgEl).then((canvas) =>{
                        let afterCompressImgBase64 = canvas.toDataURL("image/jpeg",0.5);
                        this.app.photo = afterCompressImgBase64;
                        resolve();
                    });
                });
            });
        },
        //序列化
        saveTotalConfig(submitType){
            if(!submitType){
                deleteDdPage(this.app.id, this.$DataDOption.isUseIndexedDB).then(response=>{
                    let re = response.data;
                    if(re){
                        this.$router.push({path:'/edit'});
                        window.location.reload();
                    };
                });
            }else{
                let untreatedChart = [];
                let gridMainEl  = this.$refs.gridMain;
                let _moduleList = this.templet.map(el=> {
                    let gswEl = gridMainEl.querySelector(`.gs-w[data-x='${el.x}'][data-y='${el.y}'][data-w='${el.w}'][data-h='${el.h}']`);
                    el.l = +gswEl.getAttribute("data-l");
                    el.chartList = [];
                    gswEl.querySelectorAll("#gridMain .chart").forEach(x=>{
                        let _configs = ChartsFactory.call({"chartElement":x}).configs();
                        if(typeof(_configs)==="object"){
                            el.chartList.push(_configs);
                        }else{
                            //检索出拖入主板中但未进行配置的图表
                            x.setAttribute("untreated",true);
                            untreatedChart.push(_configs);
                        }
                    });
                    return el;
                });
                if(untreatedChart.length>0){
                    this.$Modal.confirm({
                        title: '确定保存 ?',
                        content:'页面中存在未进行配置的图表，保存后会丢失',
                        onOk: () => {
                            this.savePage(submitType,_moduleList);
                        }
                    });
                }else{
                    this.savePage(submitType,_moduleList);
                }
            }
        },
        savePage(submitType,_moduleList){
            //拍照成功后入库
            this.photograph().then(()=>{
                let totalConfig = {
                    name:this.app.name,
                    flag:this.app.flag,
                    theme:this.app.theme,
                    background:this.app.background,
                    photo:this.app.photo,
                    bgEffects:this.app.bgEffects,
                    moduleList: _moduleList
                };
                if(submitType==1){
                    addDdPage(totalConfig, this.$DataDOption.isUseIndexedDB).then(response=>{
                        let id = response.data;
                        if(id) {
                            sessionStorage.removeItem("curTheme");
                            this.$Message.success('收藏成功.');
                        }
                        return response;
                    });

                    // //远程+本地存储（企业特殊定制）
                    // delete totalConfig["photo"];
                    // addCustom({url:"/DataD", menu_name:totalConfig.name, flag:totalConfig.flag, parameter:JSON.stringify(totalConfig), type:8}, this.$DataDOption.businessChartModuleConfig.sgm.customAdd).then(response=>{
                    //     if(response.data==0 || response.data==-1){
                    //         this.$Message.error('收藏失败!!!');
                    //         return "";
                    //     }else{
                    //         return response.data;
                    //     }
                    // }).then(pageId =>{
                    //     addDdPage(Object.assign(totalConfig,{id:pageId, photo:this.app.photo}), this.$DataDOption.isUseIndexedDB).then(response=>{
                    //         let id = response.data;
                    //         if(id){
                    //             sessionStorage.removeItem("curTheme");
                    //             this.$Message.success('收藏成功.');
                    //         }
                    //     })
                    // });
                }else if(submitType==2){
                    updateDdPage(totalConfig, this.app.id, this.$DataDOption.isUseIndexedDB).then(response=>{
                        let re = response.data;
                        if(re) {
                            sessionStorage.removeItem("curTheme");
                            this.$Message.success('修改成功.');
                        }
                        return response;
                    });

                    // //远程+本地更新（企业特殊定制）
                    // delete totalConfig["photo"];
                    // updateCustom({id:this.app.id, menu_name:totalConfig.name, flag:totalConfig.flag, parameter:JSON.stringify(totalConfig)}, this.$DataDOption.businessChartModuleConfig.sgm.customUpdate).then(response=>{
                    //     if(response.status==200){
                    //         return this.app.id;
                    //     }else{
                    //         this.$Message.error('修改失败!!!');
                    //         return "";
                    //     }
                    // }).then(pageId =>{
                    //     updateDdPage(Object.assign(totalConfig,{id:pageId, photo:this.app.photo}), pageId, this.$DataDOption.isUseIndexedDB).then(response=>{
                    //         let re = response.data;
                    //         if(re) {
                    //             sessionStorage.removeItem("curTheme");
                    //             this.$Message.success('修改成功.');
                    //         }
                    //     })
                    // });
                }
            });
        },
        //反序列化
        initPage(pageId){
            let _this = this;
            //主题风格反序列化
            let curTheme = sessionStorage.getItem("curTheme");
            if(curTheme){
                let _themeConf= JSON.parse(curTheme);
                Object.assign(_this.app,{theme:_themeConf.theme, background:_themeConf.background});
                if(Array.isArray(_themeConf["grid"])){
                    this.templet = _themeConf.grid;
                }
            }
            if(pageId){
                let gridMainEl = this.$refs.gridMain;
                selectDdPage(+pageId, this.$DataDOption.isUseIndexedDB).then(response=>{
                    let totalConfig = response.data;
                    if(totalConfig){
                        if(!curTheme){
                            Object.assign(_this.app,{theme:totalConfig.theme,background:totalConfig.background})
                        }
                        if(!sessionStorage.getItem("bgEffects")){
                            Object.assign(_this.app,{bgEffects:totalConfig.bgEffects});
                        }
                        this._bgEffects(totalConfig);
                        //主板格子模型反序列化
                        Object.assign(_this.app, {id:+pageId, name:totalConfig.name, flag:totalConfig.flag});
                        this.templet = totalConfig.moduleList.map(el=>{
                            return {x:el.x, y:el.y, w:el.w, h:el.h, l:el.l};
                        });
                        //各图表配置反序列化
                        totalConfig.moduleList.forEach(el=>{
                            _this.$nextTick(()=>{
                                let gswEl = gridMainEl.querySelector(`.gs-w[data-x='${el.x}'][data-y='${el.y}'][data-w='${el.w}'][data-h='${el.h}']`);
                                el.chartList.forEach(config=>{
                                    let ul = document.createElement('ul');
                                    let chartEl = document.createElement('li');
                                    chartEl.setAttribute("data-id",config.chartType);
                                    chartEl.setAttribute("business-data-id",config.baseChartType); //业务（内置）图表存在该属性
                                    chartEl.setAttribute("class","chart");
                                    ul.appendChild(chartEl);
                                    ul.setAttribute("class","chartTemplet");
                                    if(this.isEdit){
                                        let ol = document.createElement('ol');
                                        let moveBtuEl = document.createElement('i');
                                        moveBtuEl.setAttribute("class","btu ivu-icon ivu-icon-md-reorder");
                                        moveBtuEl.setAttribute("title","拖拽");
                                        let settingsBtuEl = document.createElement('i');
                                        settingsBtuEl.setAttribute("class","btu settings ivu-icon ivu-icon-ios-settings");
                                        settingsBtuEl.setAttribute("title","设置");
                                        settingsBtuEl.setAttribute("chart-type",config.chartType);
                                        settingsBtuEl.onmousedown = (event)=>{
                                            event.stopPropagation();
                                            _this.$nextTick(()=>{
                                                if(config.baseChartType){
                                                    window.BusinessChartsDrawer.settingsCharts(event.target);
                                                }else{
                                                    window.BaseChartsDrawer.settingsCharts(event.target);
                                                }
                                            });
                                        }
                                        let trashBtuEl = document.createElement('i');
                                        trashBtuEl.setAttribute("class","btu trash ivu-icon ivu-icon-ios-trash");
                                        trashBtuEl.setAttribute("title","删除");
                                        trashBtuEl.onmousedown = (event)=>{
                                            event.stopPropagation();
                                            let element = event.target;
                                            ChartsFactory.call({"chartElement":element.parentNode.previousElementSibling}).destroy();
                                        }
                                        ol.appendChild(settingsBtuEl);
                                        ol.appendChild(moveBtuEl);
                                        ol.appendChild(trashBtuEl);
                                        ol.setAttribute("class","move_handle");
                                        ul.appendChild(ol);
                                    }
                                    gswEl.appendChild(ul);
                                    _this.$nextTick(()=>{
                                        ChartsFactory.call({"chartElement":chartEl}).init(_this.app.theme).configs(config);
                                    });
                                });
                            });
                        });
                    }
                });

                // //获取配置（企业特殊定制:前端缓存有取前端配置，反之取后端配置）
                // selectDdPage(+pageId, this.$DataDOption.isUseIndexedDB).then(response=>{
                //     return response.data;
                // }).then(config=>{
                //     if(config){
                //         return config;
                //     }else{
                //         return new Promise(resolve=>{
                //             getCustom(pageId, this.$DataDOption.businessChartModuleConfig.sgm.getCustom).then(response=>{
                //                 resolve(response.data);
                //             });
                //         });
                //     }
                // }).then(totalConfig=>{
                //     if(totalConfig){
                //         if(!curTheme){
                //             Object.assign(_this.app,{theme:totalConfig.theme,background:totalConfig.background})
                //         }
                //         if(!sessionStorage.getItem("bgEffects")){
                //             Object.assign(_this.app,{bgEffects:totalConfig.bgEffects});
                //         }
                //         this._bgEffects(totalConfig);
                //         //主板格子模型反序列化
                //         Object.assign(_this.app, {id:+pageId, name:totalConfig.name, flag:totalConfig.flag});
                //         this.templet = totalConfig.moduleList.map(el=>{
                //             return {x:el.x, y:el.y, w:el.w, h:el.h, l:el.l};
                //         });
                //         //各图表配置反序列化
                //         totalConfig.moduleList.forEach(el=>{
                //             _this.$nextTick(()=>{
                //                 let gswEl = gridMainEl.querySelector(`.gs-w[data-x='${el.x}'][data-y='${el.y}'][data-w='${el.w}'][data-h='${el.h}']`);
                //                 el.chartList.forEach(config=>{
                //                     let ul = document.createElement('ul');
                //                     let chartEl = document.createElement('li');
                //                     chartEl.setAttribute("data-id",config.chartType);
                //                     chartEl.setAttribute("business-data-id",config.baseChartType); //业务（内置）图表存在该属性
                //                     chartEl.setAttribute("class","chart");
                //                     ul.appendChild(chartEl);
                //                     ul.setAttribute("class","chartTemplet");
                //                     if(this.isEdit){
                //                         let ol = document.createElement('ol');
                //                         let moveBtuEl = document.createElement('i');
                //                         moveBtuEl.setAttribute("class","btu ivu-icon ivu-icon-md-reorder");
                //                         moveBtuEl.setAttribute("title","拖拽");
                //                         let settingsBtuEl = document.createElement('i');
                //                         settingsBtuEl.setAttribute("class","btu settings ivu-icon ivu-icon-ios-settings");
                //                         settingsBtuEl.setAttribute("title","设置");
                //                         settingsBtuEl.setAttribute("chart-type",config.chartType);
                //                         settingsBtuEl.onmousedown = (event)=>{
                //                             event.stopPropagation();
                //                             _this.$nextTick(()=>{
                //                                 if(config.baseChartType){
                //                                     window.BusinessChartsDrawer.settingsCharts(event.target);
                //                                 }else{
                //                                     window.BaseChartsDrawer.settingsCharts(event.target);
                //                                 }
                //                             });
                //                         }
                //                         let trashBtuEl = document.createElement('i');
                //                         trashBtuEl.setAttribute("class","btu trash ivu-icon ivu-icon-ios-trash");
                //                         trashBtuEl.setAttribute("title","删除");
                //                         trashBtuEl.onmousedown = (event)=>{
                //                             event.stopPropagation();
                //                             let element = event.target;
                //                             ChartsFactory.call({"chartElement":element.parentNode.previousElementSibling}).destroy();
                //                         }
                //                         ol.appendChild(settingsBtuEl);
                //                         ol.appendChild(moveBtuEl);
                //                         ol.appendChild(trashBtuEl);
                //                         ol.setAttribute("class","move_handle");
                //                         ul.appendChild(ol);
                //                     }
                //                     gswEl.appendChild(ul);
                //                     _this.$nextTick(()=>{
                //                         ChartsFactory.call({"chartElement":chartEl}).init(_this.app.theme).configs(config);
                //                     });
                //                 });
                //             });
                //         });
                //     }
                // });
            }
        }
    },
    mounted(){
        this.templet = [{"x":1,"y":1,"w":4,"h":6,"l":0}];
        //初始化页面 http://127.0.0.1:8070/#/?id=14  |   http://127.0.0.1:8070/#/edit?id=14
        this.initPage(this.$route.query["id"]);
        this.isEdit = this.$route.path.includes("/edit");
        //缩放
        this.zoom();
        //图表宽高自适应
        WindowResize(this);
    }
}