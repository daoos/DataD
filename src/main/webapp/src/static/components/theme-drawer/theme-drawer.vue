<template>
    <div class="theme-drawer">
        <Drawer title="主题" :transfer="false" :inner="true" :width="400" v-model="isDrawerRight">
            <Row>
                <Col span="4">默认方案：</Col>
                <Col span="20">{{app.theme}}</Col>
            </Row>
            <Row>
                <Col span="4">&nbsp;</Col>
                <Col span="20">
                    <RadioGroup v-model="app.theme" type="button" style="display: flex;flex-flow: column;">
                        <Radio class="item-group" :id="item.id" :label="item.id" v-for="item in themes">
                            <span class="item" :style="'background:'+ color" v-for="color in item.colors"></span>
                        </Radio>
                    </RadioGroup>
                </Col>
            </Row>
            <Divider dashed/>

            <Row>
                <Col span="4">背景颜色：</Col>
                <Col span="20">
                    <ColorPicker v-model="app.background" alpha recommend size="small"/>
                </Col>
            </Row>
            <Row>
                <Col span="4">&nbsp;</Col>
                <Col span="20">
                    <div class="setting-bg" :style="'background:'+app.background"></div>
                </Col>
            </Row>
            <Divider dashed/>

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
    export default {
        props:["isDrawerLeft","isDrawerRight","app"],
        data() {
            return {
                isDrawerRight:false,
                themes:[
                    {id:"customed", colors: ["#c23531","#2f4554","#61a0a8","#d48265","#91c7ae","#749f83","#ca8622","#bda29a"]},
                    {id:"dark",  colors: ["#dd6b66","#759aa0","#e69d87","#8dc1a9","#ea7e53","#eedd78","#73a373","#73b9bc"]},
                    {id:"shine", colors: ["#c12e34","#e6b600","#0098d9","#2b821d","#005eaa","#339ca8","#cda819","#32a487"]},
                    {id:"infographic", colors: ["#c1232b","#27727b","#fcce10","#e87c25","#b5c334","#fe8463","#9bca63","#fad860"]},
                    {id:"macarons", colors: ["#2ec7c9","#b6a2de","#5ab1ef","#ffb980","#d87a80","#8d98b3","#e5cf0d","#97b552"]},
                    {id:"roma", colors: ["#e01f54","#001852","#f5e8c8","#b8d2c7","#c6b38e","#a4d8c2","#f3d999","#d3758f"]},
                    {id:"vintage", colors: ["#d87c7c","#919e8b","#d7ab82","#6e7074","#61a0a8","#efa18d","#787464","#cc7e63"]}
                ],
                //theme:"",
                //background:""
            }
        },
        methods:{
            submitConf(){
                //图表配置变动时也要提示
                let pageId = this.$route.query.id;
                if(!pageId){
                    this.$Modal.confirm({
                        title: '确定更换主题风格 ?',
                        content:"当前页面尚未保存收藏，更换主题时页面会刷新。",
                        onOk: () => {
                            sessionStorage.setItem("curTheme",`{"theme":"${this.app.theme}", "background":"${this.app.background}"}`);
                            window.location.reload();
                        }
                    });
                }else{
                    sessionStorage.setItem("curTheme",`{"theme":"${this.app.theme}", "background":"${this.app.background}"}`);
                    window.location.reload();
                }
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .theme-drawer {
        #dark {
            background: #0e284d;
        }
        #shine,#customed,#infographic,#macarons,#roma{
            background:white url(./../../img/bg.png);
        }
        #vintage{
            background: rgba(254,248,239,1);
        }
        .item-group {
            background: white;
            width: 265px;
            border-radius: 5px!important;
            margin-top: 10px!important;
            .item{
                border-radius: 5px;
                display: inline-block;
                margin: 5px 10px 5px 0px;
                width:20px;
                height:20px;
            }
        }
        .setting-bg {
            width:265px;
            height:132px;
            margin-top:10px;
            border:1px solid #dcdee2;
            padding:5px;
            background:white url(./../../img/bg.png);
        }
        .ivu-drawer-body{
            overflow: initial;
        }
    }
</style>