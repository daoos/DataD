import * as d3 from 'd3';
import Sortable from 'sortablejs';
import { WindowResize, CreateGridsLayoutStyle } from './components'
import gridsDrawer from './components/grids-drawer/grids-drawer.vue';
import baseChartsDrawer from './components/base-charts-drawer/base-charts-drawer.vue';

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
        'base-charts-drawer':baseChartsDrawer
    },
    data() {
        return {
            appName: "App应用2.0-查询服务",
            sysDate:new Date(),
            childComponentDrawer:null,
            isOpenDrawer:false,
            templet:[]
        }
    },
    watch: {
        templet(){
            this.$nextTick(function(){
                CreateGridsLayoutStyle(this.$refs.gridMainTemplet);
                this.$refs.gsw.forEach(x=>{
                    Sortable.create(x, {
                        group: {
                            name:"omega",
                            put:true
                        },
                        animation: 150,
                        forceFallback:true,
                        handle:".move_handle",
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
            this.templet = gridsConf;
        }
    },
    mounted() {
        //缩放
        zoom();
        //图表宽高自适应
        WindowResize(this);

        this.templet = [
            {
                "x": 1,
                "y": 1,
                "w": 2,
                "h": 6
            },
            {
                "x": 3,
                "y": 1,
                "w": 2,
                "h": 6
            }
        ];
    }
}