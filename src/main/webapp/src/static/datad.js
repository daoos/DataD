import * as d3 from 'd3';
import Sortable from 'sortablejs';
import { WindowResize, CreateGridsLayoutStyle } from './components'
import gridsDrawer from './components/grids-drawer/grids-drawer.vue';
import baseChartsDrawer from './components/base-charts-drawer/base-charts-drawer.vue';
import collectionDrawer from './components/collection-drawer/collection-drawer.vue';
import { ChartsFactory } from './components/base-charts-drawer/chartsFactory';
import { addDdPage, selectDdPage } from "../service/serverApi"

/**
 * 内容区域缩放
 */
const zoom = function(){
    let box =  d3.select(".box");
    d3.select(".main-box").call(d3.zoom().scaleExtent([0.25, 1]).on("zoom", function(){
        let {k,x,y} = d3.event.transform;
        box.style("transform", `scale(${k})`);
        //box.style("transform", `translate(${x}px,${y}px) scale(${k})`);
    }));
};


export default {
    components: {
        'grids-drawer':gridsDrawer,
        'base-charts-drawer':baseChartsDrawer,
        'collection-drawer':collectionDrawer
    },
    data() {
        return {
            appName: "App应用2.0-查询服务",
            sysDate:new Date(),
            childComponentDrawer:null,
            isOpenDrawer:false,
            templet:[] //当前选中格子模板
        }
    },
    watch: {
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
        openDrawer(componentName){
            this.childComponentDrawer = componentName;
            return this.isOpenDrawer = !this.isOpenDrawer;
        },
        setTemplet(gridsConf){
            console.log("==templet==",gridsConf);
            this.templet = gridsConf;
        },
        //序列号
        saveTotalConfig(c){
            let gridMainEl = this.$refs.gridMain;
            let totalConfig = {
                menuName:"我的图表",
                flag:"1",
                moduleList: this.templet.map(el=> {
                    el.chartList=[];
                    let gswEl = gridMainEl.querySelector(`.gs-w[data-x='${el.x}'][data-y='${el.y}'][data-w='${el.w}'][data-h='${el.h}']`);
                    gswEl.querySelectorAll(".chart").forEach(x=>{
                        el.chartList.push( ChartsFactory.call({"chartElement":x}).configs() );
                    });
                    return el;
                })
            };
            console.log("==moduleList=",JSON.stringify(totalConfig,null,4));
            addDdPage(totalConfig).then(response=>{
                let id = response.data;
                if(id){
                    this.$Message.success('页面收藏成功.');
                    console.log("==moduleList OK =",id);
                }
            });
        },
        //反序列号
        initPage(pageId){
            if(pageId){
                let _this = this;
                let gridMainEl = this.$refs.gridMain;
                selectDdPage(+pageId).then(response=>{
                    let totalConfig = response.data;
                    if(totalConfig){
                        this.templet = totalConfig.moduleList.map(el=>{
                            return {x:el.x, y:el.y, w:el.w, h:el.h, l:el.l};
                        });

                        totalConfig.moduleList.forEach(el=>{
                            _this.$nextTick(function(){
                                let gswEl = gridMainEl.querySelector(`.gs-w[data-x='${el.x}'][data-y='${el.y}'][data-w='${el.w}'][data-h='${el.h}']`);
                                el.chartList.forEach(x=>{
                                    console.log("===chartConf==",x);
                                    //1：创建 <ul class="chartTemplet"> 元素。
                                    //2：ChartsFactory.call({"chartElement":chartTempletEl.querySelector(".chart")}).init();

                                    let chartTemplet =
                                    `<ul class="chartTemplet">
                                        <li data-id="${x.chartType}" class="chart"></li>
                                    </ul>`;
                                    console.log(gswEl,"===chartDom==",chartTemplet);

                                    gswEl.innerHTML = chartTemplet;

                                });
                            });
                        });


                    }
                });
            }
        },
    },
    mounted() {
        //缩放
        zoom();
        //图表宽高自适应
        WindowResize(this);
        //初始化页面
        let pageId = window.location.search.substr(1);
        this.initPage(pageId);
    }
}