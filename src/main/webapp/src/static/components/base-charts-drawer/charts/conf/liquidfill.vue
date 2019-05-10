<template>
    <div class="charts-liquidfill">
        <charts-common ref="commonConf" :chartName="chartName"></charts-common>

        <Row>
            <Col span="3" class="tab">显示形状：</Col>
            <Col span="9">
                <Select v-model="seriesType" size="large"  style="width:200px">
                    <Option value="circle">圆形<Icon type="ios-disc" style="float:right;"/></Option>
                    <Option value="diamond">菱形<Icon type="ios-square" style="float:right;transform: rotateZ(45deg)"/></Option>
                    <Option value="triangle">三角形<Icon type="md-play" style="float:right;transform: rotateZ(-90deg)"/></Option>
                    <Option value="pin">大头钉形<Icon type="ios-water" style="float:right;"/></Option>
                    <Option value="rect">正方形<Icon type="ios-square" style="float:right;"/></Option>
                    <Option value="roundRect">圆角正方形<Icon type="md-square" style="float:right;"/></Option>
                </Select>
            </Col>
            <Col span="3" class="tab">颜色：</Col>
            <Col span="9">
                <ColorPicker v-model="color"  size="large" recommend alpha/>
            </Col>
        </Row>
        <Divider dashed/>
        <Row>
            <Col span="24" style="text-align: right;font-size: 9px;">
            <Tooltip placement="bottom-end" max-width=300 >
                数据返回格式说明：<Icon type="md-help-circle" size="16"/>
<pre slot="content">
{
    "series":0.5  //取值：0 至 1
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
                chartName:"水位图",
                seriesType:"circle",
                color:""
            }
        },
        methods: {
            initConfig(config){
                let _aip = config["api"];
                if(_aip){
                    this.seriesType =_aip.seriesType;
                    this.color = _aip.color;
                }
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    commonConf.api = {
                        seriesType:this.seriesType,
                        color:this.color
                    };
                    return commonConf;
                }else{
                    return;
                }
            }
        }
    }
</script>