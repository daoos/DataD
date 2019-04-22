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
    import chartConfCommon from "./../base-charts-drawer/charts/common";
    export default {
        props:["isDrawerLeft","isDrawerRight","app"],
        data() {
            return {
                isDrawerRight:false,
                themes: chartConfCommon.themes
            }
        },
        methods:{
            submitConf(){
                //图表配置变动时也要提示
                // let pageId = this.$route.query.id;
                // if(!pageId){
                //     this.$Modal.confirm({
                //         title: '确定更换主题风格 ?',
                //         content:"当前页面尚未保存收藏，更换主题时页面会刷新。",
                //         onOk: () => {
                //             sessionStorage.setItem("curTheme",`{"theme":"${this.app.theme}", "background":"${this.app.background}"}`);
                //             window.location.reload();
                //         }
                //     });
                // }else{
                //     sessionStorage.setItem("curTheme",`{"theme":"${this.app.theme}", "background":"${this.app.background}"}`);
                //     window.location.reload();
                // }
                sessionStorage.setItem("curTheme",`{"theme":"${this.app.theme}", "background":"${this.app.background}"}`);
                window.location.reload();
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
            background:white url(../../images/bg.png);
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
            background:white url(../../images/bg.png);
        }
        .ivu-drawer-body{
            overflow: initial;
        }
    }
</style>