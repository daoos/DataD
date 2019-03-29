<template>
    <div class="grids-drawer">
        <Drawer title="模板" :transfer="false" :inner="true" :mask="false" :width="190" :styles="styles" placement="left" v-model="isDrawerLeft">
            <ul id="gridTemplet" ref="gridTemplet">
                <template v-for="key in Object.keys(templets)">
                    <li :id="'grid' + key"  :data-id="key" class="grids" >
                        <ul>
                            <li :data-x="value.x" :data-y="value.y" :data-w="value.w" :data-h="value.h" :data-l="value.l" class="gs-w" v-for="value in templets[key]"></li>
                        </ul>
                    </li>
                    <div class="divider-horizontal"></div>
                </template>
            </ul>
            <div class="drawer-footer">
                <Button  @click="isDrawerLeft = false">取消</Button>
                <Button type="primary" @click="isDrawerRight = true">添加</Button>
            </div>
        </Drawer>
        <Drawer title="新添模板" :transfer="false" :inner="true" :width="590" :styles="styles" v-model="isDrawerRight">
            <nav>
                <Divider dashed orientation="left"><Icon type="md-open" /> 最大尺寸：6 * 4</Divider>
                <div style="text-align: right">
                    <ButtonGroup size="small" class="button-group">
                        <Button icon="md-add-circle" @click="addGrid">添加</Button>
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
                                   :i="item.i">
                        </grid-item>
                    </grid-layout>
                </div>
            </nav>
            <div class="drawer-footer">
                <Button  @click="isDrawerLeft = false">取消</Button>
                <Button type="primary" @click="submitGrid">确定</Button>
            </div>
        </Drawer>
    </div>
</template>
<script>
    /**
     * 模板格子布局样式
     */
    const createGridsLayoutStyle = function(ElemThis){
        let options = {
            widget_base_dimensions:[100,50],
            margin_base:4,
            max_cols:4,
            max_rows:6,
        };

        function _grids(obj) {
            this.elem = obj;
            this.gridOptions={
                width : this.elem.clientWidth/options.max_cols,
                height: this.elem.clientHeight/options.max_rows
            };
            this.init();
            this.createStyle(options.max_rows);
            return this;
        };

        let fn = _grids.prototype;

        fn.init = function() {
            this.elem.querySelectorAll("ul").forEach(x=>{
                x.style.width = this.elem.clientWidth;
                x.style.height = this.elem.clientHeight;
            })
        };

        fn.createStyle = function(count){
            let elemId = this.elem.id;
            let [_gw,_gh] = [this.gridOptions.width,this.gridOptions.height];
            const _loop = function(i, str=""){
                let [_width,_height] = [i*_gw, i*_gh], [_let,_top] = [_width-_gw, _height-_gh];
                for(let j=2; j<=count; j++){
                    str+=`
                #${elemId} [data-w="${i}"][data-l="${j}"] li{ width: ${(_width/j)-5}px;}`;
                }
                str+=`
                #${elemId} [data-w="${i}"] { width:${_width}px; }
                #${elemId} [data-h="${i}"] { height:${_height}px; }
                #${elemId} [data-x="${i}"] { left:${_let}px; }
                #${elemId} [data-y="${i}"] { top:${_top}px; }
                `;
                if(i > 1) str = _loop(i - 1, str);
                return str;
            };
            let strStyle = _loop(count);
            strStyle += `
            #${elemId} [data-l="0"] { flex-flow: column; }
            #${elemId} [data-l="1"] { flex-flow: row; }
            #${elemId} .gs-w{ min-width:${_gw}px;  min-height:${_gh}px; border-width:${options.margin_base/2}px; }
            #${elemId} [data-l]:not([data-l="0"]):not([data-l="1"]) { flex-wrap: wrap; }
            #${elemId} [data-l="0"] li{ flex:1; }
            #${elemId} [data-l="1"] li{ flex:1; }
            `;
            let styleId = `gs-${elemId}`;
            let styleElement = document.querySelector("#"+styleId);
            if(styleElement && styleElement.tagName=="STYLE"){
                styleElement.innerHTML = strStyle;
            }else{
                let style = document.createElement('style') ;
                style.id = styleId;
                style.type = 'text/css';
                style.innerHTML = strStyle ;
                document.getElementsByTagName('HEAD').item(0).appendChild(style) ;
            }
        };
        const g = new _grids(ElemThis);
    };

    import VueGridLayout from 'vue-grid-layout';

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
        props:["isDrawerLeft"],
        components: {
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem
        },
        data() {
            return {
                isDrawerRight:false,
                styles: {
                    height: 'calc(100% - 100px)',
                    overflow: 'auto',
                    position: 'static'
                },
                templets: {},
                layout: []
            }
        },

        watch: {
            templets: {
                handler(newName, oldName) {
                    this.$nextTick(function(){
                        this.$refs.gridTemplet.querySelectorAll(".grids").forEach(x=>createGridsLayoutStyle(x));
                    });
                },
                deep: true
            }
        },
        methods: {
            addGrid(){
                this.layout.push({"x":0,"y":0,"w":1,"h":1,"i":Date.now()});
            },
            removeGrid(){
                this.layout.pop();
            },
            submitGrid(){
                this.$set(this.templets, Date.now(), JSON.parse(JSON.stringify(this.layout)).map(x=>{
                    x.x++; x.y++;
                    return x;
                }));
            }
        },
        mounted() {

            this.templets = templets;
        }
    }
</script>

<style scoped lang='less'>
    #gridTemplet {
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
        .divider-horizontal:not(:last-child){
            display: block;
            height: 1px;
            width: 100%;
            min-width: 100%;
            margin: 14px auto;
            clear: both;
            background: 0 0;
            border-top: 1px dashed #e8eaec;
        }
    }

    .grid-layout-box{
        width: 100%;
        height:397px;
        background: rgb(231,230,231);
        border:1px solid rgba(0,0,0,.2);
        overflow: hidden;
    }

    .button-group {
        text-align: right;
        Button {
            width: 74px;
            border-radius: 5px 5px 0px 0px;
            border: 1px solid rgba(0,0,0,.2);
            border-bottom: 0px;
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
</style>