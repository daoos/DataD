<template>
    <div class="charts-topo">
        <charts-common ref="commonConf" :chartName="chartName" :isDisabledUrl="isDisabledUrl"></charts-common>
        <div class="topo-edit">
            <div id="myPaletteDiv" class="palette"></div>
            <div id="myDiagramDiv" class="diagram"></div>
            <div id="infoDraggable" class="node-info">
                <div id="infoDraggableHandle" class="handle">节点信息</div>
                <div><div id="myInfo"></div></div>
            </div>
        </div>
        <Row>
            <Col span="12" style="text-align: right;margin-top: 20px;font-size: 9px;text-align: left;">
            删除节点或线（鼠标选中后按Delete键）
            </Col>
            <Col span="12" style="text-align: right;margin-top: 20px;font-size: 9px;">
            <Tooltip placement="bottom-end" max-width=550 >
                数据返回格式说明：<Icon type="md-help-circle" size="16"/>
                <pre slot="content">
{
   "series":[
        {id:'A', alarmlevel:0, items:[{name:'TPS',value:3},{name:'AVG',value:5}]},
        {id:'B', alarmlevel:2, items:[{name:'TPS',value:2},{name:'AVG',value:4}]}
    ]
}</pre>
            </Tooltip>
            </Col>
        </Row>
    </div>
</template>

<script>
    import gojs from "../../../gojs/go";
    import { Inspector } from "../../../gojs/DataInspector";
    import topo from "../topo"
    import common from './common.vue';
    export default {
        props:["isDisabledUrl"],
        components: {
            'charts-common': common,
        },
        data() {
            return {
                chartName:"拓扑图",
                myDiagram: null,
                api:{
                    class: "go.GraphLinksModel",
                    linkFromPortIdProperty: "fromPort",
                    linkToPortIdProperty: "toPort"
                }
            }
        },
        methods: {
            setTemplet(){
                this.myDiagram = topo._topoTemplet("myDiagramDiv");
                let $ = go.GraphObject.make;
                $(go.Palette, "myPaletteDiv",
                    {
                        "initialAutoScale": go.Diagram.Uniform,
                        "initialContentAlignment": go.Spot.Center,
                        nodeTemplateMap: this.myDiagram.nodeTemplateMap,
                        model: new go.GraphLinksModel([
                            { id:"" ,text:"Start", category: "Start", },
                            { id:"" ,text:"Step", fill:"#008299"},
                            { id:"" ,text:"???",  category: "Conditional" },
                            { id:"" ,text:"End",  category: "End" },
                            { id:"" ,text:"Comment",category: "Comment"}
                        ])
                    }
                );
                new Inspector('myInfo', this.myDiagram,{
                    properties: {
                        "key": { show: false, readOnly: true },
                        "loc": { show: false },
                        "category":{ show: false },
                        "id":  { show: Inspector.showIfPresent},
                        "text": { show: Inspector.showIfPresent},
                        "fill": { show: Inspector.showIfPresent, type: 'color' },
                    }
                });
                //$("#infoDraggable").draggable({ handle: "#infoDraggableHandle" });
                this.myDiagram.model = go.Model.fromJson(this.api);
            },
            initConfig(config){
                this.api = config["api"] || {};
                this.$refs.commonConf.initConfig(config);
                this.setTemplet();
            },
            submitConf(){
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    this.api = this.myDiagram.model.toJson();
                    this.myDiagram.isModified = false;
                    if(this.api){
                        commonConf.api = this.api;
                        return commonConf;
                    }else{
                        this.$Notice.error({title: '请配置拓扑!!!'});
                        return;
                    }
                }else{
                    return;
                }
            }
        },
        mounted(){
        }
    }
</script>

<style lang="less" type="text/less">
    .topo-edit{
        border:1px solid rgba(0, 0, 0, 0.2);
        min-height: 500px;
        background: rgba(0, 0, 0, 0.1);
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        canvas {
            outline: none;
        }
        .palette{
            box-shadow: 0px 0px 10px rgba(0, 0, 0, .2) inset;
            width: 100px;
        }
        .diagram{
            flex: 1;
            border-left:1px solid rgba(0, 0, 0, .2);
            background: url("../../../../images/bg_w.png");
        }
        .node-info{
            position: absolute;
            left: 0px;
            bottom: 0px;
            z-index: 99;
            .handle{
                text-align: center;
                background: rgba(0,0,0,.2);
                font-weight: bold
            }
            input{
                width: calc(100px - 4px);
            }
        }
    }
</style>