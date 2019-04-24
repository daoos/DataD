<template>
    <div class="charts-number">
        <charts-common ref="commonConf" :chartName="chartName"></charts-common>

        <Row>
            <Col span="3" class="tab">显示形状：</Col>
            <Col span="9">
                <Select v-model="seriesType" size="large" style="width:200px">
                    <Option value="default">默认</Option>
                    <Option value="particle">特性一</Option>
                </Select>
            </Col>
            <Col span="3" class="tab">颜色：</Col>
            <Col span="9">
                <ColorPicker v-model="color"  size="large" recommend alpha/>
            </Col>
        </Row>
        <Divider dashed/>
    </div>
</template>

<script>
    import common from './common.vue';
    export default {
        components: {
            'charts-common': common,
        },
        data() {
            return {
                chartName:"数字图",
                seriesType:"default",
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