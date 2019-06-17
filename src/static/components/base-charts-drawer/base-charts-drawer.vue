<template>
    <div class="charts-drawer">
        <Drawer title="常规图表" :transfer="false" :inner="true" :mask="false" :width="211" :styles="styles" placement="left" v-model="isDrawerLeft">
            <div id="chartTemplet">
                <template v-for="item in chartList">
                    <ul class="chartTemplet">
                        <li :data-id="item" class="chart">
                            <img :src="require('../../images/' + item + '.png')"/>
                        </li>
                        <ol class="move_handle">
                            <Icon type="ios-settings"size="26" title="设置" class="btu settings" :chart-type="item" onmousedown="((e)=>{ e.stopPropagation(); window.BaseChartsDrawer.settingsCharts(e.target) })(event)" />
                            <Icon type="md-reorder"  size="26" title="拖拽" />
                            <Icon type="ios-trash"   size="26" title="删除" class="btu trash" onmousedown="((e)=>{ e.stopPropagation(); window.BaseChartsDrawer.trashCharts(e.target) })(event)"/>
                        </ol>
                    </ul>
                    <Divider dashed />
                </template>
            </div>
            <div class="drawer-footer"></div>
        </Drawer>
        <Drawer title="图表配置" :transfer="false" :inner="true" :mask-closable="false" :width="590" :styles="Object.assign({},styles,{height: 'calc(100% - 100px)'})" v-model="isDrawerRight">
            <component class="chartConfig" ref="chartConfComponent" :is="childComponentChart"></component>
            <div class="drawer-footer">
                <ButtonGroup>
                    <Button @click="submitConf" type="primary">确定</Button>
                    <Button @click="isDrawerRight = false">取消</Button>
                </ButtonGroup>
            </div>
        </Drawer>
    </div>
</template>

<script>
    window.BaseChartsDrawer = null;
    import Sortable from 'sortablejs';
    import { ChartsFactory } from './chartsFactory';
    import * as chartsConf from './charts/conf'

    export default {
        props:["isDrawerOpen","app"],
        data() {
            return {
                isDrawerLeft:false,
                isDrawerRight:false,
                styles: {
                    height: 'calc(100% - 75px)',
                    overflow: 'auto',
                    position: 'static'
                },
                chartList:["linebar","line","bar","pie","radar","liquidfill","number","topo","map"],
                childComponentChart: null,
                chartElement:null,
                chartType:""
            }
        },
        watch: {
            isDrawerOpen(bool){
                this.isDrawerLeft = bool;
            },
            isDrawerLeft(bool){
                this.$emit("isDrawerOpen$Parent",bool,"baseChartsDrawer");
            }
        },
        methods: {
            settingsCharts(element){
                let _chartType = element.getAttribute('chart-type');
                let _chartElement = element.parentNode.previousElementSibling;
                this.isDrawerRight = true;
                this.chartElement = _chartElement;
                this.chartType = _chartType;
                this.childComponentChart = chartsConf[_chartType];
                this.$nextTick(function(){
                    let config = ChartsFactory.call({"chartElement":_chartElement}).configs();
                    this.$refs.chartConfComponent.initConfig(config);
                });
            },
            trashCharts(element){
                ChartsFactory.call({"chartElement":element.parentNode.previousElementSibling}).destroy();
            },
            submitConf(){
                let config = this.$refs.chartConfComponent.submitConf();
                if(config){
                    this.isDrawerRight = false;
                    config.chartType = this.chartType;
                    ChartsFactory.call({"chartElement":this.chartElement, "gswElementLayout":config.layout}).configs(config).resize();
                }
            }
        },
        mounted() {
            let _this = this;
            window.BaseChartsDrawer = _this;
            Sortable.create(document.getElementById("chartTemplet"), {
                sort:false,
                group:{
                    name:"omega",
                    pull:'clone',
                    put:false,
                },
                animation: 150,
                forceFallback:true,
                chosenClass: "sortable-chosen",
                //handle:".move_handle",
                handle:".chartTemplet",
                onEnd:function(evt){
                    //console.log(evt.from,"===",evt.to,"====",evt.item);
                    if(evt.to != evt.from){
                        ChartsFactory.call({"chartElement":evt.item.querySelector(".chart")}).init(_this.app.theme);
                    }
                }
            });
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-drawer{
        .chartTemplet{
            list-style: none;
            display:flex;
            .move_handle{
                flex: 1;
                display:flex;
                align-items:center;
                cursor: Move;
                .settings, .trash{
                    display: none;
                }
            }
            .chart{
                width: 150px;
                height: 100px;
                line-height: 100px;
                margin-right: 5px;
                display: inline-block;
                position: relative;
                img{
                    box-shadow: 0px 0px 5px rgba(0,0,0,.6);
                }
            }
        }
        .chartConfig{
            .tab{
                font-weight: bold;
                text-align: right;
                padding-top: 5px;
            }
        }
    }
    .sortable-chosen{
        opacity: 0.4;
        background: rgba(0,0,0,.6);
        box-shadow: 0px 0px 10px  rgba(0,0,0,1);
    }
</style>