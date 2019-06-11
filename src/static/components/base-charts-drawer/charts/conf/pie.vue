<template>
    <div class="charts-pie">
        <charts-common ref="commonConf" :chartName="chartName" :isDisabledUrl="isDisabledUrl"></charts-common>

        <Row>
            <Col span="3" class="tab">图例配置：</Col>
            <Col span="21" class="tab">
            <ButtonGroup size="small">
                <Button icon="md-add" type="primary" @click="addRow">增加</Button>
                <Button icon="md-close" @click="removeRow">删除</Button>
            </ButtonGroup>
            </Col>
        </Row>
        <Row>
            <Col span="24">
                <Table highlight-row border ref="dataTable" :columns="columns" :data="data"></Table>
            </Col>
        </Row>
        <Row>
                <Col span="24" style="text-align: right;margin-top:20px;font-size: 9px;">
                    <Tooltip placement="bottom-end" max-width=500>
                    数据返回格式说明：<Icon type="md-help-circle" size="16"/>
                    <pre slot="content">
{
    "series":{
        "图例A":55,
        "图例B":45
     }
}</pre>
                    </Tooltip>
                </Col>
        </Row>
    </div>
</template>

<script>
    import common from './common.vue';
    export default {
        props:["legends","isDisabledUrl"],
        components: {
            'charts-common': common,
        },
        data () {
            return {
                chartName:"饼状图",
                columns: [
                    {
                        type: 'selection',
                        align: 'center',
                        width: 60,
                    },
                    {
                        title: '名称',
                        key: 'legendTitle',
                        render: (h, params) => {
                            let _legends = this.legends;
                            if(_legends && _legends.length > 0){
                                return h('Select',{
                                    props: {
                                        value: params.row[params.column.key],
                                        placeholder:`必填`
                                    },
                                    on: {
                                        'on-change':(val) => {
                                            this.data[params.index][params.column.key] = val;
                                        }
                                    }
                                },_legends.map(x=> h('Option',{props: {value: x}},x)));
                            }else{
                                return h('Input',{
                                    props: {
                                        value: params.row[params.column.key],
                                        placeholder:`必填`,
                                        clearable:true,
                                    },
                                    on: {
                                        'on-blur':(val) => {
                                            this.data[params.index][params.column.key] = val.target.value;
                                        },
                                        'on-clear':(val) => {
                                            this.data[params.index][params.column.key] = "";
                                        }
                                    }
                                });
                            }
                        }
                    },
                    {
                        width: 95,
                        title: '颜色',
                        key: 'color',
                        render: (h, params) => {
                            return h('ColorPicker',{
                                props: {
                                    recommend:true,
                                    alpha:true,
                                    value: params.row[params.column.key],
                                },
                                on: {
                                    'on-change':(val) => {
                                        this.data[params.index][params.column.key] = val;
                                    }
                                }
                            });
                        }
                    }
                ],
                data: [],
                rowNumber:1
            }
        },
        methods: {
            addRow(){
                let _this = this;
                this.data.push({
                    legendTitle: (this.legends && this.legends.length>0)?this.legends[0]:'图例'+(_this.rowNumber++),
                    color: ''
                });
            },
            removeRow(){
                let indexs = [];
                [... this.$refs.dataTable.$el.querySelectorAll("td .ivu-checkbox-input")].forEach((x,index)=>{
                    if(x.checked) indexs.push(index);
                });
                let newIndexs = indexs.map((val, idx)=>{return val - idx;});
                newIndexs.forEach((index)=>{
                    this.data.splice(index, 1);
                })
            },
            initConfig(config){
                let _api = config["api"] || [];
                this.data = Array.isArray(_api)?_api:JSON.parse(_api);
                this.$refs.commonConf.initConfig(config);
            },
            submitConf(){
                let commonConf = this.$refs.commonConf.submitConf();
                if(commonConf){
                    if(this.data.length > 1){
                        let isEmptyValidate = false;
                        let legendTitleLength = new Set([... this.data.map(x=>{
                            if(x.legendTitle.trim()==""){
                                isEmptyValidate = true;
                            }
                            return x.legendTitle;
                        })]);
                        if(isEmptyValidate){
                            this.$Notice.error({title: '图例名称不能为空!!!'});
                            return;
                        }
                        if(this.data.length != legendTitleLength.size){
                            this.$Notice.error({title: '图例名称不能重复!!!'});
                            return;
                        }
                        commonConf.api = JSON.stringify(this.data); //防止引用传递，实现深度克隆数组
                        return commonConf;
                    }else{
                        this.$Notice.error({title: '请配置图例列表（图例数必大于1）!!!'});
                        return;
                    }
                }else{
                    return;
                }
            }
        }
    }
</script>