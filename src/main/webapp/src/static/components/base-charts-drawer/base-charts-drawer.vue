<template>
    <div class="charts-drawer">
        <Drawer title="常规图表" :transfer="false" :inner="true" :mask="false" :width="211" :styles="styles" placement="left" v-model="isDrawerLeft">
            <div id="chartTemplet">
                <template  v-for="item in chartList">
                    <ul class="chartTemplet">
                        <li :id="item" :data-id="item" class="chart"><img :src="require('../../img/' + item + '.png')"/></li>
                        <ol class="move_handle"><Icon type="md-reorder" size="26" title="拖拽" @click="removeTemplet(item)"/></ol>
                    </ul>
                    <Divider dashed />
                </template>
            </div>
            <div class="drawer-footer"></div>
        </Drawer>
        <Drawer title="图表配置" :transfer="false" :inner="true" :width="590" :styles="styles" v-model="isDrawerRight">
            <nav></nav>
            <div class="drawer-footer">
                <Button  @click="isDrawerLeft = false">取消</Button>
                <Button type="primary">确定</Button>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import Sortable from 'sortablejs';

    export default {
        props:["isDrawerLeft"],
        data() {
            return {
                isDrawerRight:false,
                styles: {
                    height: 'calc(100% - 75px)',
                    overflow: 'auto',
                    position: 'static'
                },
                chartList:["linebar","line","bar","pie","radar","waterlevel","number","topo"]
            }
        },
        mounted() {
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
                handle:".move_handle",
                onEnd:function(evt){
                    console.log(evt.from,"===",evt.to,"====",evt.item);
                    if(evt.to != evt.from){

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
    }
    .sortable-chosen{
        opacity: 0.4;
        background: rgba(0,0,0,.6);
        box-shadow: 0px 0px 10px  rgba(0,0,0,1);
    }
    .drawer-footer{
        width: 100%;
        padding: 10px 16px;
        position: absolute;
        left: 0;
        bottom: 0;
        border-top: 1px solid #e8e8e8;
        background: #fff;
        text-align: center;
    }
</style>