<template>
    <div class="theme-drawer">
        <Drawer title="主题列表" :transfer="false" :inner="true" :mask="false" :width="390"  placement="left" v-model="isDrawerLeft">
            <div class="theme-templet">
                <template v-for="item in models">
                    <img :src="require('../../images/theme/' + item.img)" @click="themeSelect(item)" width=356 height=200 style="box-shadow:0px 0px 2px rgba(0,0,0,.6);cursor: pointer;"/>
                    <Divider dashed />
                </template>
            </div>
            <div class="drawer-footer">
                <ButtonGroup>
                    <Button @click="isDrawerRight=true" type="primary">高级设置</Button>
                </ButtonGroup>
            </div>
        </Drawer>

        <Drawer title="高级设置" :transfer="false" :inner="true" :width="406"  :styles="styles" v-model="isDrawerRight">
            <div style="overflow: hidden">
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
                <Row>
                    <Col span="4">庆祝特效：</Col>
                    <Col span="20">
                        <i-switch v-model="bgEffectsIsOpen" @on-change="bgEffectsIsOpenChange">
                            <span slot="open">开</span>
                            <span slot="close">关</span>
                        </i-switch>
                    </Col>
                </Row>
                <Row v-show="bgEffectsIsOpen">
                    <Col span="24">
                        <br>
                        <Tabs type="card" size="small">
                            <TabPane label="触发方式一">
                                <Row>
                                    <Col span="2">&nbsp;</Col>
                                    <Col span="22">
                                        轮播时间：
                                        <Checkbox v-model="timeCheckbox">
                                            <Input v-model="bgEffectsTime" type="number" placeholder="当前时间后每（分钟）轮播" style="width: 210px;margin-left: 5px;" :disabled="!timeCheckbox" />
                                        </Checkbox >
                                    </Col>
                                </Row>
                                <p style="margin: 6px 0;"></p>
                                <Row>
                                    <Col span="6">&nbsp;</Col>
                                    <Col span="18">
                                        <Checkbox  v-model="dateCheckbox">
                                            <DatePicker v-model="bgEffectsDate" type="datetime" placeholder="仅播放一次（年-月-日 时:分:秒）" style="width: 210px;margin-left: 5px;" :disabled="!dateCheckbox" :options="options"></DatePicker>
                                        </Checkbox >
                                    </Col>
                                </Row>
                                <p style="margin: 12px 0;"></p>
                                <Row>
                                    <Col span="2">&nbsp;</Col>
                                    <Col span="22">
                                        播放内容：
                                        <Input v-model="app.bgEffects.values" placeholder="(非必填) 如：新年快乐,618发发发" clearable style="width: 210px;margin-left: 20px;" clearable/>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane label="触发方式二">
                                <Row>
                                    <Col span="2">&nbsp;</Col>
                                    <Col span="22">
                                        数据URL：
                                        <Input placeholder="后端提供触发数据" style="width: 210px;margin-left: 5px;" :disabled="true" title="未上线"/>
                                        <Divider dashed style="margin: 15px 0;"/>
                                        返回格式说明：{"isOpen":true, "series":"新年快乐,618发发发"}
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
                <br/>
            </div>
            <div class="drawer-footer">
                <ButtonGroup>
                    <Button @click="submitConf()" type="primary">确定</Button>
                    <Button @click="isDrawerRight = false">取消</Button>
                </ButtonGroup>
            </div>
        </Drawer>
    </div>
</template>

<script>
    import chartConfCommon from "./../base-charts-drawer/charts/common";
    export default {
        props:["isDrawerOpen","app"],
        data() {
            return {
                models:[
                    {
                        name:"dark",
                        img:"dark.gif",
                        grid:[
                            {x: 1, y: 5, w: 1, h: 2, l: 0},
                            {x: 1, y: 3, w: 1, h: 2, l: 0},
                            {x: 1, y: 1, w: 1, h: 2, l: 0},
                            {x: 2, y: 1, w: 2, h: 2, l: 0},
                            {x: 4, y: 1, w: 1, h: 2, l: 0},
                            {x: 4, y: 3, w: 1, h: 2, l: 0},
                            {x: 2, y: 3, w: 2, h: 4, l: 0},
                            {x: 4, y: 5, w: 1, h: 2, l: 0}
                        ]
                    },
                    {
                        name:"customed",
                        img:"customed.jpg",
                        grid:[
                            {x: 1, y: 1, w: 1, h: 2, l: 0},
                            {x: 2, y: 1, w: 1, h: 2, l: 0},
                            {x: 3, y: 1, w: 1, h: 2, l: 0},
                            {x: 4, y: 1, w: 1, h: 2, l: 0},
                            {x: 1, y: 3, w: 2, h: 2, l: 0},
                            {x: 3, y: 3, w: 2, h: 2, l: 0},
                            {x: 1, y: 5, w: 4, h: 2, l: 0}
                        ]
                    }],
                styles: {
                    height: 'calc(100% - 90px)',
                    overflow: 'auto',
                    position: 'static'
                },
                themes: chartConfCommon.themes,
                isDrawerLeft:false,
                isDrawerRight:false,
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
                },
                bgEffectsIsOpen:false,
                bgEffectsValues:"",
                bgEffectsTime:"",
                bgEffectsDate:"",
                timeCheckbox:true,
                dateCheckbox:false,
            }
        },
        computed:{
            bgEffectsDateTime(){
                return this.app.bgEffects.datetime;
            }
        },
        watch:{
            isDrawerOpen(bool){
                this.isDrawerLeft = bool;
            },
            isDrawerLeft(bool){
                this.$emit("isDrawerOpen$Parent",bool,"themeDrawer");
            },
            timeCheckbox(v){
                this.dateCheckbox = !v;
            },
            dateCheckbox(v){
                this.timeCheckbox = !v;
            },
            bgEffectsDateTime(datatime){
                if(datatime){
                    this.bgEffectsIsOpen = true;
                    if(isNaN(datatime)){
                        this.dateCheckbox = true;
                        this.bgEffectsDate = new Date(datatime);
                    }else{
                        this.timeCheckbox = true;
                        this.bgEffectsTime = +datatime;
                    }
                }
            }
        },
        methods:{
            bgEffectsIsOpenChange(bool){
                this.$emit('openFireworks$Parent',bool);
            },
            themeSelect(theme){
                this.app.theme = theme.name;
                this.app.background="";
                this.submitConf(JSON.stringify(theme.grid));
            },
            submitConf(grid=`""`){
                let strDate="",strValues="";
                if(this.bgEffectsIsOpen){
                    let _hms = this.bgEffectsTime, _ymd = this.bgEffectsDate;
                    if(this.timeCheckbox && _hms){
                        strDate = +_hms;
                        if(strDate<5){
                            this.$Notice.error({title: '轮播时间不能小于5分钟!!!'});
                            return;
                        }
                    }
                    if(this.bgEffectsDate && (_ymd instanceof Date)){
                        if(_ymd.getTime() < Date.now()){
                            this.$Notice.error({title: '指定播放时间不能小于当前系统时间!!!'});
                            return;
                        }
                        strDate = this.$formatDate(_ymd);
                    }
                    strValues = this.app.bgEffects.values;
                }
                sessionStorage.setItem("bgEffects",`{"datetime":"${strDate}","values":"${strValues}"}`);
                sessionStorage.setItem("curTheme",`{"theme":"${this.app.theme}", "background":"${this.app.background}","grid":${grid}}`);
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
        .ivu-tabs{
            overflow: initial;
        }
    }
</style>