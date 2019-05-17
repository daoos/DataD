<template>
    <div class="charts-common">
        <Row>
            <Col span="24" class="charts-name">-- {{ chartName }} --</Col>
        </Row>
        <Row>
            <Col span="3" class="tab">图表名称：</Col>
            <Col span="9"><Input v-model="title" placeholder="非必填..." clearable size="large" style="width: 200px"/></Col>
            <Col span="3" class="tab">模块布局：</Col>
            <Col span="9">
                <Select v-model="layout" size="large"  style="width:200px">
                    <Option :value=0>纵向</Option>
                    <Option :value=1>横向</Option>
                    <Option :value=2>X*2</Option>
                    <Option :value=3>X*3</Option>
                    <Option :value=4>X*4</Option>
                    <Option :value=5>X*5</Option>
                    <Option :value=6>X*6</Option>
                </Select>
            </Col>
        </Row>
        <Divider dashed/>
        <Row>
            <Col span="3" class="tab">刷新频率：</Col>
            <Col span="9"><InputNumber v-model="interval" :max="86400" :min="1" placeholder="默认：4秒" size="large" style="width: 80px;"/>（单位：秒）</Col>
            <Col span="3"  v-show="!isDisabledUrl" class="tab">数据URL：</Col>
            <Col span="9" v-show="!isDisabledUrl"><Input v-model="url" type="url" placeholder="http://...(为空时为模拟数据)" clearable size="large" style="width: 200px"/></Col>
        </Row>
        <Divider dashed/>
    </div>
</template>

<script>
    export default {
        props:["chartName","isDisabledUrl"],
        data() {
            return {
                chartType:"line",
                title:"",
                url:"",
                interval:4,
                layout:0
            }
        },
        methods: {
            initConfig(config){
                if(typeof(config)=="object"){
                    this.chartType = config.chartType || "line";
                    this.title = config.title ||"";
                    this.url = config.url || "";
                    this.interval = config.interval || 4;
                    this.layout = config.layout || 0;
                }else{
                    this.chartType = "line";
                    this.title = "";
                    this.url = "";
                    this.interval = 4;
                    this.layout = config;
                }
            },
            submitConf(){
                let _this = this;
                return {
                    chartType:_this.chartType,
                    title:_this.title,
                    url:_this.url,
                    interval:_this.interval,
                    layout:_this.layout
                };
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-common{
        .charts-name{
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 25px;
            text-align: center;
        }
    }
</style>