<template>
    <div class="charts-common">
        <Row>
            <Col span="24" class="charts-name">-- {{ chartName }} --</Col>
        </Row>
        <Row>
            <Col span="3" class="tab">图表名称：</Col>
            <Col span="9"><Input v-model="title" placeholder="非必填..." clearable size="large" style="width: 200px"/></Col>
            <Col span="3" class="tab">数据URL：</Col>
            <Col span="9"><Input v-model="url" type="url" placeholder="http://...(为空时为模拟数据)" clearable size="large" style="width: 200px" :disabled="isDisabledUrl" :title="isDisabledUrl?'《内置图表》数据URL由内部提供':''"/></Col>
        </Row>
        <Divider dashed/>
        <Row>
            <Col span="3" class="tab">刷新频率：</Col>
            <Col span="9"><InputNumber v-model="interval" :max="86400" :min="1" :formatter="value => `${value} 秒`" placeholder="默认：30秒" size="large" style="width: 200px;"/></Col>
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
    </div>
</template>

<script>
    export default {
        props:["chartName"],
        data() {
            return {
                baseChartType:"", //业务（内置）图表拥有属性
                chartType:"line",
                title:"测试图表",
                url:"",
                interval:4,
                layout:0
            }
        },
        computed:{
            isDisabledUrl(){
                return this.baseChartType||this.baseChartType==""?true:false;
            }
        },
        methods: {
            initConfig(config){
                this.baseChartType = config.baseChartType;
                if(typeof(config)=="object"){
                    this.chartType = config.chartType;
                    this.title = config.title;
                    this.url = config.url;
                    this.interval = config.interval;
                    this.layout = config.layout;
                }else{
                    this.chartType = "line";
                    this.title = "测试图表";
                    this.url = "";
                    this.interval = 4;
                    this.layout = config;
                }
            },
            submitConf(){
                let _this = this;
                // if(!_this.title){
                //     this.$Notice.error({title: '请输入图表名称!!!'});
                //     return;
                // };
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