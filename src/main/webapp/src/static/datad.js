import * as d3 from 'd3';
import Sortable from 'sortablejs';
import html2canvas from 'html2canvas';
import { WindowResize, CreateGridsLayoutStyle, gridsDrawer, baseChartsDrawer, collectionDrawer, themeDrawer, searchDrawer, ChartsFactory, businessChartsDrawer} from './components'
import { addDdPage, deleteDdPage, updateDdPage, selectDdPage } from "../service/serverApi"
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
            isEdit:false,
            app:{
                id:null,
                name: "",
                flag:1,
                theme:"",
                background:"",
                photo:""
            },
            sysDate:Date.now(),
            templet:[] //主板当前选中格子模型
        }
    },
    computed:{
        appName(){
            return this.app.name||"请定制您的页面";
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
        }
    },
    methods: {
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
            this.$router.push({
                path:'/'+edit,
                query:{
                    id:this.app.id ,
                }
            });
            window.location.reload();
        },
        //主板内容区域缩放
        zoom(){
            let box =  d3.select(".main-box #box");
            if(this.isEdit){
                d3.select(".main-box").call(d3.zoom().scaleExtent([0.25, 1]).on("zoom", function(){
                    let {k,x,y} = d3.event.transform;
                    box.style("transform", `scale(${k})`);
                    //box.style("transform", `translate(${x}px,${y}px) scale(${k})`);
                }));
            }else{
                box.style("transform", "scale(1)");
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
                        this.$router.push({
                            path:'/edit'
                        });
                        window.location.reload();
                    };
                });
            }else{
                //拍照成功后入库
                this.photograph().then(()=>{
                    let gridMainEl = this.$refs.gridMain;
                    let totalConfig = {
                        name:this.app.name,
                        flag:this.app.flag,
                        theme:this.app.theme,
                        background:this.app.background,
                        photo:this.app.photo,
                        moduleList: this.templet.map(el=> {
                            let gswEl = gridMainEl.querySelector(`.gs-w[data-x='${el.x}'][data-y='${el.y}'][data-w='${el.w}'][data-h='${el.h}']`);
                            el.l = +gswEl.getAttribute("data-l");
                            el.chartList = [];
                            gswEl.querySelectorAll("#gridMain .chart").forEach(x=>{
                                el.chartList.push( ChartsFactory.call({"chartElement":x}).configs() );
                            });
                            return el;
                        })
                    };
                    if(submitType==1){
                        addDdPage(totalConfig, this.$DataDOption.isUseIndexedDB).then(response=>{
                            let id = response.data;
                            if(id) {
                                sessionStorage.removeItem("curTheme");
                                this.$Message.success('收藏成功.');
                            }
                        });
                    }else if(submitType==2){
                        updateDdPage(totalConfig, this.app.id, this.$DataDOption.isUseIndexedDB).then(response=>{
                            let re = response.data;
                            if(re) {
                                sessionStorage.removeItem("curTheme");
                                this.$Message.success('修改成功.');
                            }
                        });
                    }
                });
            }
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
            }
        }
    },
    mounted(){
        //初始化页面 http://127.0.0.1:8070/#/?id=14  |   http://127.0.0.1:8070/#/edit?id=14
        this.initPage(this.$route.query["id"]);
        this.isEdit = this.$route.path.includes("/edit");
        //缩放
        this.zoom();
        //图表宽高自适应
        WindowResize(this);

        // setInterval(()=>{
        //     this.sysDate = Date.now();
        // },1000)
    }
}