import * as d3 from 'd3';
import { WindowResize, CreateGridsLayoutStyle } from './components'
import gridsDrawer from './components/grids-drawer/grids-drawer.vue';

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

let _templet = [
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

export default {
    components: {
        'grids-drawer':gridsDrawer
    },
    data() {
        return {
            appName: "App应用2.0-查询服务",
            sysDate:new Date(),
            isOpenGridsDrawer:true,
            templet:[]
        }
    },
    watch: {
        templet(newVal){
            this.$nextTick(function(){
                CreateGridsLayoutStyle(this.$refs.gridMainTemplet);
            });
        }
    },
    methods: {
        openGridsDrawer(){
            return this.isOpenGridsDrawer = !this.isOpenGridsDrawer;
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

        this.templet = _templet;
    }
}