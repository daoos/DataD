<template>
    <div class="charts-map">
        <charts-common ref="commonConf" :chartName="chartName"></charts-common>
        <Row>
            <Col span="3" class="tab">选择国家：</Col>
            <Col span="9">
                <Select placeholder="请选择（默认：中图）" style="width:200px">
                    <Option value="world" disabled>世界</Option>
                    <Option value="china">中国</Option>
                    <Option value="thailand" disabled>泰国</Option>
                    <Option value="usa" disabled>美国</Option>
                    <Option value="britain" disabled>英国</Option>
                </Select>
            </Col>
            <Col span="3" class="tab" title="返回数据的最大小值">数据范围：</Col>
            <Col span="9">
                <InputNumber :max="999998" :min="0" v-model="min" placeholder="Min:0"></InputNumber>
                &nbsp;&nbsp;至&nbsp;&nbsp;
                <InputNumber :max="999999" :min="1" v-model="max"  placeholder="Max:100"></InputNumber>
            </Col>
        </Row>
        <Row>
            <Col span="23" style="text-align: right;margin-top: 20px;font-size: 9px;">
                <Tooltip placement="bottom" max-width=300 >
                    数据返回格式说明：<Icon type="md-help-circle" size="16"/>
<pre slot="content">
{
    "series":[
        {name:"北京", value:100},
        {name:"长沙", value:60},
        {name:"上海", value:98, to:"北京"},
        {name:"广州", value:90, to:"北京"},
        {name:"深圳", value:75, from:"北京"},
        {name:"武汉", value:60, from:"上海"}
    ]
}</pre>
                </Tooltip>
            </Col>
        </Row>
    </div>
</template>

<script>
    import common from './common.vue';
    export default {
        components: {
            'charts-common': common,
        },
        data () {
            return {
                chartName:"地图",
                max:100,
                min:0
            }
        },
        methods: {
            initConfig(config){
                let _aip = config["api"];
                if(_aip){
                    this.max =_aip.max;
                    this.min = _aip.min;
                }
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    commonConf.api = {
                        max:this.max,
                        min:this.min
                    };
                    return commonConf;
                }else{
                    return;
                }
            }
        }
    }
</script>