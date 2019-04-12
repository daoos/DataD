<template>
    <div class="grids-drawer">
        <Drawer title="模板" :transfer="false" :inner="true" :mask="false" :width="211" :styles="styles" placement="left" v-model="isOpenDrawer">
            <ul id="gridTemplet" ref="gridTemplet">
                <div class="grids-list" v-for="key in Object.keys(templets)">
                    <li :id="'grid' + key"  :data-id="key" class="grids" @click="$emit('setTemplet$Parent',templets[key])">
                        <ul>
                            <li :data-x="value.x" :data-y="value.y" :data-w="value.w" :data-h="value.h" :data-l="value.l" class="gs-w" v-for="value in templets[key]"></li>
                        </ul>
                    </li>
                    <ol><Icon type="ios-trash-outline" size="26" title="删除" @click="removeTemplet(key)"/></ol>
                </div>
            </ul>
            <div class="drawer-footer">
                <Button  @click="isOpenDrawer = false">取消</Button>
                <Button type="primary" @click="isDrawerRight = true">添加</Button>
            </div>
        </Drawer>
        <Drawer title="添加模板" :transfer="false" :inner="true" :width="590" :styles="styles" v-model="isDrawerRight">
            <nav class="grids-conf">
                <Divider dashed orientation="left"><Icon type="md-open" /> 最大尺寸：6 * 4</Divider>
                <div style="text-align: right">
                    <ButtonGroup size="small" class="button-group">
                        <Button icon="md-add-circle" @click="addDdGrid">添加</Button>
                        <Button icon="md-remove-circle" @click="removeGrid">删除</Button>
                    </ButtonGroup>
                </div>
                <div class="grid-layout-box">
                    <grid-layout
                            :layout.sync="layout"
                            :col-num="4"
                            :row-height="60"
                            :is-draggable="true"
                            :is-resizable="true"
                            :is-mirrored="false"
                            :vertical-compact="true"
                            :margin="[5, 5]"
                            :use-css-transforms="true"
                            :autoSize="false"
                            :max-rows="6"
                    >
                        <grid-item v-for="item in layout"
                                   :x="item.x"
                                   :y="item.y"
                                   :w="item.w"
                                   :h="item.h"
                                   :i="item.i"
                                   :l="item.l">
                        </grid-item>
                    </grid-layout>
                </div>
            </nav>
            <div class="drawer-footer">
                <Button  @click="isDrawerRight = false">取消</Button>
                <Button type="primary" @click="submitGrid">确定</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
    import VueGridLayout from 'vue-grid-layout';
    import { CreateGridsLayoutStyle } from '../';
    import {addDdGrid, deleteDdGrid, selectAllDdGrid} from "../../../service/serverApi"

    let templets = {
        "test":[
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
        ]
    };

    export default {
        props:["isOpenDrawer"],
        components: {
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },
        data() {
            return {
                isDrawerRight:false,
                styles: {
                    height: 'calc(100% - 90px)',
                    overflow: 'auto',
                    position: 'static'
                },
                templets: {},
                layout: []
            }
        },
        watch: {
            isOpenDrawer(newVal){
                if(newVal) this.createGridsLayoutStyle();
            },
            templets:{
                handler() {
                    this.createGridsLayoutStyle();
                },
                deep: true
            }
        },
        methods: {
            createGridsLayoutStyle(){
                this.$nextTick(function(){
                    this.$refs.gridTemplet.querySelectorAll(".grids").forEach(x=>CreateGridsLayoutStyle(x));
                });
            },
            addDdGrid(){
                this.layout.push({"x":0,"y":0,"w":1,"h":1,"i":Date.now()});
            },
            removeGrid(){
                this.layout.pop();
            },
            submitGrid(){
                let newGrid = JSON.parse(JSON.stringify(this.layout)).map(x=>{
                    x.x++; x.y++;
                    return {x:x.x, y:x.y, w:x.w, h:x.h, l:0};
                });
                addDdGrid(newGrid).then(response=>{
                    let id = response.data;
                    if(id){
                        this.$set(this.templets, id, newGrid);
                    }
                });
            },
            removeTemplet(templetId){
                this.$Modal.confirm({
                    title: '确定该删除模板 ?',
                    onOk: () => {
                        deleteDdGrid(+templetId).then(response=>{
                            let re = response.data;
                            if(re){
                                this.$delete(this.templets,templetId);
                            }
                        });
                    }
                });
            }
        },
        mounted() {
            selectAllDdGrid().then(response=>{
                let datas = response.data;
                if(datas){
                    datas.forEach(x=> templets[x.key] = x.value);
                    this.templets = templets;
                }
            });
        }
    }
</script>

<style lang="less" type="text/less">
    #gridTemplet {
        .grids-list{
            border-bottom: 1px dashed #e8eaec;
            padding-bottom: 15px;
            margin-bottom: 15px;
            display:flex;
            ol{
                flex: 1;
                display:flex;
                align-items:center;
                margin-left: 5px;
                cursor: pointer;
            }
            & > li {
                width: 150px;
                height: 100px;
                line-height: 100px;
                cursor: pointer;
                display: inline-block;
                position: relative;
                ul{
                    width: inherit;
                    height: inherit;
                    list-style-type: none;
                    background: rgba(231,230,231,.25);
                    box-sizing: border-box;
                    .gs-w{
                        position: absolute;
                        background: rgb(231,230,231);
                        background-clip: content-box;
                        box-shadow: 0px 0px 2px rgba(0, 0, 0, .4);
                        border:3px solid transparent;
                        border-radius: 1px;
                        &:hover {
                            background: rgb(55,60,65);
                        }
                    }
                }
            }
        }
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

    .grids-conf{
        @bg-img:url("../../img/bg_w.png");
        .grid-layout-box{
            width: 100%;
            height:397px;
            background: @bg-img;
            border:1px solid rgba(0,0,0,.2);
            overflow: hidden;
        }
        .button-group {
            text-align: right;
            Button {
                width: 74px;
                background: @bg-img;
                border-radius: 5px 5px 0px 0px;
                border: 1px solid rgba(0,0,0,.2);
                border-bottom: 0px;
            }
        }
    }
</style>