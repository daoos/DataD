<template>
    <div class="charts-common">
        <Row>
            <Col span="3" class="tab">图表名称：</Col>
            <Col span="9"><Input v-model="title" placeholder="非必填..." clearable size="large" style="width: 200px"/></Col>
            <Col span="3" class="tab">数据URL：</Col>
            <Col span="9"><Input v-model="url" type="url" placeholder="http://...(为空时为模拟数据)" clearable size="large" style="width: 200px" /></Col>
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
        <Row>
            <Col span="3" class="tab">刷新方式：</Col>
            <Col span="9">
            <RadioGroup v-model="refurbishMode" size="large">
                <Radio label="add">追加</Radio>
                <Radio label="cover">覆盖</Radio>
            </RadioGroup>
            </Col>
            <Col span="12" class="tab">
                <Icon type="md-help-circle" size="18"/>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Icon type="ios-copy" size="18"/>
                &nbsp;&nbsp;
            </Col>
        </Row>
        <Divider dashed/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                chartType:"line",
                title:"",
                url:"",
                interval:30,
                refurbishMode:"add",
                layout:0,
            }
        }
    }
</script>

<style lang="less" type="text/less">
    .charts-common{
        .tab{
            font-weight: bold;
            text-align: right;
            padding-top: 5px;
        }
    }
</style>