import * as d3 from 'd3';
import {drawNavgetion,windowResize} from './components'

/**
 * 内容区域缩放
 */
let zoom = function(){
    let box =  d3.select(".box");
    d3.select(".container").call(d3.zoom().scaleExtent([0.25, 1]).on("zoom", function(){
        let {k,x,y} = d3.event.transform;
        box.style("transform", `scale(${k})`);
        //box.style("transform", `translate(${x}px,${y}px) scale(${k})`);
    }));
};

export default {
    data() {
        return {
            appName: "App应用2.0-查询服务",
            sysdate:new Date()
        }
    },
    watch:{
    },
    computed:{
    },
    methods: {
    },
    mounted() {
        let _this = this;

        //缩放
        zoom();
        //导航
        let nav = drawNavgetion("#svgroot").navgetion();
        //图表宽高自适应
        windowResize(this,nav);
    }
}